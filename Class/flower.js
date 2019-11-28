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

	var geometry = new THREE.BoxGeometry(2,2,2);
	var axis = new THREE.Vector3(0, 0, 0.5); // rotate
	var radIncrement = 0.2;
	var rad = 0;

	var stemMaterial = new THREE.MeshLambertMaterial( { color: 0xE46666 } );
	var floMaterial = new THREE.MeshLambertMaterial( { color: 0xFFC2C2} );
	var floMaterial2 = new THREE.MeshLambertMaterial( { color: 0xFFA7A7} );

	var stem = new THREE.Mesh( geometry, stemMaterial );
	stem.position.set( 0, 2, 0 );
	stem.scale.set( 0.3, 1.5, 0.3 );

	var flo = new THREE.Mesh( geometry, floMaterial );
	flo.position.set( 0, 4.5, 0 );
	flo.scale.set( 0.9, 0.9, 0.7 );

	var flow = new THREE.Mesh( geometry, floMaterial );
	flow.position.set( -0.3, 5.5, 0 );
	flow.scale.set( 0.7, 0.7, 1.0 );

	var flow2 = new THREE.Mesh( geometry, floMaterial2 );
	flow2.position.set( -1.5, 6, 0 );
	flow2.scale.set( 0.7, 0.7, 0.5 );
	//flow2.rotateOnAxis(axis, 20);

	var flow3 = new THREE.Mesh( geometry, floMaterial2 );
	flow3.position.set( 1, 8, 0 );
	flow3.scale.set( 0.7, 0.7, 0.5 );

	var flower = new THREE.Group();
	flower.add(stem);
	flower.add(flo);
	flower.add(flow);
	flower.add(flow2);
	flower.add(flow3);
	
	scene.add(flower);

	/*scene.add(flower);
	scene.add(stem);
	scene.add(flo);
	scene.add(flow);
	scene.add(flow2);
	scene.add(flow3);*/

	/*var geometry,
	geometry2,
    group;

	geometry = new THREE.BoxGeometry(8, 8, 8 );
	geometry2 = new THREE.BoxGeometry(7, 7, 7);

	var leaveDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x91E56E } );
	var leaveLightMaterial = new THREE.MeshLambertMaterial( { color: 0xA2FF7A } );
	var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x71B356 } );
	var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x7D5A4F } );

	var stem = new THREE.Mesh( geometry2, stemMaterial );
	stem.position.set( 0, 6, 0 );
	stem.scale.set( 0.3, 1.5, 0.3 );

	var squareLeave01 = new THREE.Mesh( geometry, leaveDarkMaterial );
	squareLeave01.position.set( 2.5, 17.6, 2.5 );
	squareLeave01.scale.set( 0.8, 0.8, 0.8 );

	var squareLeave02 = new THREE.Mesh( geometry, leaveDarkMaterial );
	squareLeave02.position.set( -3.4, 15.3, -3.4 );
	squareLeave02.scale.set( 0.7, 0.7, 0.7 );

	var squareLeave03 = new THREE.Mesh( geometry, leaveDarkMaterial );
	squareLeave03.position.set( 3.4, 15.7, -3.5 );
	squareLeave03.scale.set( 0.7, 0.7, 0.7 );

	var leaveDark = new THREE.Mesh( geometry, leaveDarkMaterial );
	leaveDark.position.set( 0, 15.2, 0 );
	leaveDark.scale.set( 1, 2, 1 );

	var leaveLight = new THREE.Mesh( geometry, leaveLightMaterial );
	leaveLight.position.set( 0, 15.2, 0 );
	leaveLight.scale.set( 1.1, 0.5, 1.1 );

	var tree = new THREE.Group();
	tree.add( leaveDark );
	tree.add( leaveLight );
	tree.add( squareLeave01 );
	tree.add( squareLeave02 );
	tree.add( squareLeave03 );
	tree.add( stem );

  	scene.add( tree );*/

	//make light
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40,60,50);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 5120;
    spotLight.shadow.mapSize.height = 5120;
    scene.add(spotLight);

    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 20;
    camera.lookAt(scene.position);  
    document.getElementById("threejs_scene").appendChild(renderer.domElement);
    // renderScene();
    var renderScene = new function renderScene() {
        requestAnimationFrame(renderScene);
		//rad += radIncrement;
		//flow2.rotateOnAxis(axis, rad);
		flower.rotation.y += 0.01;
        renderer.render(scene,camera);
    }
}
window.onload = init();