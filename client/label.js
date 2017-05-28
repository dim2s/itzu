/* global Papa */
// require("../client/set.js");
// var Papa = require("babyparse");

/* module.exports =  */function Labels() {
	var collection = Object.create( labelDb );
	collection.errors = [];
	collection.files = [];
	// collection of labels
	// each label objec has the following properties: name, description, unit, min, max, type
	collection.db = [] ;
	return collection;
}

const lineSeparator = /\r\n\r|\n/g;

var labelDb = {
	qtyKeys : { name : "\"iName\"", desc : "\"iDescription\"", unit: "\"rUnit\""},
	fieldSeparator : ";",
};

// reset de collection
labelDb.delete = function () {
	this.db.length = 0;
	this.files.length  = 0;
	this.errors.length = 0;
	this.save();
	return this;
};

// load data from data storage, if possible 
// TODO: better error handling
//       is it really necessary to save and retrieve errors?
labelDb.load = function() {
	var msg;
	if ( typeof(Storage) !== "undefined") {
		var local = JSON.parse(localStorage.getItem("a2l"));
		if ( local ) { 
			this.db = local.db; 
			this.files = local.files;
			this.errors = []; //local.errors;
		} else {
			msg = "The key for storing the labels doesn't exist in the store!";
		}
	} else {
		msg =  "Sorry! No Web Storage support.. your informations will be lost when you close the browser";
	}

	if (msg) {
		this.errors.push ({
			"type": "WARNING",
			"code": 0,
			"message" : msg,
			"row" : -1 
		});
	}

	return this;
};

// save data in local storage if possible....
labelDb.save = function() {
	var msg;
	if (typeof(Storage) !== "undefined") {
		try { 
			localStorage.setItem("a2l", JSON.stringify(this));
		} catch ( error ) {
			msg = "The local storage is full please, delete all labels before";
		}
	} else {
		msg = "Sorry! No Web Storage support.. your informations will be lost when you close the browser";
	}

	if (msg) {
		this.errors.push ({
			"type": "WARNING",
			"code": 0,
			"message" : msg,
			"row" : -1 
		});
	}


	return this;
};

// Sanity check before insertion
// we don't verify the description file as it is sometimes empty in csv files
// errors { type, code, message, row }
labelDb.checkLabel = function (iteration, obj) {
	var type = "Label validation test";
	var code = " Invalid field";

	if ( !obj.name || !isNaN(parseInt(obj.name))  ) {
		this.errors.push ({
			"type": type,
			"code": code,
			"message" : obj.name + " is not a valid name",
			"row" : iteration
		});
	}

	// if ( !obj.unit || !isNaN(parseInt(obj.unit)) ) {
	// 	if(obj.unit !== "0/1") {
	// 		this.errors.push ({
	// 			"type": type,
	// 			"code": code,
	// 			"message" : obj.unit + " is not a valid unit",
	// 			"row" : iteration
	// 		});
	// 	}
	// }

	if ( !obj.type || !isNaN(parseInt(obj.type)) ) {
		this.errors.push ({
			"type": type,
			"code": code,
			"message" : obj.type + " is not a valid type",
			"row" : iteration
		});
	}

	// if ( !obj.desc ||  !isNaN(parseInt(obj.desc))) {
	// 	this.errors.push ({
	// 		"type": type,
	// 		"code": code,
	// 		"message" : obj.desc + " is not a valid desc",
	// 		"row" : iteration
	// 	});
	// }

	if ( obj.max && isNaN(parseInt(obj.max)) ) {
		this.errors.push ({
			"type": type,
			"code": code,
			"message" : obj.max + " is not a valid desc",
			"row" : iteration
		});
	}

	if ( obj.min && isNaN(parseInt(obj.min)) ) {
		this.errors.push ({
			"type": type,
			"code": code,
			"message" : obj.min + " is not a valid desc",
			"row" : iteration
		});
	}
	return this;
};

// return the status of the db ( a2l, qty ) for ( file, date, size )
labelDb.status = function() {
};

