var wizard = (function (){

	var engine = {};
	var dyno = {};
	var control = {};
	var desc ={ 
		ctrlmode : "opMode",
		ctrltime : "opTime",
		engine:    "opEngine",
		dyno :    "opDyno",
		id :       "opId"
	};

	control.time   = 45;
	control.mode    = 45;

	var myFunctions = {
		updown : function () {
			var seq = [];
			var count = 0;
			console.log("up-down...");
			for( var dyno_setvalue = dyno.min ; dyno_setvalue <= dyno.max ; dyno_setvalue += dyno.step )
				for( var engine_setvalue = engine.min ; engine_setvalue <= engine.max ; engine_setvalue += engine.step ) {
					var obj ={};
					obj[desc.engine] = dyno_setvalue;
					obj[desc.dyno] = engine_setvalue;
					obj[desc.ctrltime] = control.time;
					obj[desc.ctrlmode] = control.mode;
					obj[desc.id] = ++count;
					seq.push (obj);		
				}
			return seq;
		}
	};

	return {
		data:	function(obj, descriptor=desc) {
					desc = descriptor;
					control.mode = obj["regulation-mode"];
					control.time = parseInt(obj["control-time"]);

					engine.min = parseInt(obj["min-engine"]);
					engine.max = parseInt(obj["max-engine"]);
					if (obj["type-engine"] === "step") {
						engine.step = parseInt(obj["type-engine-value"]);
					} else {
						engine.step = (engine.max-engine.min)/parseInt(obj["type-engine-value"]);
					}
					dyno.min = parseInt(obj["min-dyno"]);
					dyno.max = parseInt(obj["max-dyno"]);
					if (obj["type-dyno"] === "step") {
						dyno.step = parseInt(obj["type-dyno-value"]);
					} else {
						dyno.step = (dyno.max-dyno.min)/parseInt(obj["type-dyno-value"]);
					}
					return this;
				},

		compute : function(name) {
					  return myFunctions[name]();
				  }
	}

})();

