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
    //make head
    var cubeGeometry = new THREE.BoxGeometry(5,4,5);
    var cubeMeterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var cube = new THREE.Mesh(cubeGeometry, cubeMeterial);
    cube.castShadow = true;
    cube.position.x = 0;
    cube.position.y = 10;
    cube.position.z = 10;
    scene.add(cube);

	/// make ear
	var cubeGeometry = new THREE.BoxGeometry(2,4,2);
    var cubeMeterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var ear = new THREE.Mesh(cubeGeometry, cubeMeterial);
    ear.castShadow = true;
    ear.position.x = -1.5;
    ear.position.y = 14;
    ear.position.z = 8.5;
    scene.add(ear);

	var ear2 = new THREE.Mesh(cubeGeometry, cubeMeterial);
    ear2.castShadow = true;
    ear2.position.x = 1.5;
    ear2.position.y = 14;
    ear2.position.z = 8.5;
    scene.add(ear2);

	var cubeGeometry = new THREE.BoxGeometry(1,3,1);
    var cubeMeterial = new THREE.MeshPhongMaterial({color: 0xFAD8DD});
    var ear3 = new THREE.Mesh(cubeGeometry, cubeMeterial);
    ear3.castShadow = true;
    ear3.position.x = -1.5;
    ear3.position.y = 14;
    ear3.position.z = 9.1;
    scene.add(ear3);

	var ear4 = new THREE.Mesh(cubeGeometry, cubeMeterial);
    ear4.castShadow = true;
    ear4.position.x = 1.5;
    ear4.position.y = 14;
    ear4.position.z = 9.1;
    scene.add(ear4);

	/// make nose
	var cubeGeometry2 = new THREE.BoxGeometry(0.8,0.8,1);
    var cubeMeterial2 = new THREE.MeshPhongMaterial({color: 0xECC9E2});
    var cube2 = new THREE.Mesh(cubeGeometry2, cubeMeterial2);
    cube2.castShadow = true;
    cube2.position.x = 0;
    cube2.position.y = 9.8;
    cube2.position.z = 12.5;
    scene.add(cube2);

	/// make eyes
	var cubeGeometry3 = new THREE.BoxGeometry(0.8,1.5,1);
    var cubeMeterial3 = new THREE.MeshPhongMaterial({color: 0xFC725A});
    var cube3 = new THREE.Mesh(cubeGeometry3, cubeMeterial3);
    cube3.castShadow = true;
    cube3.position.x = 1;
    cube3.position.y = 10.8;
    cube3.position.z = 12.1;
    scene.add(cube3);

    var cube4 = new THREE.Mesh(cubeGeometry3, cubeMeterial3);
    cube4.castShadow = true;
    cube4.position.x = -1;
    cube4.position.y = 10.8;
    cube4.position.z = 12.1;
    scene.add(cube4);

	var cubeGeometry5 = new THREE.BoxGeometry(0.3,0.3,1);
    var cubeMeterial5 = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var cube5 = new THREE.Mesh(cubeGeometry5, cubeMeterial5);
    cube5.castShadow = true;
    cube5.position.x = 0.95;
    cube5.position.y = 10.6;
    cube5.position.z = 12.1;
    scene.add(cube5);

	var cube6 = new THREE.Mesh(cubeGeometry5, cubeMeterial5);
    cube6.castShadow = true;
    cube6.position.x = 1.13;
    cube6.position.y = 11.1;
    cube6.position.z = 12.1;
    scene.add(cube6);

	var cube7 = new THREE.Mesh(cubeGeometry5, cubeMeterial5);
    cube7.castShadow = true;
    cube7.position.x = -1.05
    cube7.position.y = 10.6;
    cube7.position.z = 12.1;
    scene.add(cube7);

	var cube8 = new THREE.Mesh(cubeGeometry5, cubeMeterial5);
    cube8.castShadow = true;
    cube8.position.x = -0.87
    cube8.position.y = 11.1;
    cube8.position.z = 12.1;
    scene.add(cube8);

	//make body
	var bodyGeometry = new THREE.BoxGeometry(5,2,6);
    var bodyMeterial = new THREE.MeshPhongMaterial({color: 0xF8F8F8});
    var body = new THREE.Mesh(bodyGeometry, bodyMeterial);
    body.castShadow = true;
    body.position.x = 0;
    body.position.y = 7;
    body.position.z = 9;
    scene.add(body);

	var legGeometry = new THREE.BoxGeometry(1.5,1,2);
    var legMeterial = new THREE.MeshPhongMaterial({color: 0xFFF2F1});
    var leg = new THREE.Mesh(legGeometry, legMeterial);
    leg.castShadow = true;
    leg.position.x = 1.5;
    leg.position.y = 5.5;
    leg.position.z = 11.5
    scene.add(leg);

	var leg2 = new THREE.Mesh(legGeometry, legMeterial);
    leg2.castShadow = true;
    leg2.position.x = -1.5;
    leg2.position.y = 5.5;
    leg2.position.z = 11.5
    scene.add(leg2);

	var leg3 = new THREE.Mesh(legGeometry, legMeterial);
    leg3.castShadow = true;
    leg3.position.x = 1.5;
    leg3.position.y = 5.5;
    leg3.position.z = 6.5
    scene.add(leg3);

	var leg4 = new THREE.Mesh(legGeometry, legMeterial);
    leg4.castShadow = true;
    leg4.position.x = -1.5;
    leg4.position.y = 5.5;
    leg4.position.z = 6.5
    scene.add(leg4);

	var tailGeometry = new THREE.BoxGeometry(1,1,1);
    var tailMeterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var tail = new THREE.Mesh(tailGeometry, tailMeterial);
    tail.castShadow = true;
    tail.position.x = 1.5;
    tail.position.y = 7.4;
    tail.position.z = 5
    scene.add(tail);

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
    spotLight.position.set(-40,60,50);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 5120;
    spotLight.shadow.mapSize.height = 5120;
    scene.add(spotLight);
    camera.position.x = 0;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(scene.position);  
    document.getElementById("threejs_scene").appendChild(renderer.domElement);
    // renderScene();
    var renderScene = new function renderScene() {
        requestAnimationFrame(renderScene);
        //cube animation
        //cube.rotation.x += 0.01;

        //cube.rotation.y += 0.01;
        //cube.rotation.z += 0.01;
        //sphere animation  
		var rabbit= [cube, cube2, cube3, cube4, cube5, cube6, cube7, cube8, body, leg, leg2, leg3, leg4, tail, ear, ear2, ear3, ear4];
        step += 0.1;
		for(var i=0; i<rabbit.length; i++) {
			rabbit[i].position.y = rabbit[i].position.y + (0.2 * Math.cos(step));
		}
		
        renderer.render(scene,camera);
    }
}
window.onload = init();