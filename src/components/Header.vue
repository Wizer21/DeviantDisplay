<template>
  <div id="header">
    <h2>
      Deviant Art
    </h2>
    <div id="p2">
      <input type="text" id="user_name" placeholder="username" size="5">
      <h2>' portfolio</h2>
    </div>
    <p @click="updateUser">Search</p>
    <div id="imageStack">

    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    updateUser(){
      const parser = new DOMParser()      
      const xmlHttp = new XMLHttpRequest()
      const imageStack = document.getElementById('imageStack')

      xmlHttp.open( "GET", `https://backend.deviantart.com/rss.xml?q=gallery%3A${document.getElementById('user_name').value}&offset=60` , false ) // false for synchronous request
      xmlHttp.send( null )

      let deviations = parser.parseFromString(xmlHttp.responseText,"text/xml").getRootNode().getElementsByTagName('item')
      console.log(deviations.length);
      for (let dev of deviations){
        //console.log(dev.querySelector('title'))

        let elem = document.createElement('img')
        //console.log(dev.querySelector('content'));
        elem.src = dev.querySelector('content').getAttribute('url')
        //console.log("dev.querySelector('content')", dev.querySelector('content').getAttribute('url'));
        imageStack.appendChild(elem)
      }
    }
  }
}
</script>

<style scoped>
#header
{
  width: 100vw;
  background-color: #1a1a1a;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 10vw;
}
#header h2
{
  margin: 0px;
}
#p2
{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}
#p2 h2
{
  font-size: 8vw;
}
#user_name
{
  font-size: 8vw;
  height: 8vw;
  background-color: transparent;
  border: 0px solid transparent;
}
</style>
