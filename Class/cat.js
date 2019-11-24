
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

var catGeo = new THREE.Object3D();
var catMult = catGeo.modelViewMatrix;

window.onload = function init() {

    //For bouncing balls;
    var step = 0;
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //Show Axis
    var axes = new THREE.AxisHelper(10);
    scene.add(axes);

    //Let's make a plane
    var planeGeometry = new THREE.PlaneGeometry(60, 30, 1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    
    scene.add(catGeo);
/*
    //cat face
    var cubeGeometry = new THREE.BoxGeometry(6, 6, 6);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var catFace = new THREE.Mesh(cubeGeometry, cubeMeterial);
    catFace.castShadow = true;
    catFace.position.x = 0;
    catFace.position.y = 15;
    catFace.position.z = 10;
    catGeo.add(catFace);

    //cat mouse
    var cubeGeometry = new THREE.BoxGeometry(3, 3, 2);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x1D1616 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 14;
    cube.position.z = 13;
    catGeo.add(cube);
    
    //cat ear1
    var cubeGeometry = new THREE.BoxGeometry(2, 2, 3);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x1D1616 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = -2;
    cube.position.y = 18;
    cube.position.z = 10;
    catGeo.add(cube);

    //cat ear2
    var cubeGeometry = new THREE.BoxGeometry(2, 2, 3);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x1D1616 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 2;
    cube.position.y = 18;
    cube.position.z = 10;
    catGeo.add(cube);

    //cat body

    //cat leg
*/
    
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 30, 60);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 5120;
    spotLight.shadow.mapSize.height = 5120;
    scene.add(spotLight);
    camera.position.x = 0;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    document.getElementById("threejs_scene").appendChild(renderer.domElement);
    
    var renderScene = new function renderScene() {
        requestAnimationFrame(renderScene);
        //cube animation
        catGeo.rotation.y += 0.01;
        catFace();
        
        //catGeo.rotation.x += 0.01;
        catMouse();
        catEar(1.6);
        catEar(-1.6);
        catBody();
        catFoot(-1.5, 10, 6.5);
        catFoot(1.5, 10, 6.5);
        catFoot(-1.5, 10, -2);
        catFoot(1.5, 10, -2);
        catEye1(1.2);
        catEye1(-1.2);
        catEye2(2.1);
        catEye2(-2.1);
        catNose();
        catTail();

        /*cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;*/
        //sphere animation  
    
        renderer.render(scene, camera);
    }
}

function catFace() {
    var cubeGeometry = new THREE.BoxGeometry(6, 5, 6);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 15;
    cube.position.z = 10;
    catGeo.add(cube);
}
function catMouse() {
    var cubeGeometry = new THREE.BoxGeometry(3, 2.5, 2);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x1D1616 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 14;
    cube.position.z = 13;
    catGeo.add(cube);
}
function catEar(p) {
    var cubeGeometry = new THREE.BoxGeometry(1.2, 2, 3);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x1D1616 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = p;
    cube.position.y = 17.7;
    cube.position.z = 9;
    catGeo.add(cube);
}
function catBody() {
    var cubeGeometry = new THREE.BoxGeometry(6, 6, 12);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 14;
    cube.position.z = 2;
    catGeo.add(cube);
}
function catFoot(x, y, z) {
    var cubeGeometry = new THREE.BoxGeometry(2.5, 8, 2.5);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    catGeo.add(cube);
}
function catEye1(x) {
    var cubeGeometry = new THREE.BoxGeometry(1.5, 1, 1);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x190707 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = x;
    cube.position.y = 15.8;
    cube.position.z = 12.6;
    catGeo.add(cube);
}
function catEye2(x) {
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x2ECCFA });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = x;
    cube.position.y = 15.8;
    cube.position.z = 12.6;
    catGeo.add(cube);
}
function catNose() {
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 2);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 14.7;
    cube.position.z = 13.1;
    catGeo.add(cube);
}
function catTail() {
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 8);
    var cubeMeterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 14;
    cube.position.z = -7;
    catGeo.add(cube);
}
// renderScene();
