# vue-draggable
Draggable plug-in can use mobile phone and PC at the same time

how can use

```
import Draggable from './draggable'

Vue.use(Draggable)
```


#First example

```
<ul class="scene-list">
      <li v-for="(item, index) in list"
          :key="item.id"
          v-dgdrop:onDrop="index"
          v-dgdrag:onDragStart="index"
          :draggable="true"></li>
</ul>

function allowDrop(ev) {
    ev.preventDefault()
}



methods: {
        /**
         * When there is bing.value
         * @bing.vaue
         * @event
         */
        onDrop(index, event) {
            document.removeEventListener('dragover', allowDrop)
            console.log(index, event)
        },
        onDragStart(index, event) {
            document.addEventListener('dragover', allowDrop)
            console.log(index, event)
        }
 }
```
 
 # Second example
 
```
 <ul class="scene-list">
      <li v-for="(item, index) in list"
          :key="item.id"
          v-dgdrop:onDrop
          v-dgdrag:onDragStart
          :draggable="true"></li>
</ul>

function allowDrop(ev) {
    ev.preventDefault()
}



methods: {
        /**
         * When there is no bing.value
         * @event
         */
        onDrop(event) {
            document.removeEventListener('dragover', allowDrop)
            console.log(event)
        },
        onDragStart(event) {
            document.addEventListener('dragover', allowDrop)
            console.log(event)
        }
 }
```
 
  # Three example
  
```
<div v-dgdrop:onDrop></div>
<div v-dgdrag:onDragStart :draggable="true"></div>

function allowDrop(ev) {
    ev.preventDefault()
}



methods: {
        /**
         * When there is no bing.value
         * @event
         */
        onDrop(event) {
            document.removeEventListener('dragover', allowDrop)
            const data = event.getData('hello')
            console.log(event, data)
        },
        onDragStart(event) {
            document.addEventListener('dragover', allowDrop)
            event.setData('hello')
            console.log(event)
        }
 }
```
 
 



