<template>
  <div id="scene">
  </div>
</template>

<script>
import { createRequest } from "../assets/requester.js"
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: 'Scene3d',
  data(){
    return {
      offset: 0,
      username: null,
      populate: null
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
        //console.log(dev)
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
    }
  },
  mounted(){
// --- Create Scene ---
    const three_scene = document.getElementById('scene')
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    )
    camera.position.set(5, 5, 5)
    camera.rotation.y += 1
    camera.rotation.x += -1

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
        //geometry.trnaslate
        let material = new THREE.MeshBasicMaterial( {transparent: true, map: loader.load(item.src)});
        let controller = new THREE.Mesh( geometry, material )
        
        console.log("-- NEW --");
        console.log("item.width", item.width);
        console.log("item.height", item.height);
        console.log("width", 2);
        console.log("height", height);

        // Calculate Position
        console.log("y_pixelStack", y_pixelStack)
        console.log("x", x)
        console.log("y", y)
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
    const point_light = new THREE.AmbientLight( 0xffffff, 1, 100 )
    scene.add( point_light )

    // Render
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor( 0x000000, 0 )
    three_scene.appendChild(renderer.domElement)

    new OrbitControls( camera, renderer.domElement );

    // Resize
    renderer.setSize(window.innerWidth, window.innerHeight)

    const animate = function () {
      requestAnimationFrame(animate)
      
      renderer.render(scene, camera)
    }
    animate()
  }
}
</script>

<style scoped>
</style>
