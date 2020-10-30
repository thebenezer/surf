
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';

const canvas=document.querySelector('#c');

let renderer,camera,scene,controls;
const width=canvas.clientWidth;
const height=canvas.clientHeight;

const globeRadius = 100;
const globeWidth = 4098 / 2;
const globeHeight = 1968 / 2;

function convertFlatCoordsToSphereCoords(x, y) {
    let latitude = ((x - globeWidth) / globeWidth) * -180;
    let longitude = ((y - globeHeight) / globeHeight) * -90;
    latitude = (latitude * Math.PI) / 180;
    longitude = (longitude * Math.PI) / 180;
    const radius = Math.cos(longitude) * globeRadius;

    return {
    x: Math.cos(latitude) * radius,
    y: Math.sin(longitude) * globeRadius,
    z: Math.sin(latitude) * radius
    };
}

function loadingcomplete(){
    const body = document.querySelector('body');
    const loadingScreen = document.querySelector('.loading-screen');
    // loadingScreen.classList.toggle('complete');
    setTimeout(function(){ body.classList.add('complete'); }, 2000);
    setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);    
}

function main(){
    window
        .fetch("./js/points.json")
        .then(response => response.json())
        .then(data => {
        init(data.points);
        });


    function init(points) {
        // Setup scene
        scene = new THREE.Scene();
        // Setup camera
        camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 1000);  
        // Setup renderer
        renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
        });
        // Add fog to the scene
        scene.fog = new THREE.FogExp2( 0xe8eddf, 0.002 );
    

        // 4. Add points to canvas
        // - Single geometry to contain all points.
        const mergedGeometry = new THREE.Geometry();
        // - Material that the dots will be made of.
        const pointGeometry = new THREE.SphereGeometry(0.5, 5, 5);
        const pointMaterial = new THREE.MeshBasicMaterial({
        color: "#008000"
        });

        for (let point of points) {
            const { x, y, z } = convertFlatCoordsToSphereCoords(
                point.x,
                point.y,
                width,
                height
            );

            if (x && y && z) {
                pointGeometry.translate(x, y, z);
                mergedGeometry.merge(pointGeometry);
                pointGeometry.translate(-x, -y, -z);
            }
        }

        const globeShape = new THREE.Mesh(mergedGeometry, pointMaterial);
        scene.add(globeShape);

        // Setup orbital controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableKeys = false;
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableRotate = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed =1;
        // controls.screenSpacePanning = true;
        controls.minDistance = 200;
        controls.maxDistance = 500;
        if(document.documentElement.clientWidth>768)  
            camera.position.z = 250;
        else
            camera.position.z = 300;

        loadingcomplete();
        animate();
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
    
    function animate() {

        requestAnimationFrame(animate);        
        if (resizeRendererToDisplaySize(renderer)) {
            if(document.documentElement.clientWidth>768)  
                camera.position.z = 250;
            else
                camera.position.z = 300;
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();// only required if controls.enableDamping = true, or if controls.autoRotate = true
        renderer.render(scene, camera);
    }

    
}

function hasWebGL() {
    const gl =canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    } else {
      return false;
    }
}

if (hasWebGL()) {
    main();
}
else{
    console.log("Your browser does not support webGL");
}
