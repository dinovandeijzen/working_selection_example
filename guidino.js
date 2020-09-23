/////////////GUI




function Dgui(){






  var gui = new dat.GUI();


  parameters1 = {   //toggle building functions
    a: true,
    b: false,
    c: false,
  
  }
  parameters2 = {    // toggle  cluster assign
  
    d: false,
    e: false,
    f: false,
    g: false
  }

  parameters3 = {    // toggle  cluster assign
  
    h: true,
    i: false,
    }
 
    
  
  // Checkbox field
  var obj = {	lock: true };
  gui.add(obj, "lock").onChange(function(newvalue){
    if(count==0){
      controls2.enabled = false;
      count++;
    } else{
      controls2.enabled = true;
      count=count-1;
    }
  });
  
  
  
  // Checkbox field
  
 

  var f3 = gui.addFolder('LAYER_VIEW');

  f3.add(parameters3, 'h').name( "Building Layer").listen().onChange(function(){
    setCheckedLayer("h")
  
    for (key in cubes) {
               cubes[key].obj.material = cubes[key].colorFunction;  // refresh screen with already selected BUILDINGLAYOUT
    }
    f2.close();
    f1.open();

  }); 
  
  
  
  f3.add(parameters3, 'i').name( "Cluster Layer").listen().onChange(function(){
    setCheckedLayer("i")
    for (key in cubes) {
         cubes[key].obj.material = cubes[key].colorCluster;   // REFRESH SCREEN WITH SELECTED CLUSTERS
    }
    f1.close();
    f2.open();
  });


 f3.open();


// next layer

  var f1 = gui.addFolder('Building-type');



  f1.add(parameters1, 'a').name( "Office").listen().onChange(function(){
    setCheckedBuildings("a"),
    materialFunction = new THREE.MeshPhongMaterial({
      color: 0x606020
      
    });
 console.log("whoeppie its checked")
  }); 
  
  
  
  f1.add(parameters1, 'b').name( "Retail").listen().onChange(function(){
    setCheckedBuildings("b")
    materialFunction = new THREE.MeshPhongMaterial({
      color: 0x202020
    });


});
f1.add(parameters1, 'c').name( "Residential").listen().onChange(function(){
  setCheckedBuildings("c")
  materialFunction = new THREE.MeshPhongMaterial({
    color: 0x90090
  });


});
   f1.open();
  


///CLUSTER GUI

  var f2 = gui.addFolder('Cluster-type');

  f2.add(parameters2, 'd').name( "cluster_A").listen().onChange(function(){
    setCheckedCluster("d"),
    materialCluster = new THREE.MeshPhongMaterial({
      color: 0x002092
    });
  }); 
  
  
  
  f2.add(parameters2, 'e').name( "cluster_B").listen().onChange(function(){
    setCheckedCluster("e")
    materialCluster = new THREE.MeshPhongMaterial({
      color: 0x606626
    });


});
f2.add(parameters2, 'f').name( "Cluster_C").listen().onChange(function(){
  setCheckedCluster("f")
  materialCluster = new THREE.MeshPhongMaterial({
    color: 0x299029
  });


});

f2.add(parameters2, 'g').name( "Cluster_D").listen().onChange(function(){
  setCheckedCluster("g")
  materialCluster = new THREE.MeshPhongMaterial({
    color: 0x902020
  });


});
  f2.close();








  function setCheckedBuildings( prop ){      // the function that makes it toggle
    for (let param in parameters1){
      parameters1[param] = false;
    }
    parameters1[prop] = true;
  }

  function setCheckedCluster( prop ){      // the function that makes it toggle
    for (let param in parameters2){
      parameters2[param] = false;
    }
    parameters2[prop] = true;
  }


  function setCheckedLayer( prop ){      // the function that makes it toggle
    for (let param in parameters3){
      parameters3[param] = false;
    }
    parameters3[prop] = true;
  }



}


