<template>
  <div>
    <Header @callUser="callUser" ref="headerref"/>
    <List id="list" ref="listref"/>
    <Scene3d id="scene3d" ref="sceneref"/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import List from './components/List.vue'
import Scene3d from './components/Scene3d.vue'
import { checkUser } from "./assets/requester.js"

export default {
  name: 'App',
  components: { Header, List, Scene3d },
  data(){
    return{
      user: null,
      projectListOpened: true
    }
  },
  methods: {
    callUser(user, projectListOpened){
      this.user = user
      this.projectListOpened = projectListOpened

      checkUser(user, this.updateUser)
    },
    updateUser(request){
      // User not found
      if (request.textContent.split(" ").includes("Error")){
        this.$refs.headerref.updateUserExist(false)
      }
      // User exist
      else{
        this.$refs.headerref.updateUserExist(true)

        let list = document.getElementById('list')
        let scene = document.getElementById('scene3d')

        // Toggle windows
        if (this.projectListOpened){
          list.style.display = "block"
          scene.style.display = "none"
          this.$refs.listref.newUser(this.user)
          this.$refs.sceneref.turnOff()
        }
        else{
          list.style.display = "none"
          scene.style.display = "block"
          this.$refs.sceneref.newUser(this.user)
          this.$refs.sceneref.turnOn()
        }

        // Scroll
        let header_height = document.getElementById('header').getBoundingClientRect().height
        setTimeout(() => {
          let it = 0
          var int = setInterval(function() {
            it += 1
            window.scrollTo(0, window.pageYOffset + (((header_height - window.pageYOffset) * 0.08) + 1))
            if (window.pageYOffset > header_height * 0.9999 || it > 150) clearInterval(int)
          }, 10);
        }, 100)
      }
    }
  },
  mounted(){
    let url = new URL(window.location.href)
    let userName = url.searchParams.get('n')
    let location = url.searchParams.get('l')

    // Exemple localhost:8080/?n=Wiizer&l=3d
    if (userName){
      if (location == "3d"){
        this.callUser(userName, false)
        this.$refs.headerref.toScene()
      }
      else if(location == "list"){      
        this.callUser(userName, true) 
      }

      document.getElementById('user_name').value = userName
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100&display=swap');
::-moz-selection {
  color: rgb(44, 44, 44);
  background: rgb(236, 236, 236);
}
::selection {
  color: rgb(44, 44, 44);
  background: rgb(236, 236, 236);
}
body
{
  margin: 0px;
  color: rgb(219, 219, 211);
  font-family: 'Lexend', sans-serif;
}
#app
{
  position: relative;
  overflow: hidden;
}
#list
{
  display: none;
}
#scene3d
{
  display: none;
}
</style>
