
function animate() {
    cube.rotation.x += 1;
    cube.rotation.y += 1;
    cube.position.y += 0.01;
    if (cube.position.y > 3){
        cube.position.y = 0;
    }

    let t = window.scrollY /(5000 - innerHeight);
   //console.log(t)
    //camera.position.z = 0.2 + 5 * t
    plane.rotateY(0.01);
    plane.rotateX(0.01);
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if(firstTime == true){
        console.log(intersects);
        firstTime = false;
    }
	for ( let i = 0; i < intersects.length; i ++ ) {
		intersects[i].object.material.color.set(0xf0ff0f);
	}
    requestAnimationFrame(animate);
    controls.update();
	renderer.render(scene, camera);
}

function createPlane(x,y,z, constant){
    return THREE.Plane(new THREE.Vector3(x,y,z), constant);
}

function userCreatePlane(scene,x,y,z ,constant, size, color){
    let plane = new THREE.Plane(new THREE.Vector3(x,y,z), constant);
    let planeBuffer = new THREE.PlaneBufferGeometry(size,size, 10,10);
    let material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide});
    let normPlane = new THREE.Plane().copy(plane).normalize();
    let quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), normPlane.normal);

    let position = new THREE.Vector3(
        -normPlane.constant*normPlane.normal.x,
        -normPlane.constant*normPlane.normal.y,
        -normPlane.constant*normPlane.normal.z
    );

    let matrix = new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1,1,1))
    planeBuffer.applyMatrix4(matrix);

    let planeMesh = new THREE.Mesh(planeBuffer, material)
    scene.add(planeMesh);

}

function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    console.log("mouse.x = ",mouse.x);
    console.log("mouse.y =", mouse.y);

}

function onWindowResize() {
    let aspect = window.innerWidth / window.innerHeight;
    camera.left   = - frustumSize * aspect / 2;
    camera.right  =   frustumSize * aspect / 2;
    camera.top    =   frustumSize / 2;
    camera.bottom = - frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
