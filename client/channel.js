/*eslint-disable no-console*/
function SetValue (val, obj) {
	this.idSet = new Set(obj);
	this.target = val || null;
}

SetValue.prototype.clear = function() {
	this.idSet.clear();
	this.target = null;
};

SetValue.prototype.hasAll = function(obj) {
	// quick hack :
	// if the selection is empty we return false so that
	// we say that there is not a single value
	if (obj.length === 0 ) {
		return false;
	} else {
		return this.idSet.isSuperset(new Set(obj));
	}
};

SetValue.prototype.hasAny = function(obj) {
	return this.idSet.intersection(new Set(obj)).size > 0;
};

SetValue.prototype.add = function(obj) {
	var setB = new Set(obj);
	for ( var element of setB ) {
		this.idSet.add(element);
	}
	return this;
};

SetValue.prototype.delete = function(obj) {
	var setB = new Set(obj);
	for ( var element of setB ) {
		this.idSet.delete(element);
	}
	return this;
};

SetValue.prototype.value = function(val) {
	if( !arguments.length ) {
		return this.target;
	}
	this.target = val;
	return this;
};

SetValue.prototype.ids = function() {
	return Array.from(this.idSet);
};

(function () {
	console.log("Object SetValue: testing interface.....");

	try {
		var a = new SetValue();
		console.assert (a.value() === null);
		a.value(666);
		console.assert( a.value() === 666 );
		a.value(6).clear();
		console.assert (a.value() === null);
		console.assert (a.value(0.001).value() === 0.001);
		console.assert (a.ids().length === 0 );
		console.assert (a.add(["a","b", 1]).ids().length === 3 );
		console.assert (a.hasAll(["a"]) );
		console.assert (a.hasAll(["b"]) );
		console.assert (a.hasAll([1]) );
		a.delete([1]);
		console.assert(!a.hasAll([1]));
		a.add([1,2,3,4,5]);
		a.delete(["a","b","c"]);
		console.assert (!a.hasAll(["a"]) );
		console.assert (!a.hasAll(["b"]) );

		var b = new SetValue();
		b.add([5,6,7,8,9]);
		console.assert(b.hasAll([6]) && a.hasAll([5]));
	}

	catch(error) {
		console.log("oops something goes wrong!!!! " );
		throw error;
	}

	console.log("Object SetValue: all tests passed");

})();

var SetValues = function (val) {
	this.globalValue = val || null ;
	this.specificValues = [];
};

SetValues.prototype.merge = function (val) {
	this.globalValue = val || null;
	this.specificValues.length = 0;
	return this;
};

// Attention, le fait de permettre ensuite d'ajouter des ids directement
// ne permet pas d'assurer la coherence.
// la structure SetValue doit être privée a se module
SetValues.prototype.item = function (val) {
	for( var e of this.specificValues ){
		if (e.value() === val ) {
			return e;
		}
	}
};

SetValues.prototype.values = function () {
	return this.specificValues;
};

SetValues.prototype.indexOf = function (val) {
	for ( var i=0; i < this.specificValues.length; i++ ) {
		if (this.specificValues[i] === val ) {
			return i;
		}
	}
	return -1;
};

SetValues.prototype.delete = function (val) {
	this.specificValues.splice(this.indexOf(val),1);
};



// not sure that I need to retrieve several value a once
// for now I will return a single value and monitoring the logs
// to see If it happens to return several values ( should never happen )
SetValues.prototype.getItemById = function (iterable) {
	var r = [];
	for ( var e of this.specificValues ){
		if (e.hasAny(iterable)) {
			r.push(e);
		}
	}
	return r;
};

SetValues.prototype.value = function (ids) {
	// is there some specifics values?
	if( this.specificValues.length === 0 ) {
		// if there is no specific values but a global value
		// the global value will be for all ids => sticky
		// in other case there is no value at all
		if ( this.globalValue ) {
			return this.globalValue;
		} else {
			return null;
		}
	} else {
		// we know there is specific values so we want to know if one of them
		// is applicable for all our ids
		for ( var e of this.specificValues ) {
			if ( e.hasAll(ids) ) {
				return e.value();
			}
		}
		// if not our ids will be a conbinaison of specific values & globalValue
		return undefined;
	}
};

