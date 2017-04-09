var fs = require('fs');

eval(fs.readFileSync('./client/set.js').toString());

function isIterrable(obj) {
	if (obj != null && typeof obj[Symbol.iterator] === 'function' ) {	
		return true;
	}
	return false;
}

var Channel = function () { 
	var globalValue = "*" ;
	var specificValues = [] ;
	return {
		status: function(ids) {
			console.log("to be implemnted");
		},
		merge : function (val) {
			globalValue = val ;
			specificValues.length = 0;
		},
		values : function (ids) {
			var s;
			if (isIterrable(ids)) {	
				s = ids;
			} else {
				s = ( ids == null ) ? [] : [ids];
			}
			
			var idSet = new Set(s);
			var r = new Set(null);
			for ( let e of idSet ) {
				var valueFound = false;
				specificValues.forEach( function (v) { 
					if ( v.idList.has(e) ) {
						r.add(v.value);
						valueFound = true;
					}
				});
				if(!valueFound) {
					r.add(globalValue);
				}
			}

			return Array.from(r);
		},
		remove: function (val) {
			var idx = indexOf(val);
			if ( idx !== -1 ){
				specificValues.splice(idx,1);
			}
			return this;
		},
		purge : function (id) {
			console.log( specificValues );
			specificValues.forEach( function(e) {
				if( e.idList.has(id) ) {
					e.idList.delete(id);
				}
			});
		},
		indexOf : function (val) {
			for( var i=0; i < specificValues.length; i++ ) {
				if ( specificValues[i].value === val ) {
					return i;
				}
			};
			return -1;
		},
		add : function (val,id) {
			var idx = this.indexOf(val);
			this.purge(id);
			if (idx===-1){
				if ( !isIterrable(id)){
					var s = new Set([id]);
				} else {
					var s = new Set(id);
				}
				specificValues.push({"value":val,"idList":s});
			} else {
				specificValues[idx].idList.add(id);
			}
			return this;
		},
		ids : function(val) {
			var idx = this.indexOf(val);
			if (idx !== -1 ) {
				return Array.from( specificValues[idx].idList);
			}
			return [];
		},
		has : function (val) {
			for ( var i=0; i < specificValues.length; i++ ) { 
				if ( specificValues[i].value === val ) {
					return true;
				}
			};
			return false;
		}
//status(ids)
	};
};

a = new Channel();

a.add(0,"a");
console.assert( a.has(0) );
a.add(1,"b");
console.assert( a.has(1) );
a.add(0,"c");
console.assert( a.ids(0)[0] === 'a' );
console.assert( a.ids(0)[1] === 'c' );
a.add(2,"d");
var temp = new Set(a.values(["a","b","d"]));
console.assert( temp.intersection( new Set([0,1,2]) ).size === 3 );
console.assert( a.values("d")[0]===2 );
console.assert( a.values("d").length ===1 );
console.assert( a.values("x")[0]==="*" );
a.merge(66);
console.assert( a.values(["a","b","d"])[0] === 66 );
console.assert( a.values(["a","b","d"]).length === 1 );
a.add(55,1);
console.assert( a.has(55) );
console.log( a.values([1,"b","d"]) );
a.add(54,1);
console.log( a.values([1,"b","d"]) );
