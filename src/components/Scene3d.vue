<template>
  <div id="scene3d">
    <div id="loader">
      <div class="inLine">
        <p>
          Requesting
        </p>
        <p>
          Deviations
        </p>
      </div>
      <div class="inLine">
        <p id="loader_count">
          0
        </p>
        <p>
          found
        </p>
      </div>   
    </div>
    <div id="control_panel">
      <div id="nav">
        <div id="top">
          <div class="arrow_holder">
            <img :src="require('../assets/arrows/chevron-up.png')">
          </div>
        </div>
        <div id="mid">
          <div class="arrow_holder">
            <img :src="require('../assets/arrows/chevron-left.png')">
          </div>
          <div class="arrow_holder">
            <img :src="require('../assets/arrows/chevron-right.png')">
          </div>
        </div>
        <div id="bop">
          <div class="arrow_holder">
            <img :src="require('../assets/arrows/chevron-down.png')">
          </div>
        </div>
      </div>
      <div id="zoom">
        <div id="zoom_holder">
          <img :src="require('../assets/zoom.png')">
        </div>
      </div>
    </div> 
    <p id="message">
      Spacebar: zoom
    </p> 
    <div id="scene">
    </div>
  </div>
</template>

<script>
import { createRequest } from "../assets/requester.js"
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default {
  name: 'Scene3d',
  data(){
    return {
      offset: 0,
      username: null,
      populate: null,
      meshStack: [],
      scene: null,
      sceneRunning: false,
      startAnimation: null,
      totalHeight: 0,
      usingTouchScreen: null
    }
  },
  methods: { 
    newUser(username){
      this.username = username
      this.offset = 0
      this.totalHeight = 0

      // Setup Loader
      document.getElementById('loader').style.opacity = 1
      document.getElementById('loader_count').textContent = "0"

      // Delete meshes
      this.deviationList = []
      for (let mesh of this.meshStack){
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        mesh = undefined;
      }     
      this.meshStack = []
      this.requestData()
    },
    requestData(){
      createRequest(this.username, this.offset, this.pushList)
    },
    // Push deviations to the data
    pushList(deviations){
      let loader_count = document.getElementById('loader_count')

      for (let dev of deviations){
        this.deviationList.push({
          id: this.offset,
          src: dev.querySelector('content').getAttribute('url'),
          width: parseInt(dev.querySelector('content').getAttribute('width')),
          height: parseInt(dev.querySelector('content').getAttribute('height')),
        })        
        this.offset++
        this.totalHeight += parseInt(dev.querySelector('content').getAttribute('height'))
      }      
      loader_count.textContent = this.offset

      if (deviations.length < 60){      
        this.populate()
      }
      else{
        this.requestData()
      }
    },
    turnOn() {
      this.sceneRunning = true
      this.startAnimation()
    },
    turnOff() {      
      this.sceneRunning = false
    }
  },
  mounted(){
    // Check for TouchScreen
    this.usingTouchScreen = 
    ( 'ontouchstart' in window ) || 
    ( navigator.maxTouchPoints > 0 ) ||
    ( navigator.msMaxTouchPoints > 0 )

    // --- Create Scene ---
    const three_scene = document.getElementById('scene')
    const scene = new THREE.Scene()
    this.scene = scene
    let local = this

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      40
    )
    camera.position.set(0, 5, 0)

    // Render
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor( 0x000000, 0 )
    three_scene.appendChild(renderer.domElement)

    // Populate
    this.populate = function() {      
      const loader = new THREE.TextureLoader();
      let grid_count = Math.sqrt(this.offset).toFixed(0)
      let columnSize = local.totalHeight / grid_count
      let y_Stack = 0
      let pixelStack = 0
      let x = 0
      let xOffset = (2 * grid_count)/ 2
      let yOffset = (2 * grid_count)/ 2

      let color_stack =  ["ef9a9a", "ce93d8", "9fa8da", "81d4fa", "80cbc4", "c5e1a5", "fff59d", "ffcc80"]
      function dice(min, max){
        return Math.random() * (max - min) + min
      }

      for (let item of this.deviationList){
        // Calculate Item height
        let ratio = item.width / 2

        // Create
        let height = parseFloat((item.height / ratio).toFixed(4))
        
        let geometry = new THREE.BoxGeometry( 2, 0.1, height)
        let material_img = new THREE.MeshBasicMaterial( {transparent: true, map: loader.load(item.src)})

        let material = new THREE.MeshStandardMaterial({ color: parseInt(`${color_stack[Math.round(dice(0, 7))]}`, 16) });
        let controller = new THREE.Mesh( geometry, [material, material, material_img, material, material, material] )
        local.meshStack.push(controller)
        
        controller.position.set(x * 2.2 - xOffset, 0, y_Stack + (height/2) - yOffset)

        y_Stack += height + 0.2
        pixelStack += item.height

        if (columnSize < pixelStack){
          pixelStack = 0
          y_Stack = 0
          x += 1
        }        
        
        scene.add(controller)
      }
      document.getElementById('loader').style.opacity = 0
    }
    
    // Bloom pass
		const composer = new EffectComposer( renderer );
    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = 0
    bloomPass.strength = 0.15
    bloomPass.radius = 0.1

    composer.addPass( renderScene );
    composer.addPass( bloomPass );

    // Light
    scene.add( new THREE.AmbientLight( 0xffffff, 1, 100 ) )

    // Resize
    renderer.setSize(window.innerWidth, window.innerHeight)
		composer.setSize(window.innerWidth, window.innerHeight)

    const animate = function () {
      if (local.sceneRunning){
        requestAnimationFrame(animate)

        animateCamera()
        renderer.render(scene, camera)
        composer.render()
      }
    }
    this.startAnimation = animate

    //Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoverItem = null

    function raycast ( e ) {
      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1

      raycaster.setFromCamera( mouse, camera )

      let intersects = raycaster.intersectObjects( scene.children )
      // Item hover
      if (intersects.length > 0 ){
        if (!hoverItem || intersects[0].object.id != hoverItem.id){

          for (let i = 0; i < 10; i++){
            setTimeout(() => {

              if (hoverItem){
                hoverItem.position.y += -hoverItem.position.y * 0.1
              }
              intersects[0].object.position.y +=  (0.5 - intersects[0].object.position.y) * 0.1
            }, i * 10)
          }
          setTimeout(() => {
            hoverItem = intersects[0].object
          }, 100)
        }
      }
      // No item hover, lo
      else{        
        for (let i = 0; i < 10; i++){
          setTimeout(() => {
            if (hoverItem){
              hoverItem.position.y += -hoverItem.position.y * 0.1
            }
          }, i * 10)
        }
        setTimeout(() => {
          hoverItem = null
        }, 100)
      }
    }

    let cameraPosition_x = 0
    let cameraPosition_z = 0
    // Item click
    three_scene.addEventListener('click', e => {
      // If an item is hovered
      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1

      raycaster.setFromCamera( mouse, camera )

      let intersects = raycaster.intersectObjects( scene.children )
      if (intersects.length > 0 ){
        cameraPosition_x = intersects[0].object.position.x
        cameraPosition_z = intersects[0].object.position.z
      }      
    })

    //Navigation
    let cameraRotation_y = 0
    let cameraRotation_x = -1.55
    three_scene.addEventListener('mousemove', event => {      
      if (!this.usingTouchScreen){
        raycast(event)
        let rect = three_scene.getBoundingClientRect()
        let x = event.offsetX - (rect.width/2)
        let y = event.offsetY - (rect.height/2)

        calculateCameraPos(x, y, rect.width, rect.height)   
      }   
    })

    camera.rotation.y = 0
    camera.rotation.x = -1.55

    function calculateCameraPos(x, y, width, height){
      let x_percent = x / (width / 2)
      let y_percent = y / (height / 3)
      
      // TOP | BOTTOM rotation
      cameraRotation_y = -x_percent
      
      // LEFT | RIGHT rotation
      cameraRotation_x = -1.55 - y_percent
    }
    
    let zoomUp = false
    function animateCamera(){
      // TOP | BOTTOM rotation
      camera.rotation.y += (cameraRotation_y - camera.rotation.y) * 0.03
      
      // LEFT | RIGHT rotation
      camera.rotation.x += (cameraRotation_x - camera.rotation.x) * 0.03

      // CameraPosition X
      camera.position.x += (cameraPosition_x - camera.position.x) * 0.03
      
      // CameraPosition Z
      camera.position.z += (cameraPosition_z - camera.position.z) * 0.03

      if (zoomUp){
        camera.zoom += (3 - camera.zoom) * 0.01
        camera.updateProjectionMatrix()
      }
      else{
        camera.zoom += (1 - camera.zoom) * 0.05
        camera.updateProjectionMatrix()
      }
    }

    // Resize Event
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      composer.setSize(window.innerWidth, window.innerHeight)

      camera.updateProjectionMatrix()
    })

    // Zoom
    window.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Spacebar'){
        zoomUp = true
      }
    })
    window.addEventListener('keyup', event => {
      if (event.key === ' ' || event.key === 'Spacebar'){
        zoomUp = false
      }
    })

    //Mobile nav
    if (this.usingTouchScreen){
      document.getElementById('control_panel').style.display = "flex"
      document.getElementById('message').textContent = "Click: navigate"
    }

    let nav = document.getElementById('nav')
    var scrollable = true;
    var listener = function(e) {
      if (! scrollable) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', listener, { passive:false });

    nav.addEventListener('touchmove', event => {
      scrollable = false

      let rect = nav.getBoundingClientRect()
      let x = event.changedTouches[0].clientX - rect.left
      let y = event.changedTouches[0].clientY - rect.top

      if (x > rect.width){
        x = rect.width
      } 
      else if(x < 0){
        x = 0
      }

      if (y > rect.height){
        y = rect.height
      }
      else if(y < 0){
        y = 0
      }

      x -= rect.width/2
      y -= rect.height/2

      calculateCameraPos(x, y, rect.width, rect.height)   
    })
    nav.addEventListener('touchend', () => {
      console.log("dragend");
      scrollable = true
    })

    // Zoom button
    let zoom = document.getElementById('zoom')
    zoom.addEventListener('touchstart', () => {
      zoomUp = true
    })
    zoom.addEventListener('touchend', () => {
      zoomUp = false
    })
  }
}
</script>

