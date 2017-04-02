var a=new Uint32Array(10);
var counter = 0;

crypto.getRandomValues(a);

seed = a[0];

function getNewId() {

	var myid = murmurhash2_32_gc(counter.toString() , seed)
	counter = counter + 1
	return myid
}

function test_collision( nb_test){ 
	idList = [];
	for ( var i=0; i<=nb_test; i++ ) {
		var t = getNewId();
		if (!idList.includes(t)){
			idList.push(t);
		} else {
			console.log("collision detected: id=" + t + ", i=" + i + "!!!!");
			return;
		}	
	}
	console.log( "There were " + idList.length + " id created without any collisions!");
}

