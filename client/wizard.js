var wizard = (function (){
	const fixedLength = 1;
	var engine = {};
	var dyno = {};
	var control = {};
	var desc ={ 
		ctrlmode : "opMode",
		ctrltime : "opTime",
		engine:    "opEngine",
		dyno :    "opDyno",
		active :    "opActive",
		selected :    "opSelected",
		id :       "opId"
	};

	control.time   = 45;
	control.mode    = 45;

	var myFunctions = {
		"up-down" : function () {
			var seq = [];
			var count = 0;
			console.log("wizard: up-down...");
			for( var dyno_setvalue = dyno.max ; dyno_setvalue >= dyno.min ; dyno_setvalue -= dyno.step )
				for( var engine_setvalue = engine.max ; engine_setvalue >= engine.min ; engine_setvalue -= engine.step ) {
					var obj ={};
					obj[desc.engine] = engine_setvalue.toFixed(fixedLength);
					obj[desc.dyno] = dyno_setvalue.toFixed(fixedLength);
					obj[desc.ctrltime] = control.time.toFixed(fixedLength);
					obj[desc.ctrlmode] = control.mode;
					obj[desc.active] = 1;
					obj[desc.selected] = 0;
					obj[desc.id] = count++;
					seq.push (obj);		
				}
			return seq;
				 },
		"down-up" : function () {
			var seq = [];
			var count = 0;
			console.log("wizard: down-up...");
			for( var dyno_setvalue = dyno.min ; dyno_setvalue <= dyno.max ; dyno_setvalue += dyno.step )
				for( var engine_setvalue = engine.min ; engine_setvalue <= engine.max ; engine_setvalue += engine.step ) {
					var obj ={};
					obj[desc.engine] = engine_setvalue.toFixed(fixedLength);
					obj[desc.dyno] = dyno_setvalue.toFixed(fixedLength);
					obj[desc.ctrltime] = control.time.toFixed(fixedLength);
					obj[desc.ctrlmode] = control.mode;
					obj[desc.active] = 1;
					obj[desc.selected] = 0;
					obj[desc.id] = getNewId();
					seq.push (obj);		
				}
			return seq;
		}
	};

	function _step(max,min,count) {
		var c = Math.max( 1, count -1);
		var step = (max === min )? 1:(max-min)/c;
		if (count === 1) step ++;
		return step
	}

	return {
		data:	function(obj, descriptor/* =desc */) {
					desc = descriptor || desc;
					control.mode = obj["regulation-mode"];
					control.time = parseInt(obj["control-time"]);

					engine.min = parseInt(obj["min-engine"]);
					engine.max = parseInt(obj["max-engine"]);
					if (obj["type-engine"] === "step") {
						engine.step = parseInt(obj["type-engine-value"]);
					} else {
						engine.step = _step( engine.max, engine.min, parseInt(obj["type-engine-value"]));
					}
					dyno.min = parseInt(obj["min-dyno"]);
					dyno.max = parseInt(obj["max-dyno"]);
					if (obj["type-dyno"] === "step") {
						dyno.step = parseInt(obj["type-dyno-value"]);
					} else {
						dyno.step = _step( dyno.max, dyno.min, parseInt(obj["type-dyno-value"]));
					}
					return this;
				},

		compute : function(name) {
					  return myFunctions[name]();
				  }
	}

})();