function status2(ids) {
	// is there some specifics values?
	if( this.specificValues.length === 0 ) {
		// if there is no specific values but a global value
		// the global value will be for all ids => sticky
		// in other case there is no value at all
		if ( this.globalValue ) {
			return "sticky";
		} else {
			return "empty";
		}
	} else {
		// we know there is specific values so we want to know if one of them
		// is applicable for all our ids
		for ( var e of this.specificValues ) {
			if ( e.hasAll(ids) ) {
				return "single";
			}
		}
		// if not our ids will be a conbinaison of specific values & globalValue
		return "multiple";
	}
}
//if there is no specific value, then we lookup for global value
//otherwise depending of the number of specific values return single or multiple
SetValues.prototype.status = status2; 
// SetValues.prototype.status =  function (ids) {
// 	var nbValues = this.getItemById(ids).length;
//
// 	if ( nbValues === 0 ) {
// 		if ( this.globalValue === null ) {
// 			return "empty";
// 		} else {
// 			return "sticky";
// 		}
// 	} else if ( nbValues === 1 ) {
// 		return "single";
// 	} else if ( nbValues >= 1 ) {
// 		return "multiple";
// 	} 
//
// 	// if ( this.specificValues.length === 0 ) {
// 		// if ( this.globalValue === null ) {
// 			// return "empty";
// 		// } else {
// 			// return "sticky";
// 		// }
// 	// } else {
// 		// if ( this.getItemById(ids).length === 1 ) {
// 			// return "single";
// 		// } else {
// 			// return "multiple";
// 		// }
// 	// }
// };

// remove the given ids from setvalues
SetValues.prototype.purge = function ( ids /* :Array  */) {
	var valToRemove = [];
	var that = this;
	for( var e of this.specificValues ) {
		e.delete(ids);
		if ( e.ids().length === 0 ) {
			valToRemove.push(e.value());	
		}
	}
	valToRemove.forEach( function(v) { that.delete(v); } );
};

//we don't want to double value in the list
//so we check that it already exists.
//no need to do the same for ids, set take this into account
SetValues.prototype.update = function ( val, ids ) {
	this.purge( ids );
	if (!this.item(val)) {
		var setValue = new SetValue(val,ids);
		this.specificValues.push(setValue);
	} else {
		this.item(val).add(ids);
	}
	return this;
};

(function () {
	console.log("Object SetValues: testing interfaces ....");
	try {
		// testing the constructor
		var a = new SetValues(666);
		console.assert( a );

		// testing update function
		a.update("f");
		console.assert(a.item("f").ids().length === 0);
		console.assert(!a.item("1") );
		a.update("f",[1,2,3,4,5]);
		console.assert(a.getItemById([2,3,4])[0].value() === "f");
		console.assert(a.getItemById([1])[0].value() === "f");
		console.assert(a.getItemById([5])[0].value() === "f");
		console.assert(a.getItemById([6])[0] === undefined);
		a.update("f", []);
		console.assert(a.values().length === 1);
		a.update(2);
		console.assert(a.values().length === 2);

		//testing purge and update function
		a.update("f",[1,2,3,4,5]); //f#[1,2,3,4,5],2#[]
		a.purge([1,2,3,4,5]);		// empty
		a.update(2,[4,5,6,7,8,9,10]);	//2#[4,5,6,7,8,9,10];
		console.assert(a.getItemById([4,5])[0].value() === 2 );
		console.assert(a.getItemById([6,7,8,9,10])[0].value() === 2 );
		a.update("f",[1,2,3,4,5]); //f#[1,2,3,4,5],2#[]
		console.assert(a.getItemById([4,5])[0].value() === "f" );
		console.assert(a.getItemById([11])[0] === undefined );

		// testing status
		a = new SetValues(9);
		console.assert(a.status([1,2,3]) === "sticky");
		a = new SetValues();
		console.assert(a.status([1,2,3]) === "empty" );
		a.update(12344,[1,2,3]);
		a.update(45,[1,2,4]);
		console.assert(a.status([3]) === "single");
		console.assert(a.status([1,2,3,4]) === "multiple");
		

	} catch (exception) {
		console.log("Object SetValues: ooops something goes wrong!!!");
		throw exception;
	}

	console.log("Object SetValues: all tests passed");
})();
