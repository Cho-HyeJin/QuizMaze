function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    //For bouncing balls;
    var step = 0;
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    //Show Axis
    var axes = new THREE.AxisHelper(10);
    scene.add(axes);
    //Let's make a plane
    var planeGeometry = new THREE.PlaneGeometry(60,30,1,1);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xCCCCCC});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);
    //Let's make a cube
    var cubeGeometry = new THREE.BoxGeometry(6,6,6);
    var cubeMeterial = new THREE.MeshPhongMaterial({color: 0x0089A0});
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 10;
    cube.position.z = 10;
    scene.add(cube);
	var cubeGeometry2 = new THREE.BoxGeometry(3,3,3);
    var cubeMeterial2 = new THREE.MeshPhongMaterial({color: 0x0089A0});
    var cube2 = new THREE.Mesh(cubeGeometry2, cubeMeterial2);
    cube2.castShadow = true;
    cube2.position.x = 0;
    cube2.position.y = 10;
    cube2.position.z = 13;
    scene.add(cube2);
    //Let's make a spheres
    var sphereGeometry = new THREE.SphereGeometry(4,32,32);
    var sphereMeterial = new THREE.MeshPhongMaterial({color: 0xFE98A0});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMeterial);
    sphere.castShadow = true;
    sphere.position.x = -15;
    sphere.position.y = 4;
    sphere.position.z = 0;
    scene.add(sphere);  
    var sphereMeterial2 = new THREE.MeshPhongMaterial({color: 0xFEE721});
    var sphere2 = new THREE.Mesh(sphereGeometry, sphereMeterial2);
    sphere2.castShadow = true;
    sphere2.position.x = 15;
    sphere2.position.y = 4;
    sphere2.position.z = 0;
    scene.add(sphere2);  
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40,60,30);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 5120;
    spotLight.shadow.mapSize.height = 5120;
    scene.add(spotLight);
    camera.position.x = 0;
    camera.position.y = 30;
    camera.position.z = 30;
    camera.lookAt(scene.position);  
    document.getElementById("threejs_scene").appendChild(renderer.domElement);
    // renderScene();
    var renderScene = new function renderScene() {
        requestAnimationFrame(renderScene);
        //cube animation
        
        //sphere animation  
        step += 0.1;
        sphere.position.y = 9 + (5 * Math.cos(step));
        sphere2.position.y = 9 + (5 * Math.cos(step+3));
        renderer.render(scene,camera);
    }
}
window.onload = init();