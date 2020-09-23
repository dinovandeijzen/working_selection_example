class RayysMouse {
    constructor(renderer, camera, controls) {
      this.renderer = renderer;
      this.camera = camera;
      this.controls = controls;
  
      this.mouse = new THREE.Vector2();
      this.rawCoords = new THREE.Vector2();
  
      this.cb = {}
      this.cb.onMouseDown = [];
      this.cb.onMouseUp = [];
      this.cb.onMouseMove = [];
  
      var onMouseDown = function(event) {
        if (this.controls) {
          this.controls.enablePan = false;
          this.controls.enableRotate = false;
        }
  
        this.prevMouse = this.mouse.clone();
        this.updateMouseCoords(event, this.mouse);
        this.mouseDown = this.mouse.clone();
        this.rawMouseDown = this.rawCoords.clone();
  
        // notify subscribers
        for (var i=0; i<this.cb.onMouseDown.length; i++) {
            this.cb.onMouseDown[i](this.mouse, event, this);
        }
      };
  
      var onMouseUp = function(event) {
        this.prevMouse = this.mouse.clone();
        this.updateMouseCoords(event);
        this.mouseDown = undefined;
        this.rawMouseDown = undefined;
  
        if (this.controls) {
          this.controls.enablePan = false;
          this.controls.enableRotate = false;
        }
        
        for (var i=0; i<this.cb.onMouseUp.length; i++) {
            this.cb.onMouseUp[i](this.mouse, event, this);
        }
      };
  
      var onMouseMove = function(event) {
        this.prevMouse = this.mouse.clone();
        this.updateMouseCoords(event);
        if (!this.prevMouse.equals(this.mouse)) {
          for (var i=0; i<this.cb.onMouseMove.length; i++) {
            this.cb.onMouseMove[i](this.mouse, event, this);
          }
        }
      };
  
      renderer.domElement.addEventListener('mousemove', onMouseMove.bind(this), false);
      renderer.domElement.addEventListener('mousedown', onMouseDown.bind(this), false);
      renderer.domElement.addEventListener('mouseup',   onMouseUp.bind(this),   false);
    }
  
    updateMouseCoords(event) {
      this.rawCoords.x =  (event.clientX - this.renderer.domElement.offsetLeft)      - this.renderer.domElement.offsetWidth/2;
      this.rawCoords.y = -(event.clientY - this.renderer.domElement.offsetTop + 0.5) + this.renderer.domElement.offsetHeight/2;
      this.mouse.x =  ((event.clientX - this.renderer.domElement.offsetLeft + 0.5) / this.renderer.domElement.offsetWidth)  * 2 - 1;
      this.mouse.y = -((event.clientY - this.renderer.domElement.offsetTop + 0.5)  / this.renderer.domElement.offsetHeight) * 2 + 1;
    }
    
    subscribe(mouseDownHandler, mouseMoveHandler, mouseUpHandler) {
      this.cb.onMouseDown.push(mouseDownHandler);
      this.cb.onMouseMove.push(mouseMoveHandler);
      this.cb.onMouseUp.push(mouseUpHandler);
    }
  
  }

  // added

  // this is the core of the solution,
