//Helper class for raycast selection
class RayCastSelectHelper{
    constructor(){
        this.raycaster = new THREE.Raycaster();
        this.selectedObject = null;
        this.selectObjectColorFlag = true;
    }
    select(scene, camera, mouse){
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
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
    plane.rotateY(0.01);
    plane.rotateX(0.01);
    requestAnimationFrame(animate);
    controls.update();
	renderer.render(scene, camera);
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

function onMouseMove(event, scene, canvas, mouse, rayCastSelectHelper) {
    console.log("hej");
	// calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    //if(inCanvas == true){
        mouse.x = (event.offsetX / canvas.clientWidth)*2-1;
        mouse.y = ((canvas.clientHeight - event.offsetY) / canvas.clientHeight)*2-1;
        rayCastSelectHelper.select(scene, camera, mouse);
    //}

}

function onWindowResize() {
    // probably change window to renderer.domElement.clientHeight etc
    //let aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
}


