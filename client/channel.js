/*eslint-disable no-console*/
//@flow
var Channel = function() {
	var channel = { 
		default : null ,
		db:[],
		mergeAll : __merge__,
		add : __add__,
		filter: __filter__,
		indexOf: __indexOf__,
		status: __status__,
		deleteId: __deleteId__,
		value : __value__
	};

	function __merge__(value /*:mixed*/) {
		this.default = value; 
		this.db.length = 0; 

		return this;
	}

	function __add__( value, ids ) {
		let i = this.indexOf(value);
		let newTargets = new Set( ids );
		let originalDb = Array.from(this.db);

		try { 
			this.deleteId(ids);
			if ( this.db[i] ) {
				this.db[i].targets = this.db[i].targets.union( newTargets );
			} else {
				i = this.db.push( { "value":value, "targets": newTargets }) - 1;
			}
		} catch( err ) {
			console.log("something goes wrong, rollingback changes");
			this.db = originalDb;
			throw err;
		}


		return this;
	}

	function __indexOf__ ( value ) {
		let i = 0;
		let n = this.db.length;

		while ( i < n ) {
			if ( this.db[i].value === value ) {
				return i;
			}
			i++;
		}
		return -1;
	}

	function __status__ ( ids ) {
		if ( this.db.length === 0 ) {
			if ( !this.default ) {
				return "empty";
			} else {
				return "sticky";
			}
		} else {
			let r = this.filter(ids);
			if( r.length === 1 ) {
				if ( !r[0].value ) {
					return "empty";
				} else {
					return "single";
				}
			} else {
				return "multi";
			}
		}
	}

	function __filter__ (targetList ) {
		let setB = new Set( targetList );
		let result = [];
		let itemsFound = new Set();
		for ( let rule of this.db ) {
			let intersection = setB.intersection( rule.targets );
			itemsFound = itemsFound.union( intersection );
			if ( intersection.size > 0 ) {
				result.push({"value": rule.value, "targets": intersection});
			}
		}
		
		// l'intersection des elements qui n'ont pas ete trouve avec les ids de l'objet, ont la valeur par default
		let itemWithDefaultValue = setB.difference(itemsFound);
		if ( itemWithDefaultValue.size > 0 ) {
			result.push({value: this.default, targets: itemWithDefaultValue});
		}
		
		return result;
	}

	function __deleteId__ (ids) {
		let setB = new Set ( ids );
		let toDelete = [];
		var that = this;
		for ( let i =0 ; i < this.db.length ; i++ ) {
			this.db[i].targets = this.db[i].targets.difference( setB );
			if ( this.db[i].targets.size === 0 ) {
				toDelete.push(this.db[i].value);
			}
		}

		toDelete.forEach( function(v) { that.db.splice( that.indexOf(v), 1 ); } );

		return this;
	}

	function __value__(id) {
		let r = this.default;

		for ( let i = 0; i < this.db.length ; i++ ) {
			if ( this.db[i].targets.has(id) ) {
				r = this.db[i].value ;
				break;
			}
		}

		return r ? r : Config.csv.defaultValue;
	}

	function __create__ () {
		return Object.create( channel );
	}

	return {
		create: __create__  
	};
};

// var c = Channel().create();
//
// c.add( null, [1,2,3,4,5,6,7] ); // null:[1,2,3,4,5,6,7]
// console.log( c.db );
// c.add( "rt", [4,5,6,7] ); //rt:4,5,6,7 et null:1,2,3
// c.add( 1, [4,5,2,3]); //rt:6,7 et null:1 et 1:4,5,2,3
// c.add( 2, [1,5,2,3]); //2:1,5,2,3 rt:6,7 et 1:4
// c.add(  null, [7,6]);// null:7,6 2:1,5,2,3 et 1:4
// console.log( c.db );
// console.log( c.db.length );
// console.log(c.filter([7,1,5,4]));
// console.log(c.status());
// console.log(c.status([7,6]));
// console.log(c.status([5,1]));
// c.mergeAll();
// console.log(c.status([5,1]));
// c.mergeAll(66);
// console.log("merge all");
// console.log(c.db);
// console.log(c.status([5,1]));
// console.log(c.status());
