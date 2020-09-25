
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';
import {GLTFLoader} from './three/GLTFLoader.js';

function main() {
  let canvas,renderer,camera,scene,controls,loadingScreen,body;
  init();
  animate();
  
  function init() {
    
    body = document.querySelector('body');
    loadingScreen = document.querySelector('.loading-screen');
    canvas = document.querySelector('#c');
    canvas.addEventListener("scroll", function(event){
      event.preventDefault()
    });
    renderer = new THREE.WebGLRenderer({canvas,antialias:true});
    // document.body.appendChild( renderer.domElement );
    camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 1000);  
    if(document.documentElement.clientWidth>768)  
      camera.position.z = 90;
    else
      camera.position.z = 120;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
 
    controls = new OrbitControls( camera, renderer.domElement );  
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed =1;
    // controls.screenSpacePanning = true;
    // controls.enableZoom=false;
    controls.minDistance = 70;
    controls.maxDistance = 200;
    // controls.maxPolarAngle = Math.PI / 2.5;
    // controls.minPolarAngle = Math.PI / 2;

    //....LIGHTS....
    let amblight = new THREE.AmbientLight(0xffffff,0.1);
    scene.add(amblight);
    let light = new THREE.DirectionalLight(0xffffff,2);
    light.position.set(800, 500, 1000);
    camera.add( light )
    scene.add( camera );
    // scene.add(light);
    
    //....THE WORLD/OJECTS
    var manager = new THREE.LoadingManager();
    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };

    manager.onLoad = function ( ) {
      console.log( 'Loading complete!');
      loadingScreen.classList.toggle('complete');
      body.classList.add('complete');
      setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);
    };

    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };

    manager.onError = function ( url ) {
      console.log( 'There was an error loading ' + url );
    };

    // var loader = new THREE.OBJLoader( manager );
    // loader.load( 'file.obj', function ( object ) {
    // } );
    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.load('./assets/models/world_earth_planet/scene.gltf', (gltf) => {
      const module = gltf.scene;
      // module.scale.set(50,50,50);
      // module.position.x=250;
      // module.position.y=-140;
      // module.position.z=287;
      module.rotation.x=0.40910518;
      module.rotation.y=-0.40910518;
      // module.rotation.z=0.40910518;
      scene.add(module);
    });
  //   var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
  // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  // var sphere = new THREE.Mesh( geometry, material );
  // scene.add( sphere );
  // loadingScreen.classList.toggle('complete');
  //     body.classList.add('complete');
  //     setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();
  }

}
main();
