
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';

const canvas=document.querySelector('#c');

let renderer,camera,scene,controls,raycaster;
const width=canvas.clientWidth;
const height=canvas.clientHeight;


var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
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

function addPoint(lat, lng, size, color, subgeo) {

    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180;

    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 200 * Math.cos(phi);
    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    point.lookAt(mesh.position);

    point.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix
    point.updateMatrix();

    for (var i = 0; i < point.geometry.faces.length; i++) {

      point.geometry.faces[i].color = color;

    }
    if(point.matrixAutoUpdate){
      point.updateMatrix();
    }
    subgeo.merge(point.geometry, point.matrix);
  }

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
    controls.autoRotate = true;
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
    
        // var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
        // light.position.set( 1, 1, 1 ).normalize();
        // camera.add( light );
        // scene.add(camera);

        // function addEarth() {
            var spGeo = new THREE.SphereGeometry(100,50,50);
            var loader=new THREE.TextureLoader();
            var planetTexture = loader.load( "./assets/additional_scripts/new_world.png",render );
            // var mat2 =  new THREE.MeshBasicMaterial( {
            //     map: planetTexture,
            //     alphaTest: 0.1,
            //     shininess: 0,
            //     opacity:0.7,
            //     transparent: true,
            //     side: THREE.DoubleSide,
            //     } );
            // var sp = new THREE.Mesh(spGeo,mat2);
            // scene.add(sp);



            [THREE.BackSide, THREE.FrontSide].forEach((side) => {
                var mat2 =  new THREE.MeshBasicMaterial( {
                    map: planetTexture,
                    alphaTest: 0.5,
                    shininess: 0,
                    opacity:1,
                    transparent: true,
                    side,
                    } );
                    var sp = new THREE.Mesh(spGeo,mat2);
                    scene.add(sp);
              });
        // }
        // addEarth();
        // 4. Add points to canvas
        // - Single geometry to contain all points.
        // const mergedGeometry = new THREE.Geometry();
        // // - Material that the dots will be made of.
        // const pointGeometry = new THREE.SphereGeometry(0.5, 5, 5);
        // const pointMaterial = new THREE.MeshBasicMaterial({
        // color: "#008000"
        // });

        // for (let point of points) {
        //     const { x, y, z } = convertFlatCoordsToSphereCoords(
        //         point.x,
        //         point.y,
        //         width,
        //         height
        //     );

        //     if (x && y && z) {
        //         pointGeometry.translate(x, y, z);
        //         pointGeometry.name="Earth"+x+","+y+","+z;

        //         mergedGeometry.merge(pointGeometry);
        //         pointGeometry.translate(-x, -y, -z);
        //     }
        // }

        // const globeShape = new THREE.Mesh(mergedGeometry, pointMaterial);
        // // globeShape.name="Earth";
        // globeShape.rotation.x=-4*Math.PI/180;
        // scene.add(globeShape);
        
        var geometry = new THREE.CircleBufferGeometry( 3, 5, 5 );

        var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );

        var lat=0,lng=0;
        const lonFudge = Math.PI * .5;
        const latFudge = Math.PI * -0.135;
        // var phi = Math.PI/2-THREE.MathUtils.degToRad(lat);
        // var theta = THREE.MathUtils.degToRad(lng);

        var phi = Math.PI/2-THREE.MathUtils.degToRad(lat);
        var theta =THREE.MathUtils.degToRad(lng)+0;

        object.position.x = 100 * Math.sin(phi) * Math.cos(theta);
        object.position.y = 100 * Math.cos(phi);
        object.position.z = 100 * Math.sin(phi) * Math.sin(theta);
        object.name=1;
        // object.lookAt(-sp.position);
        object.rotation.x = 0;
        object.rotation.y = 0;
        object.rotation.z = 0;
        scene.add( object );

        // **********HELPERS********

        // let plane = new THREE.Plane( new THREE.Vector3( 1,0,0 ), 0 );
        // let helper = new THREE.PlaneHelper( plane, 200, 0xffff00 );
        // scene.add( helper );
        // plane = new THREE.Plane( new THREE.Vector3( 0,1,0 ), 0 );
        // helper = new THREE.PlaneHelper( plane, 200, 0x00ff00 );
        // scene.add( helper );
        // plane = new THREE.Plane( new THREE.Vector3( 0,0,1 ), 0 );
        // helper = new THREE.PlaneHelper( plane, 200, 0x00ff00 );
        // scene.add( helper );
        
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

                if ( INTERSECTED ) ;//INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                // INTERSECTED = intersects[ 0 ].object;
                // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                // INTERSECTED.material.emissive.setHex( 0xff0000 );
                console.log(intersects[ 0 ].object.name);
            }

        } else {

            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

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
