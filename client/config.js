var Config = {
	frm: {
		wizard: { label: "Wizard", class: "wizard"  },
		newOp:  { label: "New"   , class: "new-op"  },
		editOp: { label: "Edit"  , class: "edit-op" },
		newCh:  { label: "New"   , class: "new-ch"  },
		editCh: { label: "Edit"  , class: "edit-ch" },
		csvImport: { label: "Import CSV"  , class: "csv-import" },
		lblImport: { label: "Config"  , class: "lbl-import" },
	},
	csv : {
		header : {
			"Engine"	:{ label : "TST_ENGINE_TARGET", data:"opEngine"},
			"Dyno"		:{ label : "TST_DYNO_TARGET",	data: "opDyno" },
			"Mode"		:{ label : "TST_CMOD",		data: "opMode" },
			"Activ"		:{ label : "TST_ACTIV_OP",	data: "opActive"},
			"Time"		:{ label : "TST_SSQ_LENGHT",	data: "opTime" }
		},
		trigger : {
			"Before ramp operating point": { value : 0 },
			"After ramp operating point" : { value : 1 }
		},
		type : {
			"MAP"	: "map_ecu",
			"CURVE"	: "curve_ecu",
			"VALUE"	: "param_ecu",
			"NN"	: "param",
			"DRAFT"	: "param" 
		},
		mode : {
			"IDLE"		:	{ value: 9  , engineRange: [-8000,8000], dynoRange:[-8000,8000] },
			"IDLE_CONTROL"	:	{ value: 10 , engineRange: [-8000,8000], dynoRange:[-8000,8000] },
			"N/ACCEL"	:	{ value: 8  , engineRange: [0,150],	 dynoRange: [-8000,8000] },
			"N/C_BRT_5H"	:	{ value: 12 , engineRange: [0,500],	 dynoRange: [-8000,8000] },
			"N/X_VALUE"	:	{ value: 16 , engineRange: [-8000,8000], dynoRange: [-8000,8000] },
			"C_BRT_5H/ACCEL":	{ value: 11 , engineRange: [0,150],	 dynoRange: [0,500] },
			"C_BRT_5H/N"	:	{ value: 13 , engineRange: [-8000,8000], dynoRange: [0,500] },
			"C_BRT_5H/X_VALUE":	{ value: 17 , engineRange: [-8000,8000], dynoRange: [0,500] }
		},
		fieldSeparator : ";",
		valueSeparator : "/",
		defaultValue   : "*"
	},
	defaultContent: {
		"opActive" : 1,
		"opSelected" : 0
	}
};

function invert( dict ) {
	var newDict = {};

	for (var key in dict ) {
		if( dict.hasOwnProperty(key) ) {
			newDict[ dict[key].value ] = key;
		}
	}
	return newDict;
}

var reverseMode = invert(Config.csv.mode);
var reverseTrigger = invert(Config.csv.trigger);
