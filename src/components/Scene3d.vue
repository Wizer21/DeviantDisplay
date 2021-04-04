<template>
  <div id="scene">
  </div>
</template>

<script>
import { createRequest } from "../assets/requester.js"
import * as THREE from 'three';

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
      startAnimation: null
    }
  },
  methods: { 
    newUser(username){
      this.username = username
      this.offset = 0

      // Delete meshes
      this.deviationList = []
      for (let mesh of this.meshStack){
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        //mesh.material.dispose();
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
      for (let dev of deviations){
        this.deviationList.push({
          id: this.offset,
          src: dev.querySelector('content').getAttribute('url'),
          width: parseInt(dev.querySelector('content').getAttribute('width')),
          height: parseInt(dev.querySelector('content').getAttribute('height')),
        })        
        this.offset++
      }
      
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

    // Populate
    this.populate = function() {
      const loader = new THREE.TextureLoader();
      let grid_count = Math.sqrt(this.offset).toFixed(0)
      let y = 0
      let y_pixelStack = 0
      let x = 0
      let xOffset = (2 * grid_count)/ 2
      let yOffset = (2 * grid_count)/ 2

      for (let item of this.deviationList){
        // Calculate Item height
        let ratio = item.width / 2

        // Create
        let height = parseFloat((item.height / ratio).toFixed(4))
        
        let geometry = new THREE.BoxGeometry( 2, 0.1, height)
        let material_img = new THREE.MeshBasicMaterial( {transparent: true, map: loader.load(item.src)});
        let material = new THREE.MeshStandardMaterial({ color: 0xd4d4d4});
        let controller = new THREE.Mesh( geometry, [material, material, material_img, material, material, material] )
        local.meshStack.push(controller)
        
        controller.position.set(x * 2.2 - xOffset, 0, y_pixelStack + (height/2) - yOffset)

        y += 1
        y_pixelStack += height + 0.2

        if (y == grid_count ){
          y_pixelStack = 0
          y = 0
          x += 1
        }
        
        scene.add(controller)
      }
    }
    
    // Light
    scene.add( new THREE.AmbientLight( 0xffffff, 1, 100 ) )

    // Render
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor( 0x000000, 0 )
    three_scene.appendChild(renderer.domElement)

    // Resize
    renderer.setSize(window.innerWidth, window.innerHeight)

    const animate = function () {
      if (local.sceneRunning){
        requestAnimationFrame(animate)

        animateCamera()
        renderer.render(scene, camera)
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
    three_scene.addEventListener('click', () => {
      // If an item is hovered
      if (hoverItem){
        cameraPosition_x = hoverItem.position.x
        cameraPosition_z = hoverItem.position.z
      }
    })

    //Navigation
    let cameraRotation_y = 0
    let cameraRotation_x = -1.55
    three_scene.addEventListener('mousemove', event => {
      raycast(event)
      let rect = three_scene.getBoundingClientRect()
      
      let x_percent = (event.offsetX - (rect.width/2))  / (rect.width / 2)
      let y_percent = (event.offsetY - (rect.height/2))  / (rect.width / 3)
      
      // TOP | BOTTOM rotation
      cameraRotation_y = -x_percent
      
      // LEFT | RIGHT rotation
      cameraRotation_x = -1.55 - y_percent
    })
    camera.rotation.y = 0
    camera.rotation.x = -1.55
    
    function animateCamera(){
      // TOP | BOTTOM rotation
      camera.rotation.y += (cameraRotation_y - camera.rotation.y) * 0.03
      
      // LEFT | RIGHT rotation
      camera.rotation.x += (cameraRotation_x - camera.rotation.x) * 0.03

      // CameraPosition X
      camera.position.x += (cameraPosition_x - camera.position.x) * 0.03
      
      // CameraPosition Z
      camera.position.z += (cameraPosition_z - camera.position.z) * 0.03
    }

    // Resize Event
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    });
  }
}
</script>

<style scoped>
</style>
