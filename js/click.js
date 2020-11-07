
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';



const canvas=document.querySelector('#c');
const pop_info=document.querySelector('#pop-info');

let renderer,camera,scene,controls,raycaster;
let mouse = new THREE.Vector2(), INTERSECTED;



function loadingcomplete(){
    const body = document.querySelector('body');
    const loadingScreen = document.querySelector('.loading-screen');
    // loadingScreen.classList.toggle('complete');
    setTimeout(function(){ body.classList.add('complete'); }, 2000);
    setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);    
}
function onDocumentMouseMove( event ) {

    event.preventDefault();
    // mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    // mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;
    mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;

}
function onDocumentTouchEnd( event ) {

    event.preventDefault();
    var touches = event.changedTouches;
    mouse.x = ( touches[0].pageX / canvas.clientWidth ) * 2 - 1;
    mouse.y = - ( touches[0].pageY / canvas.clientHeight ) * 2 + 1;
    // mouse.x = ( touches[0].pageX / window.innerWidth ) * 2 - 1;
    // mouse.y = - ( touches[0].pageY / window.innerHeight ) * 2 + 1;
}
// function onDocumentTouchEnd( event ) {

//     event.preventDefault();
//     mouse.x =-1;
//     mouse.y = -1;
//     // mouse.x = ( touches[0].pageX / window.innerWidth ) * 2 - 1;
//     // mouse.y = - ( touches[0].pageY / window.innerHeight ) * 2 + 1;
// }

console.log(canvas.clientHeight,canvas.clientWidth);
console.log(window.innerHeight,window.innerWidth);


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
    // window
    //     .fetch("./js/points.json")
    //     .then(response => response.json())
    //     .then(data => {
    //     init(data.points);
    //     });
    init()

    function init() {
        // Setup scene
        scene = new THREE.Scene();
        // Setup camera
        camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 5000);  
        // Setup renderer
        renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
        });
        // container.appendChild( renderer.domElement );
        orbitalcontrols();
        // Add fog to the scene
        scene.fog = new THREE.FogExp2( 0xe8eddf, 0.002 );
    
        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 1, 1, 1 ).normalize();
        camera.add( light );
        scene.add(camera);

        function addEarth() {
        var spGeo = new THREE.SphereGeometry(100,50,50);
        var loader=new THREE.TextureLoader();
        var planetTexture = loader.load( "./assets/additional_scripts/new_world.png",render );


        [THREE.BackSide, THREE.FrontSide].forEach((side) => {
            var mat2 =  new THREE.MeshBasicMaterial( {
                map: planetTexture,
                alphaTest: 0.7,
                opacity:1,
                transparent: true,
                side,
                } );
                var sp = new THREE.Mesh(spGeo,mat2);
                sp.name="Earth";
                scene.add(sp);
            });
            planetTexture.dispose();
        }
        addEarth();
       
        let Places={
            "Australia": [-25.27,133.77],
            "India": [20.6,79],
            "UK": [55.57,-3.43],
            "Spain": [47.46,-3.75],
            "USA": [37.09, -95.71],
            "Mexico":[23.6345, -102.55],
            "France":[46.22, 2.21],
            "Turkey":[38.96, 35.24],
            "Thailand":[15.87, 101],
            "China":[35.86, 104.19],
            "Germany":[51.16, 10.45],
            "South Africa":[-30.56, 22.93],
            "Brazil":[-14.23, -51.92],
            "New Zeland": [-40.90, 174.88],
            "Indonesia": [-0.79,113.92]};
            
        var placeGeometry = new THREE.CircleBufferGeometry( 2.5, 6 );
        
        for (const key in Places) {
            if (Places.hasOwnProperty(key)) {
                var placeMaterial=new THREE.MeshPhongMaterial( {
                    color: 0x000000,
                    side: THREE.BackSide, 
                });
                const placeObject = new THREE.Mesh( placeGeometry, placeMaterial);
                const Place = Places[key];

                var latitude=Place[0],longitude=Place[1];
                var phi = Math.PI/2-THREE.MathUtils.degToRad(latitude);
                var theta =THREE.MathUtils.degToRad(-longitude)+0;
        
                placeObject.name=key;
                // placeObject.rotation.y=Math.PI/6;
                placeObject.position.x = 101 * Math.sin(phi) * Math.cos(theta);
                placeObject.position.y = 101 * Math.cos(phi);
                placeObject.position.z = 101 * Math.sin(phi) * Math.sin(theta);
                placeObject.lookAt(0,0,0);
                scene.add( placeObject );
                                        
                
            }
        }
        
        canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
        canvas.addEventListener( 'touchstart', onDocumentTouchEnd, false );
        // document.addEventListener( 'touchend', onDocumentTouchEnd, false );

        raycaster = new THREE.Raycaster();

        loadingcomplete();
        animate();
    }
    function drawElement(obj){
        let tempV=new THREE.Vector3();
        // get the position of the center of the cube
        obj.updateWorldMatrix(true, false);
        obj.getWorldPosition(tempV);
       
        // get the normalized screen coordinate of that position
        // x and y will be in the -1 to +1 range with x = -1 being
        // on the left and y = -1 being on the bottom
        tempV.project(camera);
       
        // convert the normalized position to CSS coordinates
        const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
        const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
       
        // move the elem to that position
        pop_info.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
        pop_info.style.display = 'block';
        pop_info.innerHTML=obj.name;
    }
    function ray() {
        

        raycaster.setFromCamera( mouse, camera );

        const intersects = raycaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {

            if ( INTERSECTED != intersects[ 0 ].object &&intersects[0].object.name!="Earth" ) {

                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff00ff );
                console.log(intersects[ 0 ].object.name);
                drawElement(INTERSECTED);
                if (controls.autoRotate){
                    controls.autoRotate = false;
                }
            }
            else if(intersects[0].object.name=="Earth" ){
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED=null;
                if (controls.autoRotate==false){
                    controls.autoRotate = true;
                    pop_info.style.display = 'none';
                }
            }

        } else {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            if (controls.autoRotate==false){
                controls.autoRotate = true;
                // pop_info.style.display = 'none';
            }
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