// it builds the Frustum object by given camera and mouse coordinates
function updateFrustrum(camera, mousePos0, mousePos1, frustum) {
  let pos0 = new THREE.Vector3(Math.min(mousePos0.x, mousePos1.x), Math.min(mousePos0.y, mousePos1.y));
  let pos1 = new THREE.Vector3(Math.max(mousePos0.x, mousePos1.x), Math.max(mousePos0.y, mousePos1.y));

  // build near and far planes first
  {
  	// camera direction IS normal vector for near frustum plane
    // say - plane is looking "away" from you
    let cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    
    // INVERTED! camera direction becomes a normal vector for far frustum plane
    // say - plane is "facing you"
    let cameraDirInv = cameraDir.clone().negate();

		// calc the point that is in the middle of the view, and lies on the near plane
    let cameraNear = camera.position.clone().add(cameraDir.clone().multiplyScalar(camera.near));
    
    // calc the point that is in the middle of the view, and lies on the far plane
    let cameraFar = camera.position.clone().add(cameraDir.clone().multiplyScalar(camera.far));

		// just build near and far planes by normal+point
    frustum.planes[0].setFromNormalAndCoplanarPoint(cameraDir, cameraNear);
    frustum.planes[1].setFromNormalAndCoplanarPoint(cameraDirInv, cameraFar);
  }

	// next 4 planes (left, right, top and bottom) are built by 3 points:
  // camera postion + two points on the far plane
  // each time we build a ray casting from camera through mouse coordinate, 
  // and finding intersection with far plane.
  // 
  // To build a plane we need 2 intersections with far plane.
  // This is why mouse coordinate will be duplicated and 
  // "adjusted" either in vertical or horizontal direction

  // build frustrum plane on the left
  if (true ) {
    let ray = new THREE.Ray();
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    // Here's the example, - we take X coordinate of a mouse, and Y we set to -0.25 and 0.25 
    // values do not matter here, - important that ray will cast two different points to form 
    // the vertically aligned frustum plane.
    ray.direction.set(pos0.x, -0.25, 1).unproject(camera).sub(ray.origin).normalize();
    let far1 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far1);

    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    // Same as before, making 2nd ray
    ray.direction.set(pos0.x, 0.25, 1).unproject(camera).sub(ray.origin).normalize();
    let far2 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far2);

    frustum.planes[2].setFromCoplanarPoints(camera.position, far1, far2);
  }

  // build frustrum plane on the right
  if (true) {
    let ray = new THREE.Ray();
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.set(pos1.x, 0.25, 1).unproject(camera).sub(ray.origin).normalize();
    let far1 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far1);

    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.set(pos1.x, -0.25, 1).unproject(camera).sub(ray.origin).normalize();
    let far2 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far2);

    frustum.planes[3].setFromCoplanarPoints(camera.position, far1, far2);
  }

  // build frustrum plane on the top
  if (true) {
    let ray = new THREE.Ray();
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.set(0.25, pos0.y, 1).unproject(camera).sub(ray.origin).normalize();
    let far1 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far1);

    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.set(-0.25, pos0.y, 1).unproject(camera).sub(ray.origin).normalize();
    let far2 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far2);

    frustum.planes[4].setFromCoplanarPoints(camera.position, far1, far2);
  }

  // build frustrum plane on the bottom
  if (true) {
    let ray = new THREE.Ray();
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.set(-0.25, pos1.y, 1).unproject(camera).sub(ray.origin).normalize();
    let far1 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far1);

    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.set(0.25, pos1.y, 1).unproject(camera).sub(ray.origin).normalize();
    let far2 = new THREE.Vector3();
    ray.intersectPlane(frustum.planes[1], far2);

    frustum.planes[5].setFromCoplanarPoints(camera.position, far1, far2);
  }
}

// checks if object is inside of given frustum,
// and updates the object material accordingly
//ACTUAL LOOP TO SET MATERIAL COLOR




function selectObjects(objects, frustum) {

  if(parameters3.h==true){
    console.log("gebouwfunctie aanwijzen");
      


            for (let key of Object.keys(objects)) {

              if (frustum.intersectsBox(objects[key].bbox)) {
                if (!objects[key].selected) {
                  //objects[key].obj.material = selectedMaterial;
                  objects[key].obj.material = materialFunction;
                  objects[key].colorFunction = materialFunction;  //storing for longer use
                  //console.log(objects[key].colorFunction);
                  console.log(objects[key].obj.id);  //   extract correct id
                  cubeID.push(objects[key].obj.id);  //   puts the  id in array to select
                  



                }
                objects[key].selected = true;
              } else {
                if (objects[key].selected) {
                  //objects[key].obj.material = defaultMaterial;
                  cubeID.length=0; // make array with temp objects id blank
                }
                objects[key].selected = false;
              }
            }
  }
  else {

    console.log("cluster aanwijzen");
    for (let key of Object.keys(objects)) {

      if (frustum.intersectsBox(objects[key].bbox)) {
        if (!objects[key].selected) {
          //objects[key].obj.material = selectedMaterial;
          objects[key].obj.material = materialCluster;
          objects[key].colorCluster = materialCluster;  //storing for longer use
          //console.log(objects[key].colorFunction);
          console.log(objects[key].obj.id);  //   extract correct id
          cubeID.push(objects[key].obj.id);  //   puts the  id in array to select
          



        }
        objects[key].selected = true;
      } else {
        if (objects[key].selected) {
          //objects[key].obj.material = defaultMaterial;
          cubeID.length=0; // make array with temp objects id blank
        }
        objects[key].selected = false;
      }
    }



  }
}