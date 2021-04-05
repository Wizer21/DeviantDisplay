<template>
  <div id="header">
    <div id="title_holder">
      <h2>
        Deviant Art
      </h2>
      <h2 id="gallery">
        gallery
      </h2>
    </div>
    <div id="p1">
      <input type="text" id="user_name" placeholder="username" size="8" spellcheck="false">
      <h2>'s profile</h2>
    </div>
    <div id="p2">
      <div id="buttons">
        <h2 @click="toList" id="listButton">
          List
        </h2>
        <h2 @click="toScene" id="sceneButton">
          3DScene
        </h2>
      </div>
      <div id="load" @click="updateUser">
        <p>
          load
        </p>
        <p id="arrow">
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data(){
    return {
      projectListOpened: true
    }
  },
  methods: {
    updateUser(){
      this.$emit('updateUser', document.getElementById('user_name').value, this.projectListOpened)
      
      let header_height = document.getElementById('header').getBoundingClientRect().height
      setTimeout(() => {
        let it = 0
        var int = setInterval(function() {
          it += 1
          window.scrollTo(0, window.pageYOffset + (((header_height - window.pageYOffset) * 0.08) + 1))
          if (window.pageYOffset > header_height * 0.9999 || it > 150) clearInterval(int)
        }, 10);
      }, 100)
    },
    toList(){
      this.projectListOpened = true

      // Update Selected Scene
      let listButton = document.getElementById('listButton')
      listButton.style.color = "#00af78"
      listButton.style.transform = "scale(1.05)"
      listButton.style.textShadow = "0 0 10px #07b87f"
      
      // Update UnSelected list
      let sceneButton = document.getElementById('sceneButton')
      sceneButton.style.color = "#333333"
      sceneButton.style.transform = "scale(1)"
      sceneButton.style.textShadow = ""
    },
    toScene(){      
      this.projectListOpened = false
      
      // Update Selected Scene
      let sceneButton = document.getElementById('sceneButton')
      sceneButton.style.color = "#00af78"
      sceneButton.style.transform = "scale(1.05)"
      sceneButton.style.textShadow = "0 0 10px #07b87f"
      
      // Update UnSelected list
      let listButton = document.getElementById('listButton')
      listButton.style.color = "#333333"
      listButton.style.transform = "scale(1)"
      listButton.style.textShadow = ""
    }
  },
  mounted(){
    this.toList()
  }
}
</script>

<style lang="scss" scoped>
#header
{
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1a1a;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
#title_holder
{
  margin: 0px;
  color: #00e59b;
  font-size: 15vh;
  margin: 2vw 0;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
#gallery
{
  color: #dddddd;
  z-index: -1 !important;
}
#title_holder h2
{
  margin: 0vw 1vw;
  line-height: 15vh;
}
#p1
{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  color: #dddddd;
  font-size: 5vh;
  margin: 10vh 0;
}
#p1 h2
{
  margin: 0px;
}
#user_name
{
  font-size: 10vh;
  background-color: transparent;
  border: 0px solid transparent;
  outline: none;
  color: #8b8b8b;
  font-family: 'Lexend', sans-serif;

  &::placeholder{
    color: #00e59b;
  }
  &:placeholder-shown
  {
    color: #00e59b;
  }
  &:invalid 
  {
    box-shadow:none;
  }
}
#p2
{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  color: #2e2e2e;
  font-size: 1vw;
  margin: 0;
}
#p2 h2
{
  margin: 0vw 0vw;
}
#buttons
{
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  font-size: 4vh;
}
#buttons h2
{
  margin: 0vw 2vw;
  cursor: pointer;
  transition-timing-function: ease-in-out;
  padding: 1vh;
  border-radius: 20px;

  transition: background-color 250ms, color 500ms, transform 500ms, text-shadow 500ms;
  
  &:hover {
    background-color: #202020;
  }
}
#load
{
  font-size: 4vh;
  margin: 0 10vw;
  color: #00e59b;
  cursor: pointer;
}
#load:hover p
{
  text-shadow: 0 0 15px #07b87f;
}
#load:active p:nth-child(1)
{
  transition-duration: 50ms;
  transform: scale(0.9);
}
#load p
{
  margin: 0;
  transition-duration: 500ms;
}
#arrow
{
  transform: rotate(90deg) translateX(5vh);
}
@media screen and (max-width: 1400px) {  
  #title_holder
  {
    font-size: 12vw;
  }
  #title_holder h2
  {
    line-height: 10vw;
  }
}
@media screen and (max-width: 1000px) {  
  #p1
  {    
    font-size: 5vw;
  }
  #user_name
  {    
    font-size: 10vw;
  }
}
</style>
