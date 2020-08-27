class Draggable {
    constructor() {
        this.dragElementPosition = {}
        this.T = null
        this.cloneDragElement = null
        this.expandEvent()
    }

    expandEvent() {
        Event.prototype.setData = data => {
            Event.prototype.customData = data
        }

        Event.prototype.getData = () => {
            const data = Event.prototype.customData
            Event.prototype.customData = null
            return data
        }
    }

    setCloneNodeStyle(cloneNode, originalNode) {
        const { style } = cloneNode
        const {
            width, height, left, top
        } = originalNode.getBoundingClientRect()
        const { textAlign, listStyle } = window.getComputedStyle(originalNode)
        cloneNode.removeAttribute('data-drop')
        style.textAlign = textAlign
        style.listStyle = listStyle
        style.position = 'fixed'
        style.left = `${left}px`
        style.top = `${top}px`
        style.width = `${width}px`
        style.height = `${height}px`
        style.transform = 'translate(0,0)'
        style.zIndex = 5000
        style.margin = 0
        style.opacity = 0.5
    }

    onTouchMove(e) {
        e.preventDefault()
        this.cloneDragElement.style.transform = `translate(${e.touches[0].pageX - this.dragElementPosition.left}px, ${e.touches[0].pageY - this.dragElementPosition.top}px)`
    }

    findDropElement(e) {
        const eles = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        return eles.find(item => item.getAttribute('data-drop'))
    }

    _dispatchEvent(element, event) {
        element && element.dispatchEvent(event)
    }

    onTouchEnd(e) {
        const dropEvent = new Event('dg-drop')
        dropEvent.changedTouches = e.changedTouches
        this._dispatchEvent(this.findDropElement(e), dropEvent)
        document.body.removeChild(this.cloneDragElement)
        window.removeEventListener('touchmove', this.onTouchmove)
        window.removeEventListener('touchend', this.onTouchEnd)
    }

    cloneElement(el) {
        this.cloneDragElement = el.cloneNode(true)
        this.setCloneNodeStyle(this.cloneDragElement, el)
        document.body.appendChild(this.cloneDragElement)
    }

    clearTimeout() {
        this.T && clearTimeout(this.T)
    }

    onTouchStart(ev, el, binding, vNode) {
        this.T = setTimeout(() => {
            this.bindElementEvent(el, 'mobileDragStart', binding, vNode)
            el.removeEventListener('dg-drag-start', el.mobileDragStart)
            el.addEventListener('dg-drag-start', el.mobileDragStart)
            const dragStartEvent = new Event('dg-drag-start')
            dragStartEvent.changedTouches = ev.changedTouches
            this._dispatchEvent(el, dragStartEvent)
            this.dragElementPosition = {
                left: ev.touches[0].pageX,
                top: ev.touches[0].pageY
            }
            this.cloneElement(el)
            window.addEventListener('touchmove', this.onTouchMove = this.onTouchMove.bind(this), { passive: false })
            window.addEventListener('touchend', this.onTouchEnd = this.onTouchEnd.bind(this))
        }, 300)
    }

    bindElementEvent(el, eventName, binding, vNode) {
        el[eventName] = (ev) => {
            vNode.context[binding.arg](binding.value !== undefined ? binding.value : ev, binding.value !== undefined ? ev : undefined)
        }
    }

    addTouchEvent(el, binding, vNode) {
        el.touchStart = (ev) => {
            this.onTouchStart(ev, el, binding, vNode)
        }
        el.addEventListener('touchstart', el.touchStart, false)
        el.addEventListener('touchmove', this.clearTimeout = this.clearTimeout.bind(this), false)
        el.addEventListener('touchend', this.clearTimeout = this.clearTimeout.bind(this), false)
    }

    removeTouchEvent(el) {
        el.removeEventListener('touchstart', el.touchStart)
        el.removeEventListener('touchmove', this.clearTimeout)
    }

    addDragEventListener(el, binding, vNode) {
        this.bindElementEvent(el, 'pcDragStart', binding, vNode)
        el.addEventListener('dragstart', el.pcDragStart)
        // 移动端
        this.addTouchEvent(el, binding, vNode)
    }

    removeDragEventListener(el) {
        el.removeEventListener('dragstart', el.pcDragStart)
        // 移动端
        this.removeTouchEvent(el)
    }

    addDropEventListener(el, binding, vNode) {
        this.bindElementEvent(el, 'pcDrop', binding, vNode)
        el.addEventListener('drop', el.pcDrop)
        // 移动端
        this.bindElementEvent(el, 'mobileDrop', binding, vNode)
        el.addEventListener('dg-drop', el.mobileDrop)
        el.setAttribute('data-drop', true)
    }

    removeDropEventListener(el) {
        el.removeEventListener('drop', el.pcDrop)
        // 移动端
        el.removeEventListener('dg-drop', el.mobileDrop)
        el.removeAttribute('data-drop')
    }
}

const DGDraggable = new Draggable()

export default {
    install(Vue) {
        Vue.directive('dgdrag', {
            bind(el, binding, vNode) {
                if (!el.draggable) return
                DGDraggable.addDragEventListener(el, binding, vNode)
            },
            update(el, binding, vNode) {
                if (!el.draggable) return
                DGDraggable.removeDragEventListener(el, binding, vNode)
                DGDraggable.addDragEventListener(el, binding, vNode)
            },
            unbind(el, binding, vNode) {
                DGDraggable.removeDragEventListener(el, binding, vNode)
            }
        })

        Vue.directive('dgdrop', {
            bind(el, binding, vNode) {
                DGDraggable.addDropEventListener(el, binding, vNode)
            },
            update(el, binding, vNode) {
                DGDraggable.removeDropEventListener(el, binding, vNode)
                DGDraggable.addDropEventListener(el, binding, vNode)
            },
            unbind(el, binding, vNode) {
                DGDraggable.removeDropEventListener(el, binding, vNode)
            }
        })
    }
}
