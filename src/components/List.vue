<template>
  <div id="list">
    <div id="deviation_list">        
      <div v-for="item in deviationList" :key="item.id" id="item_data" >
        <p>
          {{ item.title }}
        </p>
      </div>
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
    }  
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
#item_data
{
  width: 100vw;
  font-size: 5vw;

  text-align: center;
  border-bottom: 2px solid white;
}
#item_data p 
{
  margin: 0.5em;
}
</style>
