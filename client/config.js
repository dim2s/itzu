var Config = {
	csv : {
		header : {
			"Engine"	:{ label : "TST_ENGINE_TARGET", data:"opEngine"},
			"Dyno"		:{ label : "TST_DYNO_TARGET",	data: "opDyno" },
			"Mode"		:{ label : "TST_CMOD",		data: "opMode" },
			"Activ"		:{ label : "TST_ACTIV_OP",	data: "opActive"},
			"Time"		:{ label : "TST_SSQ_LENGHT",	data: "opTime" }
		},
		trigger : {
			"Before": 0,
			"After" : 1
		},
		type : {
			"Map"	: "map_ecu",
			"Curve"	: "curve_ecu",
			"Value"	: "param_ecu",
			"NN"	: "param",
			"Draft"	: "param" 
		},
		mode : {
			"IDLE"		:	9,
			"IDLE_CONTROL"	:	10,
			"N/ACCEL"	:	8,
			"N/C_BRT_5H"	:	12,
			"N/X_VALUE"	:	16,
			"C_BRT_5H/ACCEL":	11,
			"C_BRT_5H/N"	:	13,
			"C_BRT_5H/X_VALUE":	17
		},
		fieldSeparator : ";",
		valueSeparator : "/",
		defaultValue   : "*"
	}
};

