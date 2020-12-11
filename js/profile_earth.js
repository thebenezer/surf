
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';



const canvas=document.querySelector('#c');

let renderer,camera,scene,controls,raycaster;
let mouse = new THREE.Vector2(), INTERSECTED;



function loadingcomplete(){
    const body = document.querySelector('body');
    const loadingScreen = document.querySelector('.loading-screen');
    // loadingScreen.classList.toggle('complete');
    // setTimeout(function(){ body.classList.add('complete'); }, 2000);
    body.classList.add('complete');
    setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);    
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
       
        // if(Places.length()===0){
        // Places={
        //     "India": [20.6,79],
        //     "UK": [55.57,-3.43],
        //     "Spain": [40.46,-3.75],
        //     "Italy": [41.87, 12.56],
        //     "Japan": [36.20, 138.25],
        //     "USA": [37.09, -95.71],
        //     "Mexico":[23.6345, -102.55],
        //     "France":[46.22, 2.21],
        //     "Turkey":[38.96, 35.24],
        //     "Thailand":[15.87, 101],
        //     "China":[35.86, 104.19],
        //     "Germany":[51.16, 10.45],
        //     "South Africa":[-30.56, 22.93],
        //     "Brazil":[-14.23, -51.92],
        //     "New Zeland": [-40.90, 174.88],
        //     "Indonesia": [-0.79,113.92]};
        // }
        
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
    
    function render() {
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
