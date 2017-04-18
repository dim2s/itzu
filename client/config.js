var Config = {
	csv : {
		header : {
			"Engine"	:"TST_ENGINE_TARGET",
			"Dyno"		:"TST_DYNO_TARGET",
			"Mode"		:"TST_CMOD",
			"Activ"		:"TST_ACTIV_OP",
			"Time"		:"TST_SSQ_LENGHT"
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

