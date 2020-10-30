class RayCastSelectHelper{
    constructor(){
        this.raycaster = new THREE.Raycaster();
        this.selectedObject = null;
        this.selectObjectColorFlag = true;
    }
    select(scene, camera, mouse){
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(scene.children);
        if(intersects.length){
            if (intersects[0].object != this.selectedObject)
            {
                if (this.selectedObject){
                this.selectedObject.material.color.set(this.selectedObject.current);
                }
                this.selectedObject = intersects[0].object;
                this.selectedObject.current = this.selectedObject.material.color.getHex();
                this.selectedObject.material.color.set(0xffff00);
            }
        }
        else
        {
            if ( this.selectedObject ){
            this.selectedObject.material.color.set(this.selectedObject.current);
            this.selectedObject = null;
            }
        }

    }
}
function animate() {
    cube.rotation.x += 1;
    cube.rotation.y += 1;
    cube.position.y += 0.01;
    if (cube.position.y > 3){
        cube.position.y = 0;
    }

   //console.log(t)
    //camera.position.z = 0.2 + 5 * t
    plane.rotateY(0.01);
    plane.rotateX(0.01);
    raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
    //rayCastSelectHelper.select(scene, camera, mouse);
    for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

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
	//mouse.x = ( event.clientX / window.innerWidth/2 ) * 2 - 1;
    //mouse.y = - ( event.clientY / window.innerHeight/2 ) * 2 + 1;
    if(inCanvas == true){

        const c = renderer.domElement;
        mouse.x = (event.offsetX / c.clientWidth)*2-1;
        mouse.y = ((c.clientHeight - event.offsetY) / c.clientHeight)*2-1;
        console.log("mouse.x = ",mouse.x);
        console.log("mouse.y =", mouse.y);
    }

}

function onWindowResize() {
    // probably change window to renderer.domElement.clientHeight etc
    //let aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
}


