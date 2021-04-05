<template>
  <div id="list">
    <div id="deviation_list">        
      <div v-for="item in deviationList" :key="item.id" class="item_data" :data-name="item.title" :data-src="item.src" :data-id="item.id">
        <p>
          {{ item.title }}
        </p>
      </div>
    </div>
    <div id="image_holder">
      <img src="" id="floating_image">
    </div>
  </div>
</template>

<script>
import { createRequest } from "../assets/requester.js"
export default {
  name: 'List',
  data(){
    return {
      deviationList: [],
      offset: 0,
      username: null,
      lastItem: null,
      requestLoading: false,
      imageYDegrees: 0,
      fullGaleryLoaded: false,

    }
  },
  methods: {
    // New user Selected
    newUser(username){
      this.username = username
      this.offset = 0
      this.deviationList = []
      this.imageYDegrees = false
      this.fullGaleryLoaded = false

      this.newRequest()
    },
    // Request 60 next deviations
    newRequest(){
      if (!this.requestLoading && !this.fullGaleryLoaded){
        this.requestLoading = true

        createRequest(this.username, this.offset, this.pushList)
      }
    },
    // Push deviations to the data
    pushList(deviations){

      if (deviations.length < 60){        
        this.fullGaleryLoaded = true
      }

      for (let dev of deviations){
        this.deviationList.push({
          id: this.offset,
          title: dev.querySelector('title').textContent,
          src: dev.querySelector('content').getAttribute('url'),
        })                
        this.offset++
      }

      setTimeout(() => {
        let stack = document.getElementsByClassName('item_data')
        for (let item of stack){
          item.addEventListener('mousemove', event => {
            this.imageYAnimation(item, event)

            if (!this.lastItem || item.dataset.id != this.lastItem.dataset.id){
              this.newElemHover(item)
            }
          })
        }
      }, 500)

      this.requestLoading = false
    },  
    // Animation in MouseHover
    newElemHover(newElem){
      const floating_image = document.getElementById('floating_image')
      floating_image.style.transform = "scale(0)"
      setTimeout(() => {
        if (this.lastItem){
          this.lastItem.children[0].style.zIndex = "1"
        }      
        floating_image.src = newElem.dataset.src
        newElem.children[0].style.zIndex = "3"

        floating_image.style.transform = "scale(1)"
        this.lastItem = newElem
      }, 200)
    },
    // Animation in MouseMove
    imageYAnimation(item, event) {   
      let itemRect = item.getBoundingClientRect()
      let itemHeightOffset = itemRect.height / 2

      this.imageYDegrees = (event.offsetY - itemHeightOffset)/ (itemHeightOffset / 15)
    },
  },
  mounted() {
    // Animation on Scroll
    const image_holder = document.getElementById('image_holder')

    window.addEventListener('scroll', () => {
      image_holder.style.top = `${window.pageYOffset + (window.innerHeight / 2)}px`

      let stack = document.getElementsByClassName('item_data')
      let center = window.innerHeight * 0.5

      for (let elem of stack){
        let rect = elem.getBoundingClientRect()
        if (rect.top < center && rect.bottom > center){
          if (!this.lastItem || elem.dataset.id != this.lastItem.dataset.id){
            this.newElemHover(elem)
          }
          break
        }
      }

      if (window.pageYOffset + window.innerHeight > document.body.getBoundingClientRect().height - window.innerHeight/2 ){
        this.newRequest()
      }
    })
    // X MouseMove Animation
    document.body.addEventListener('mousemove', event => {
      // Image X Rotation
      image_holder.style.top = `${event.pageY}px`
      image_holder.style.left = `${event.pageX}px`

      let x_pos = event.pageX - window.innerWidth / 2
      let x_inAngle = x_pos / ((window.innerWidth / 2)/30)
      
      image_holder.style.transform = `perspective(300px) rotateY(${-x_inAngle}deg) rotateX(${this.imageYDegrees}deg)`

      // Image perspective width
      let width = (window.innerWidth/100) * 30
      let degrees = x_inAngle
      if (degrees < 0){
        degrees = -degrees
      }

      let new_width = 100 - (degrees / (90 / 100))

      image_holder.style.width = `${(width/100) * new_width}px`

      // Image perspective height
      let height = (window.innerWidth/100) * 30
      degrees = this.imageYDegrees
      if (degrees < 0){
        degrees = -degrees
      }

      let new_height = 100 - (degrees / (90 / 100))

      image_holder.style.height = `${(height/100) * new_height}px`
    })
    
    // Hide the card while leaving the list
    document.getElementById('list').addEventListener('mouseleave', () => {      
      setTimeout(() => {
        document.getElementById('floating_image').style.transform = "scale(0)"
        this.lastItem = null
      }, 200)
    })
  }
}
</script>

<style scoped>
#list
{
  width: 100vw;
  background-color: rgb(19, 19, 19);
  display: none;
}
#deviation_list
{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

}
.item_data
{
  width: 100vw;
  font-size: 5vw;

  text-align: center;
  border-bottom: 2px solid white;
}
.item_data p 
{
  position: relative;
  margin: 0.5em;
  mix-blend-mode: difference;
  pointer-events: none;
}
#image_holder
{
  position: absolute;
  height: 30vw;
  width: 30vw;
  margin: -15vw;

  transition-duration: 300ms;
  transition-timing-function: ease-out;
  pointer-events: none;
  z-index: 2;
}
#floating_image
{
  height: 100%;
  width: 100%;
  object-fit: contain;
  transition-duration: 200ms;

  transform: scale(0);
}
</style>
