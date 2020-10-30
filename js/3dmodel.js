
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';

const canvas=document.querySelector('#c');

let renderer,camera,scene,controls,raycaster;
const width=canvas.clientWidth;
const height=canvas.clientHeight;


var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
// const globeRadius = 100;
// const globeWidth = 4098 / 2;
// const globeHeight = 1968 / 2;

// function convertFlatCoordsToSphereCoords(x, y) {
//     let latitude = ((x - globeWidth) / globeWidth) * -180;
//     let longitude = ((y - globeHeight) / globeHeight) * -90;
//     latitude = (latitude * Math.PI) / 180;
//     longitude = (longitude * Math.PI) / 180;
//     const radius = Math.cos(longitude) * globeRadius;

//     return {
//     x: Math.cos(latitude) * radius,
//     y: Math.sin(longitude) * globeRadius,
//     z: Math.sin(latitude) * radius
//     };
// }

function loadingcomplete(){
    const body = document.querySelector('body');
    const loadingScreen = document.querySelector('.loading-screen');
    // loadingScreen.classList.toggle('complete');
    setTimeout(function(){ body.classList.add('complete'); }, 2000);
    setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);    
}
function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;

}

function orbitalcontrols() {
    // Setup orbital controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed =1;
    // controls.screenSpacePanning = true;
    controls.minDistance = 200;
    // controls.maxDistance = 500;
    if(document.documentElement.clientWidth>768)  
        camera.position.z = 250;
    else
        camera.position.z = 300;
}

function main(){
    window
        .fetch("./js/points.json")
        .then(response => response.json())
        .then(data => {
        init(data.points);
        });
    // init()

    function init(points) {
        // Setup scene
        scene = new THREE.Scene();
        // Setup camera
        camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 5000);  
        // Setup renderer
        renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
        });
        orbitalcontrols();
        // Add fog to the scene
        // scene.fog = new THREE.FogExp2( 0xe8eddf, 0.002 );
    
        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 1, 1, 1 ).normalize();
        camera.add( light );
        scene.add(camera);
        var geometry = new THREE.CircleBufferGeometry( 5, 5, 5 );
        // const mergedGeometry = new THREE.Geometry();

        for ( let point of points ) {

            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            // object.position.x = Math.random() * 400 - 200;
            // object.position.y = Math.random() * 400 - 200;
            object.position.x = point.x-1000;
            object.position.y = point.y;
            object.position.z = 200;

            // object.rotation.x = Math.random() * 2 * Math.PI;
            // object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            // object.scale.x = Math.random() + 0.5;
            // object.scale.y = Math.random() + 0.5;
            // object.scale.z = Math.random() + 0.5;
            // mergedGeometry.merge(object);

            scene.add( object );

        }
        // const globeShape = new THREE.Mesh(mergedGeometry);
        // scene.add(globeShape);
        
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

        raycaster = new THREE.Raycaster();

        loadingcomplete();
        animate();
    }
    function ray() {
        // theta += 0.1;

        // camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
        // camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
        // camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
        // camera.lookAt( scene.position );

        // camera.updateMatrixWorld();

        // find intersections

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( scene.children );

        if ( intersects.length > 0 ) {

            if ( INTERSECTED != intersects[ 0 ].object ) {

                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff0000 );

            }

        } else {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = null;

        }

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
        ray();
        if (resizeRendererToDisplaySize(renderer)) {
            if(document.documentElement.clientWidth>768)  
                camera.position.z = 250;
            else
                camera.position.z = 300;
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
      
    }

    function animate() {
        render();
        requestAnimationFrame(animate);        
          controls.update();// only required if controls.enableDamping = true, or if controls.autoRotate = true
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
