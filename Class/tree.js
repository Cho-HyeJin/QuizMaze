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

	var scene,
    camera,
    renderer,
    geometry,
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

  	scene.add( tree );

	//make light
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40,60,50);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 5120;
    spotLight.shadow.mapSize.height = 5120;
    scene.add(spotLight);

    camera.position.x = -10;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(scene.position);  
    document.getElementById("threejs_scene").appendChild(renderer.domElement);
    // renderScene();
    var renderScene = new function renderScene() {
        requestAnimationFrame(renderScene);
        renderer.render(scene,camera);
    }
}
window.onload = init();