<style scoped>
#scene3d
{
  position: relative;
  height: 100vh;
  width: 100vw;

  display: none;
}
#scene
{
  height: 100vh;
  width: 100vw;
}
/* Loader States */
#loader
{  
  position: absolute;
  height: 100vh;
  width: 100vw;

  background-color: #262626;
  font-size: 3em;
  transition-duration: 500ms;
  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: none;
}
.inLine
{
  display: flex;
  align-items: center;
  justify-content: center;
  
}
.inLine p
{
  margin: 0.2em 0.5em;
}
#loader_body
{
  display: grid;
}
#load_request
{
  transition-duration: 100ms;

  grid-column: 1;
  grid-row: 1;
}
/* Control panel */
#control_panel
{
  position: absolute;
  z-index: 2;
  bottom: 0;
  margin: 2vw;

  width: 96vw;

  display: none;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;

}
#nav
{
  height: 16vh;
  width: 16vh;
  margin: 0;
  background-color: rgb(38, 38, 38, 0.7);
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}
#top{
  width: 100%;
  display: flex;
  justify-content: center;
}
#mid{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#bot{
  width: 100%;
  display: flex;
  justify-content: center;
}
.arrow_holder
{
  height: 4vh;
  width: 4vh;
}
.arrow_holder img
{
  height: 100%;
  width: 100%;
  object-fit: contain;
}
#zoom_holder
{
  height: 8vh;
  width: 8vh;
  padding: 2vw;

  background-color: rgb(38, 38, 38, 0.7);
  border-radius: 50%;
}
#zoom_holder img
{
  height: 100%;
  width: 100%;
  object-fit: contain;
}
#message
{
  position: absolute;
  padding: 5px;
  background-color: rgb(38, 38, 38, 0.7);
  border-radius: 10px;
  margin: 1vw;
}
@media screen and (max-width: 1000px) {  
  #loader
  {  
    font-size: 1.5em;
  }
}
</style>
