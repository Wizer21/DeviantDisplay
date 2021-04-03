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
  </div>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    updateUser(){
      this.$emit('updateUser', document.getElementById('user_name').value)
    }
  }
}
</script>

<style scoped>
#header
{
  width: 100vw;
  overflow: hidden;
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
