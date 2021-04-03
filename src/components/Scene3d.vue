<template>
  <div id="scene">
  </div>
</template>

<script>
import { createRequest } from "../assets/requester.js"

export default {
  name: 'Scene3d',
  data(){
    return {
      offset: 0,
      deviationList: [],
      username: null
    }
  },
  methods: { 
    newUser(username){
      this.username = username,
      this.offset = 0,
      this.deviationList = []

      this.requestData()
    },
    requestData(){
      createRequest(this.username, this.offset, this.pushList)
    },
    // Push deviations to the data
    pushList(deviations){
      for (let dev of deviations){
        this.deviationList.push({
          id: this.offset,
          src: dev.querySelector('content').getAttribute('url'),
        })                
        this.offset++
      }
      
      if (deviations.length < 60){       
        console.log("Full Loaded", this.deviationList); 
      }
      else{
        this.requestData()
      }
    }, 
    
  }
}
</script>

<style scoped>
</style>
