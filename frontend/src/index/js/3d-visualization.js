
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
    
	requestAnimationFrame( animate )
	renderer.render( scene, camera );
}

function createPlane(x,y,z, constant){
    return THREE.Plane(new THREE.Vector3(x,y,z), constant);
}

function userCreatePlane(scene,x,y,z ,constant, size, color){
    plane = createPlane(x,y,z,constant);
    planeHelper = new THREE.PlaneHelper(plane, size, color);
    scene.add(planeHelper);
}
