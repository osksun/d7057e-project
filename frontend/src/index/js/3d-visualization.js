
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
    
    requestAnimationFrame(animate);
    controls.update();
	renderer.render(scene, camera);
}

function createPlane(x,y,z, constant){
    return THREE.Plane(new THREE.Vector3(x,y,z), constant);
}

function userCreatePlane(scene,x,y,z ,constant, size, color){
    plane = createPlane(x,y,z,constant);
    planeHelper = new THREE.PlaneHelper(plane, size, color);
    scene.add(planeHelper);
function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    console.log("mouse.x = ",mouse.x);
    console.log("mouse.y =", mouse.y);

}

}
