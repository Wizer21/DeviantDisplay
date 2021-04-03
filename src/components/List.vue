<template>
  <div id="list">
    <div id="deviation_list">        
      <div v-for="item in deviationList" :key="item.id" class="item_data" :data-name="item.title" :data-src="item.src">
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
export default {
  name: 'List',
  data(){
    return {
      deviationList: [],
      offset: 0,
      username: null
    }
  },
  methods: {
    newUser(username){
      this.username = username
      this.offset = 0
      this.deviationList = [],

      this.newRequest()
    },
    newRequest(){
      let local = this
      this.request('GET', `https://backend.deviantart.com/rss.xml?q=gallery%3A${this.username}&offset=${this.offset}`)
      .then(function (e) {
        const parser = new DOMParser()
        local.pushList(parser.parseFromString(e.target.response,"text/xml").getRootNode().getElementsByTagName('item'))
      })
    },
    request(method, url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.send();
      });
    },
    pushList(deviations){
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
        const floating_image = document.getElementById('floating_image')
        for (let item of stack){
          item.addEventListener('mouseenter', () => {
            //console.log(item.dataset.src);
            floating_image.src = item.dataset.src
          })
        }
      }, 500)
    },    
  },
  mounted() {
    const image_holder = document.getElementById('image_holder')
    const floating_image = document.getElementById('floating_image')

    window.addEventListener('scroll', () => {
      //console.log(window.pageYOffset);
      image_holder.style.top = `${window.pageYOffset + (window.innerHeight / 2)}px`

      let stack = document.getElementsByClassName('item_data')
      let center = window.innerHeight * 0.5

      for (let elem of stack){
        let rect = elem.getBoundingClientRect()
        if (rect.top < center && rect.bottom > center){
          floating_image.src = elem.dataset.src
          break
        }
      }
    })
    document.body.addEventListener('mousemove', event => {
      console.log('move');
    image_holder.style.top = `${event.pageY}px`
    })
  }
}
</script>

<style scoped>
#list
{
  width: 100vw;
  background-color: rgb(19, 19, 19);
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
  margin: 0.5em;
}
#image_holder
{
  position: absolute;
  height: 30vw;
  width: 30vw;
  margin: -15vw;
  background-color: aquamarine;

  transition-duration: 300ms;
  transition-timing-function: ease-out;
}
#floating_image
{
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
