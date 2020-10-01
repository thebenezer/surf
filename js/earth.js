
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';

const canvas=document.querySelector('#c');
const body = document.querySelector('body');
const loadingScreen = document.querySelector('.loading-screen');
loadingScreen.classList.toggle('complete');
setTimeout(function(){ body.classList.add('complete'); }, 2000);
setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);

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

function main(){
    window
        .fetch("./js/points.json")
        .then(response => response.json())
        .then(data => {
        init(data.points);
        });


    function init(points) {
        // 1. Setup scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xe8eddf, 0.002 );
        // 2. Setup camera
        camera = new THREE.PerspectiveCamera(45, width / height);
        // 3. Setup renderer
        renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
        });
        renderer.setSize(width, height);
        // 4. Add points to canvas
        // - Single geometry to contain all points.
        const mergedGeometry = new THREE.Geometry();
        // - Material that the dots will be made of.
        const pointGeometry = new THREE.CubeGeometry(1.2, 1.2, 1.2);
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
        controls.enableDamping = false;
        controls.enableRotate = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed =1;
        // controls.screenSpacePanning = true;
        // controls.enableZoom=false;
        controls.minDistance = 200;
        controls.maxDistance = 500;
        if(document.documentElement.clientWidth>768)  
            camera.position.z = 300;
        else
            camera.position.z = 400;

        animate();
    }
    
    function animate() {
        
        controls.update();// only required if controls.enableDamping = true, or if controls.autoRotate = true
        requestAnimationFrame(animate);
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
