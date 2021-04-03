<template>
  <div>
    <Header @updateUser="updateUser"/>
    <List id="list" ref="listref"/>
    <Scene3d id="scene" ref="sceneref"/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import List from './components/List.vue'
import Scene3d from './components/Scene3d.vue'

export default {
  name: 'App',
  components: { Header, List, Scene3d },
  methods: {
    updateUser(user, projectListOpened){
      let list = document.getElementById('list')
      let scene = document.getElementById('scene')

      if (projectListOpened){
        list.style.display = "block"
        scene.style.display = "none"
        this.$refs.listref.newUser(user)
      }
      else{
        list.style.display = "none"
        scene.style.display = "block"
        this.$refs.sceneref.newUser(user)
      }
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
</style>
