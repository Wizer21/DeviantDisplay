<template>
  <div>
    <Header @updateUser="updateUser"/>
    <List ref="listref"/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import List from './components/List.vue'

export default {
  name: 'App',
  components: { Header, List },
  methods: {
    updateUser(user){
      this.$refs.listref.newUser(user)
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
