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
      <input type="text" id="user_name" placeholder="username" size="8" spellcheck="false" @keyup="inputUpdate" autocomplete="off">
      <h2>'s profile</h2>
    </div>
    <div id="direct_link_button" @click="clipboard">
      <div id="link_button">
        <p>
          Copy direct link
        </p>
      </div>
      <div id="clipData">
        <p id="username">
        </p>
        <p>
          /
        </p>
        <p id="mode">
        </p>
        <div id="validate">
          <p>Copied !</p>
        </div>
      </div>
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
      projectListOpened: true,
      userEntered: false
    }
  },
  methods: {
    updateUser(){
      this.$emit('callUser', document.getElementById('user_name').value, this.projectListOpened)
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

      // Update CLipboard
      let mode = document.getElementById('mode')
      mode.textContent = "List"       
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

      // Update CLipboard
      let mode = document.getElementById('mode')
      mode.textContent = "3D"       
    },
    updateUserExist(bool){
      let user_name = document.getElementById('user_name')
      if (!bool){
        user_name.style.color = "#ef5350"
      }
    },
    clipboard(){
      if (this.userEntered){
        let valid = document.getElementById('validate')
        let text = document.querySelectorAll('#clipData >p')

        valid.style.transform = "translateX(0vh)"
        for (let t of text){
          t.style.transform = "translateX(-100vw)"
        }
        
        let url = new URL(window.location.href)
        url.searchParams.append("n", document.getElementById('user_name').value)
        if (this.projectListOpened){
          url.searchParams.set("l", "list")
        }
        else{          
          url.searchParams.set("l", "3d")
        }
        navigator.clipboard.writeText(url)
      }
    },
    inputUpdate(){      
      let user_name = document.getElementById('user_name')
      let username = document.getElementById('username')

      user_name.style.color = "#ffffff"
      if (user_name.value != ""){
        username.textContent = user_name.value
        username.style.color = "#ffffff"
        this.userEntered = true    
      }
      else{
        username.textContent = "NoUser"
        username.style.color = "#ef5350"
        this.userEntered = false
      }
    }
  },
  mounted(){
    this.toList()

    let direct_link_button = document.getElementById('direct_link_button')
    let mode = document.getElementById('mode')
    let clipData = document.getElementById('clipData')
    let valid = document.getElementById('validate')
    let username = document.getElementById('username')

    direct_link_button.addEventListener('mouseover', () => {
      clipData.style.transform = `translateX(${document.getElementById('link_button').getBoundingClientRect().width}px)`
      clipData.style.opacity = 1
    })    
    direct_link_button.addEventListener('mouseleave', () => {
      clipData.style.transform = "translateX(0)"
      clipData.style.opacity = 0
      
      valid.style.transform = "translateX(20vw)"
      username.style.transform = "translateX(0vw)"
      mode.style.transform = "translateX(0vw)"
    })
    
    username.textContent = "NoUser"
    username.style.color = "#ef5350"
    this.userEntered = false

    document.getElementById('user_name').addEventListener('keypress', event => {
      if(event.code == "NumpadEnter" || event.code == "Enter"){
        this.updateUser()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#header
{
  min-height: 100vh;
  width: 100vw;
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
  font-size: 6vh;
  margin-top: 10vh;
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
  transition-duration: 500ms;
  border-bottom: 2px solid transparent;

  &::placeholder{
    color: #00e59b;
  }
  &:invalid 
  {
    box-shadow:none;
  }
  &:focus
  {
    border-bottom: 2px solid #00e59b;
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
  font-size: 5vh;
  transform: rotate(90deg) translateX(5vh);
}
#direct_link_button
{
  font-size: 4vh;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
#direct_link_button:hover #link_button
{
  box-shadow: 0 0 10px #07b87f;
}
#link_button
{
  background-color: #07b87f;
  color: #ffffff;
  border-radius: 20px;
  padding: 10px;
  z-index: 2;
  margin: 2vh 0;
  transition-duration: 500ms;

  display: flex;
  align-items: center;
}
#link_button p 
{
  margin: 0;
}
#clipData
{
  background-color: #202020;
  border-radius: 20px;
  padding: 10px;
  transition-duration: 500ms;
  margin: 2vh 0;
  opacity: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  overflow: hidden;
}
#clipData p 
{
  margin: 0 0.5vw;
  transition-duration: 300ms;
}
#validate
{
  position: absolute;
  border-radius: 20px;
  transition-duration: 300ms;
  transform: translateX(20vw);
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
    font-size: 6vw;
  }
  #user_name
  {    
    font-size: 8vw;
  }
}
</style>