// parse an A2l buffer
labelDb.parseA2l = function ( content ) {

	var re = /\/begin CHARACTERISTIC([\s\S]*?)\/end CHARACTERISTIC/g;
	var characteristic;
	var i = 0;
	var that = this;

	while ((  characteristic = re.exec(content)) !== null) {
		//console.log("regex match, prochaine correspondance à partir de " + re.lastIndex);
		parseCharacteristics( characteristic[1] );
		i++;
	}

	function parseCharacteristics( buffer ) {
		var re = /[^\s\n\t]+["\w .%-/]+/g;
		var token = buffer.match(re);
		var obj ={};

		obj.name = token[0];
		obj.type = token[2];
		obj.desc = token[1];
		obj.min  = parseFloat(token[7]);
		obj.max  = parseFloat(token[8]);
		// TODO: for performance reason we must do an ordered insert instead
		that.checkLabel( i, obj); 
		that.binaryInsert(obj);
	}

	return this;
};

//parse a Qty csv file
labelDb.parsePumaQty = function(buffer) {

	var config = {
		delimiter : ";" ,
		header : true,
		// quoteChar: "\"\"",
		skipEmptyLines: true
	};

	// all lines except the header are ending with ";;"
	// seems to be a not really well formated csv from avl...
	// so I just strip it, so the csv parser won't complain at every row!
	var re = /;{1,2}\r\n/g;
	buffer = buffer.replace(re,"\r\n");

	// now we can parse the csv file
	var parsed = Papa.parse( buffer, config );
	
	this.errors = this.errors.concat( parsed.errors );

	for( let i = 1 ; i < parsed.data.length  ; i++ ) {
		var obj = {
			name: parsed.data[i][this.qtyKeys.name].replace(/\"/g,""),
			desc: parsed.data[i][this.qtyKeys.desc].replace(/\"/g,""),
			unit: parsed.data[i][this.qtyKeys.unit].replace(/\"/g,""),
			type: "NN"
		};

		this.checkLabel( i+1, obj); 
		this.binaryInsert(obj);
	}

	return this;
};

labelDb.isA2lFile = function(content) {
	var re = /\/begin CHARACTERISTIC([\s\S]*?)\/end CHARACTERISTIC/g;

	return re.exec(content) !== null ;
};

labelDb.isPumaQtyFile = function(buffer) {
	var line = buffer.split(lineSeparator);
	if ( line.length < 2 ) {
		console.warn("[Warning] " + this.file + " should contain at least a header and 1 entry");
		return false;
	}

	var columns = new Set(line[0].split(";").map( function(col) { return col.replace( /\"\"/g,"");}));

	var keys = new Set( [] );
	for ( let k in this.qtyKeys ) {
		keys.add(this.qtyKeys[k]);
	}

	if ( columns.size < keys.size ) {
		console.warn("[Warning] " + this.file + " should contain at least " + keys.size + " columns ");
		return false;
	}

	if ( columns.intersection(keys).size < keys.size ) {
		console.warn("[Warning] " + this.file + " miss some columns ");
		return false;
	}

	return true;
};

// parse a buffer, will autodetect the file type and do the operations
labelDb.parse = function(filename, buffer ) {

	if ( this.isA2lFile(buffer) ) {
		this.files.push({file:filename, type:"A2L"});
		return this.parseA2l(buffer);
	}
	
	if ( this.isPumaQtyFile(buffer) ) {
		this.files.push({file:filename, type:"PUMA NN"});
		return this.parsePumaQty(buffer);
	} 

	this.errors.push( {
		type: "File format",
		code: "Unsupported file type",
		message: filename, 
		row: "0"
	});

	return this;
};

//
// TODO: use Intl.Collator instead of localeCompare
// binary Insert base on the label name, we want the list with no duplicate entrie and always sorted
labelDb.binaryInsert = function (obj, startVal, endVal){
	var length = this.db.length;
	var start = typeof(startVal) != "undefined" ? startVal : 0;
	var end = typeof(endVal) != "undefined" ? endVal : length - 1;//!! endVal could be 0 don't use || syntax
	var m = start + Math.floor((end - start)/2);
	
	if(length == 0) {
		this.db.push(obj);
		return;
	}

	if( obj.name.localeCompare( this.db[end].name ) > 0 ) {
		this.db.splice(end + 1, 0, obj);
		return;
	}

	if( obj.name.localeCompare( this.db[start].name ) < 0 ) {
		this.db.splice(start, 0, obj);
		return;
	}

	if(start >= end){
		return;
	}

	if( obj.name.localeCompare( this.db[m].name ) < 0 ) {
		this.binaryInsert(obj, start, m - 1);
		return;
	}

	if( obj.name.localeCompare( this.db[m].name ) > 0 ) {
		this.binaryInsert(obj, m + 1, end);
		return;
	}
	//we don't insert duplicates
};
