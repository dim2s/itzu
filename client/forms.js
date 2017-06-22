/* global Config alert wizard getNewId Channel FileReader Labels*/
/* Note:
 * 1 - element of dataTableAutoImport class must have an id which match exactly the data columns field data field 
 */
//TODO: change calmelcase name contextual-items, dataTableAutoImport chnLabelList chnValue etc.. => contextual-items
//TODO: build option list for unit 
//TODO: in a2L there is more than map,curve,value => how to deal with that

const parsleyConfig = {
	trigger: null,
	classHandler: function(el) { 
		return el.$element.closest("div.form-group");
	},
	errorsContainer: function(el) { 
		return el.$element.closest("div.form-group");
	},
	errorsWrapper: "<span class='help-block'></span>", // do not set an id for this elem, it would have an auto-generated id
	errorElem: "<span></span>" ,
	errorTemplate: "<span>/<span>",
	errorClass: "has-error",
	successClass: "has-success"
};

function chFrm( className ) {
	var t = "<form id='form-modal' class='" + className + "'>";
	t += 	"<div class='form-group contextual-items'>" ;
	t += 	"<label for='label' class='control-label'>Label:</label>"  ;
	t += 	"<input type='text' class='form-control dataTableAutoImport' id='chnLabel' placeholder='Choose label to apply...' required > " ;
	// t += 		"<datalist id='chnLabelList'> </datalist>" ;
	t += 	"</div>" ;
	t += 	"<div class='form-group contextual-items'>" ;
	t += 		"<label for='value' class='control-label'>Value:</label>" ;
	t += 		"<input type='digits' class='form-control dataTableAutoImport' id='chnValue'>" ;
	t += 	"</div>" ;
	t += 	"<div class='form-group contextual-items'>" ;
	t += 		"<label for='trigger' class='control-label'>Trigger:</label>" ;
	t += 		"<select class='form-control dataTableAutoImport' id='chnTrigger' >" ;
	t += 		buildOptions(Config.csv.trigger) ;
	t += 		"</select>" ;
	t += 	"</div>" ;
	t += 	"<div class='form-group contextual-items'>" ;
	t += 		"<label for='type' class='control-label'>Type </label>" ;
	t += 		"<select class='form-control dataTableAutoImport' id='chnType'>" ;
	t += 		buildOptions(Config.csv.type) ;
	t += 		"</select>" ;
	t += 	"</div>" ;
	t += 	"</form>";

	return t;
}

function uploadFrm(className) {
	var t = "<form id='form-modal' class='" + className + "'>";
	if ( className === Config.frm.lblImport.class )  {
		t += 	"<div class='form-group contextual-items'>" ;
		t +=		 "<button type='button' class='btn btn-default' id='delete-labels' >Delete labels</button>";
		t += 	"</div>";
	}
	t += "<label class='btn btn-primary contextual-items' for='file-selector'>" ;
	t += "<input id='file-selector' class='" + className + "' type='file' style='display:none;' >Select file" ; 
	t += "</label>";
	t += "</form>";
	return t;
}

function configFrm(className) {
	var t = "";
	var library = Labels().load();

	t+= "<p>You can upload labels from A2l files or Puma quantities CSV files";
	t+= ". These labels will be used for the autocompletion feature when you create";
	t+= " or Edit a label.</p>";
	t += "<div class='bs-callout bs-callout-info'>";
	t += "<h4>Currently in use</h4>";
	if ( library.files.length === 0 ) {
		t += "no source file for labels in local store";
	} else {
		t += "<ul>";
		for ( let k in library.files ) {
			t += "<li><strong>" + library.files[k].type + "</strong>: " + library.files[k].file + "</li>";
		}
		t += "</ul>";
	}

	t += "</div>";
	t += "</br>";
	t += "<div class='text-center'>";
	t += "<div class='btn-group btn-group-lg'>";
	t += 	"<label class='btn btn-default' for='a2lcsv-file-selector'>" ;
	t += 		"<input id='a2lcsv-file-selector' class='" + className + "' type='file' style='display:none;' >Select A2L or CSV" ; 
	t += 	"</label>";
	t += 	 "<button type='button' class='btn btn-default' id='delete-labels' >Delete labels</button>";
	t += "</div>";
	t += "</div>";
	return t;
}

function opFrm(className) {
	var t = "<form id='form-modal' class='" + className + "'>";
	t+= "<div class='form-group contextual-items'>"; 
	t+= "<label for='type' class='control-label'>Mode:</label>" ;
	t+=		"<select class='form-control dataTableAutoImport' name='regulation-mode' id='opMode' required>";
	t+=		"<option value='' disabled selected>Select a regulation mode ... </option>";
	t+=		buildOptions(Config.csv.mode);
	t+=		"</select>";
	t+= 	"</div>" ;
	t+= 	"<div class='form-group contextual-items'>" ;
	t+= 		"<label for='value' class='control-label'>Dyno:</label>" ;
	t+= 		"<input class='form-control dataTableAutoImport' id='opDyno' type='digits' required>" ;
	t+= 	"</div>" ;
	t+= 	"<div class='form-group contextual-items'>" ;
	t+= 		"<label for='value' class='control-label'>Engine:</label>" ;
	t+= 		"<input class='form-control dataTableAutoImport' id='opEngine' type='digits' required>" ;
	t+= 	"</div>" ;
	t+= 	"<div class='form-group contextual-items'>" ;
	t+= 		"<label for='value' class='control-label'>Run Time (s):</label>" ;
	t+= 		"<input class='form-control dataTableAutoImport' id='opTime' type='number' value='45' required>" ;
	t+= 	"</div>";
	t +="</form>";

	return t;
}

function wizardFrm(className) {
	var t;
	t = "<form id='form-modal' class='" + className + "'>";
	t +=	"<h5 class='contextual-items'>Control mode settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<select class='form-control' name='regulation-mode' id='regulation-mode' required>";
	t +=		"<option value='' disabled selected>Select a regulation mode ... </option>";
	t += 		buildOptions(Config.csv.mode);
	t +=		"</select>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon1' >Run Time (s):</span>";
	t +=			"<input type='number' class='form-control'  aria-describedby='basic-addon1' name='control-time' value='45' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<hr class='contextual-items'>";
	t +=	"<h5 class='contextual-items'>Direction settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='radio'>";
	t +=			"<label class='active'><input type='radio' name='direction' aria-label='DownUp' value='down-up' checked='' >Down-Up</label>";
	t +=		"</div>";
	t +=		"<div class='radio'>";
	t +=			"<label ><input type='radio' name='direction' aria-label='UpDown' value='up-down' >Up-Down</label>";
	t +=		"</div>";
	t +=		"<div class='radio'>";
	t +=			"<label ><input type='radio' name='direction' aria-label='FullLoad' value='down-up' disabled='true'>Full-Load</label>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<hr class='contextual-items'>";
	t +=	"<h5 class='contextual-items'>Dyno settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon1'>Min</span>";
	t +=			"<input type='digits' name='min-dyno' id='min-dyno' class='form-control'  aria-describedby='basic-addon1' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon2'>Max</span>";
	t +=			"<input type='digits' name='max-dyno' id='max-dyno' class='form-control'  aria-describedby='basic-addon2' data-parsley-gt='#min-dyno' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class= 'input-group step-count-group'>";
	t +=			"<span class='input-group-addon'>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label class='active'><input type='radio' name='type-dyno' aria-label='Step' checked='' value='step'>Step</label>";
	t +=				"</div>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label><input type='radio' name ='type-dyno' aria-label='Step' value='count'>Count</label>";
	t +=				"</div>";
	t +=			"</span>";
	t +=			"<input type='number' class='form-control step-count-value'  name='type-dyno-value' aria-describedby='basic-addon1' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<hr class='contextual-items'>";
	t +=	"<h5 class='contextual-items'>Engine settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon3'>Min</span>";
	t +=			"<input type='digits' class='form-control'  aria-describedby='basic-addon3' name='min-engine' id='min-engine' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon1'>Max</span>";
	t +=			"<input type='digits' class='form-control'  aria-describedby='basic-addon1' name='max-engine' id='max-engine' data-parsley-gt='#min-engine' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class= 'input-group step-count-group'>";
	t +=			"<span class='input-group-addon'>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label class='active'><input type='radio' name ='type-engine' aria-label='Step' checked='' value='step'>Step</label>";
	t +=				"</div>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label><input type='radio' name ='type-engine' aria-label='Count' value='count'>Count</label>";
	t +=				"</div>";
	t +=			"</span>";
	t +=			"<input type='number' class='form-control step-count-value'  name='type-engine-value' aria-describedby='basic-addon1' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +="</form>";
	return t;
}

// print callout msg in the modal box
// msg.text: text to print (html format)
// msg.type: ( default, primary, info, warning, error, success )	
function printCalloutMsg(msg) {
	var callout = $(".bs-callout-" + msg.type );

	callout.removeClass("hidden");
	callout.find("p").empty();
	callout.find("p").html(msg.text);
}

//================================================ Init Functions ============================================================================
function lblImportInit() {
	// TODO: tell the user that there is no labels available
	// TODO: do not keep old error logs
	var file;
	var reader = new FileReader();
	var library = Labels().load();

	//$(".save").prop("disabled", true);

	if ( library.errors.length > 0 ) {
		let pTag;
		pTag = $(".bs-callout-warning").removeClass("hidden").find("p").empty();
		for ( let k in library.errors ) {
			pTag.append( library.errors[k].message);
		}
	}

	$(".save").on("click",function() {
		library.errors.length = 0;
		library.save();
		if ( library.errors.length > 0 ) {
			var pTag, callout;
			$(".bs-callout").addClass("hidden");
			callout = $(".bs-callout-warning").removeClass("hidden");
			pTag = callout.find("p").empty();
			for ( let k in library.errors )  {
				pTag.append( library.errors[k].message );
			}
		} else { 
			modalFormDestroy();
			return false;
		}
	});

	// parse A2L file
	$("#a2lcsv-file-selector").on("change",function() {
		file = this.files[0];
		library.errors.length = 0;

		reader.onload = function( event ) {
			library.parse(file.name, event.target.result);
		};

		reader.onloadend = function ( event ) {
			if ( event.target.readyState == FileReader.DONE ) {
				var msg = "";
				var callout;
				msg +=  "</br><strong>file name:</strong> " + file.name + "</br>" ;
				msg +=  "<strong>file size:</strong> " + (file.size/1024).toFixed(1) + " KByte </br>" ;
				msg +=  "<strong>Channels:</strong> " + library.db.length + "</br>" ;
				if ( library.errors.length > 0 ) { 
					msg +=  "<strong>errors: </strong></br><ul>" ;
					for (let i =0; i<library.errors.length ; i++ ) {
						msg += "<li>"+ library.errors[i].code + "</li>";
					}
					msg += "</ul>";
					callout = $(".bs-callout-error").removeClass("hidden");
				} else {
					callout = $(".bs-callout-success").removeClass("hidden");
					//$(".save").prop("disabled", false);
				}
				callout.find("p").html(msg);
			}
		};

		reader.onerror = function (event) {
			$(".bs-callout-error").removeClass("hidden");
			$(".bs-callout-error > p").empty();
			$(".bs-callout-error > p").append("File could not be read ( error: " + event.target.error.code + ")");
		};

		reader.readAsText(file);
	});

	$("#delete-labels").on( "click" , function() {
		library.delete();
		$(".bs-callout-success")
			.removeClass("hidden")
			.find("p").text("all the labels have been deleted!!!");
	});

}

function csvImportInit() {
	var opList = [];
	var chnList = {};

	$(".save").on("click", function() {
		$("#opDataTable").DataTable().clear().rows.add(opList).draw();
		$("#chnDataTable").DataTable().clear();

		for ( let key in chnList ) {
			$("#chnDataTable").DataTable().row.add(chnList[key]);
		}
		$("#chnDataTable").DataTable().rows().draw();

		modalFormDestroy();
		return false;
	});

	$("#file-selector.csv-import").on("change",function() {
		var file = this.files[0];
		var reader = new FileReader();
		var message = {};

		
		function parseCsvFile(text,msg) {
			var dict_header = {};
			var dict_mode = {};
			var dict_trigger = {};
			var lines = [];

			for ( let k in Config.csv.trigger ) {
				dict_trigger[Config.csv.trigger[k]] = k;
			}

			for ( let k in Config.csv.header ) {
				dict_header[ Config.csv.header[k].label ] = Config.csv.header[k].data;
			}

			for ( let k in Config.csv.mode ) {
				dict_mode[ Config.csv.mode[k] ] = k;
			}

			// when exporting a test file without channels Itzu appends ";" at the end of file
			// if we do not remove it, we will have to handle empty fields after split operations
			lines = text.split(/\r\n|\r|\n/g);
			lines = lines.map( function(e) { return e.replace(/;$/,""); });

			// lines 1: header => init the parser
			let header = lines[0].split(Config.csv.fieldSeparator);

			// first part of header contains operating point setvalues TST_ACTIV, TST_MODE, etc...
			let headerPart1Length = Object.keys(Config.csv.header).length;

			// process lines ( not the header )
			for( let i=1 ; i < lines.length ; i ++ ) {
				let op = {};

				let line = lines[i].split(Config.csv.fieldSeparator);

				// all lines should at least contains the operating point setvalues
				if ( line.length < headerPart1Length ){
					msg.text = "csv import: invalid line length (" + i + ")";
					msg.type = "error";
					return;
				}

				// store operating point setvalues
				for ( let j=0 ; j < headerPart1Length  ; j++ ){
					op[ dict_header[header[j]] ] = line[j] ;
				}
				
				// each operating point is identify by a uid
				op.opId = getNewId().toString();

				//append operating point to the operating point list
				opList.push(op);

				// now process the channels for each operating point
				for ( let j=headerPart1Length; j<header.length; j++ ){
					let label, type, val, trigger, key, data;

					//retrieve channels name and type that should look like this "label/type"
					data = header[j].split(Config.csv.valueSeparator);
					if (data.length != 2) {
						msg.text = "csv import: invalid header (col=" + j + ", " + header[j] + ")";
						msg.type = "error";
						return;
					}

					[ type, label ] = data;
					// the type must be known
					// TODO: verifier que le type est dans le dictionnaire qui va bien

					// retrieve channels value and trigger
					data = line[j].split(Config.csv.valueSeparator);
					if (data.length != 2) {
						msg.text = "csv import: invalid value (col=" + j + ", " + line[j] + ")";
						msg.type = "error";
						return;
					}

					[ val, trigger ] = data;

					val = ( val === "*") ? null : val ;

					//check the unicity of "label#trigger"
					//TODO: vu le format du fichier l'unicite est plutot label#type...
					key = [label,trigger].join("#");
					if (!(key in chnList)) {
						var chn = {};
						chn.chnLabel = label;
						chn.chnType = type;
						// chn.chnTrigger = dict_trigger[trigger];
						chn.chnTrigger = trigger;
						chn.chnSetValues = Channel().create();
						chnList[key] = chn;
					}
					chnList[key].chnSetValues.add( val, [op.opId] );
				}
			}

			// lines n: operating point lines
			for ( let key in chnList ) {
				chnList[key].chnSetValues.db.some( function (rule) {
					if( rule.targets.size === (lines.length -1 ) ){
						chnList[key].chnSetValues.default = rule.value;
						chnList[key].chnSetValues.db.length = 0;
					}
				});
			}

			msg.text =  "file name: " + file.name + "</br>";
			msg.text +=  "file size: " + (file.size/1024).toFixed(1) + " KByte </br>";
			msg.text +=  "lines: " + lines.length + "</br>";
			msg.type = "success";

		}
		
		reader.onload = function( event ) {
			parseCsvFile(event.target.result, message);
		};

		reader.onloadend = function ( event ) {
			if ( event.target.readyState == FileReader.DONE ) {
				printCalloutMsg( message );
			}
		};

		reader.readAsText(file);
	});
}

function wizardFrmInit() {
	var formInstance = $("#form-modal.wizard").parsley(parsleyConfig);

	// for engine and dyno settings count must be an integer but step could be a float
	// so depending on the user selection we toggle the input value type ( digits or integer )
	$(".step-count-group").on("change", function() {
		if ( $(this).find("input[type='radio']:checked").val() === "step") {
			$(this).find("input.step-count-value").attr("type", "digits");
		} else {
			$(this).find("input.step-count-value").attr("type", "number");
		}
	});

	$("input[name='direction'][type='radio']").on("change", function() {
		if( $("input[name='direction'][aria-label='FullLoad']").is(":checked")) {
			$("input[name='min-engine']").val(100);
			$("input[name='min-engine']").attr("readonly","true");
			$("input[name='max-engine']").val(101);
			$("input[name='max-engine']").attr("readonly",true);
			$("input[name='type-engine-value']").val("1");
			$("input[name='type-engine-value']").attr("readonly",true);
			$("input[name='type-engine'][aria-label='Count']").prop("checked", true);
			$("input[name='type-engine']").attr("disabled",true);
		} else {
			$("input[name='min-engine']").attr("readonly",false);
			$("input[name='max-engine']").attr("readonly",false);
			$("input[name='type-engine-value']").attr("readonly",false);
			$("input[name='type-engine']").attr("disabled",false);
		}
	});

	$("select#regulation-mode").on("change", function() {
		var mode = $("#regulation-mode option:selected").text();
		$("#min-engine,#max-engine").attr("data-parsley-range","["+Config.csv.mode[mode].engineRange.toString()+"]");
		$("#min-dyno,#max-dyno").attr("data-parsley-range","["+Config.csv.mode[mode].dynoRange.toString()+"]");

		// fullLoad is allowed only in N/Accel mode
		if ( mode === "N/ACCEL" ) {
			$("input[name='direction'][aria-label='FullLoad']").attr("disabled",false);
		} else {
			$("input[name='direction'][aria-label='FullLoad']").attr("disabled",true);
			$("input[name='direction'][aria-label='DownUp']").prop("checked",true).trigger("change");
		}

	});

	$(".save").on("click", function() {
		if ( formInstance.validate() ) {
			wizardAction();
			modalFormDestroy();
		}
	});
}

// TODO: before validation check that channelLabel#trigger is not duplicate
function chFrmInit() {
	var dt = $("#chnDataTable").DataTable();
	var rowSelected = dt.rows( ".selected" );
	var idx= rowSelected.indexes();
	var labelCollection = Labels().load();
	var targets = new Set ($("#opDataTable").DataTable().rows(".selected").ids().toArray());
	var formInstance = $("#form-modal").parsley(parsleyConfig);

	$("#chnLabel").flexdatalist({
		minLength: 3,
		searchIn: "name",
		maxShownResults: 15,
		visibleProperties: ["name"],
		valueProperty: "*",
		data:labelCollection.db
	});
	
	$("#chnLabel").on("change:flexdatalist", function(e,value, text, option) {
		//in case the input is not from the select list
		//we disable all parsley check added
		if ( value === text ) {
			$("#chnType ").val(option.type).prop("disabled",false);
			$("#chnValue").removeAttr("data-parsley-range");
			$("#chnValue").removeAttr("data-parsley-gt");
			$("#chnValue").removeAttr("data-parsley-lt");
		}
	});

	$("#chnLabel").on("select:flexdatalist", function(e,option) {
		// in case the user select something from the list we autocomplete what we can
		$("#chnType ").val(option.type).prop("disabled",true);
		if ( typeof(option.max)==="number" && typeof(option.min) === "number" ) {
			$("#chnValue").attr("data-parsley-range","["+option.min+", "+ option.max + "]");
		} else if ( typeof(option.max)==="number" ) {
			$("#chnValue").attr("data-parsley-gt",option.max);
		} else if (typeof(option.min) === "number" ) {
			$("#chnValue").attr("data-parsley-lt",option.min);
		}

	});

	if ( $("#form-modal").hasClass("edit-ch") ) { 
		// in edit mode we initialize the form the datatqble 
		// we should have only one row selected
		if ( rowSelected.count() !== 1 ) {
			alert("opFrmInit: [WARNING] several rows where selected instead of one");
			return;
		}
		// init the form with values from datatable
		// by initialising #chnLabel we loose the autocomplete feature of flexdatalist
		$("#chnLabel-flexdatalist").val(rowSelected.data()[0].chnLabel);
		$("#chnType").val(rowSelected.data()[0].chnType);
		$("#chnTrigger").val(rowSelected.data()[0].chnTrigger);
		// TODO:
		// * ou et comment la propriete chnValue est utilisee 
		var idSet = $("#opDataTable").DataTable().rows(".selected").ids().toArray();
		var status = rowSelected.data()[0].chnSetValues.status( idSet ) ;
		var valToEdit;
		switch(status) {
		case "sticky" :
			valToEdit = rowSelected.data()[0].chnSetValues.default;
			break;
		case "single":
			valToEdit = rowSelected.data()[0].chnSetValues.filter(idSet)[0].value;
			break;
		default:
			valToEdit = "";
		}
		$("#chnValue").val(valToEdit);
	} 
	
	$("#btn-new-ch").on("click", function() {
		if ( formInstance.validate() ) {
			var obj = {};

			// initialize obj with data from the form 
			obj.chnLabel = $("#chnLabel-flexdatalist").val();
			obj.chnType = $("#chnType").val();
			obj.chnTrigger = $("#chnTrigger").val();
			obj.chnValue = $("#chnValue").val();
			obj.chnSetValues = Channel().create();

			obj.chnSetValues.add( obj.chnValue, targets);

			// add the row and force a draw
			dt.row.add(obj).draw();
			modalFormDestroy();
			$("#chnLabel").flexdatalist("destroy");
		}
	});

	$("#btn-edit-ch").on("click", function() {
		if ( formInstance.validate() ) {
			var obj = {};
			// initialize obj with data from the form 
			obj.chnLabel = $("#chnLabel-flexdatalist").val();
			obj.chnType = $("#chnType").val();
			obj.chnTrigger = $("#chnTrigger").val();

			// initialize remaining field with datatable
			obj.chnSetValues = dt.row(idx).data().chnSetValues;

			if ( targets.size === 0 ) {
				// if no row is selected in #opDataTable we assumed that the user value
				// should be apply for all ( sticky )
				obj.chnSetValues.mergeAll($("#chnValue").val());
			} else { 
				obj.chnSetValues.add($("#chnValue").val(), targets);
			}

			//update data table
			dt.row(idx).data(obj).draw();

			modalFormDestroy();
			$("#chnLabel").flexdatalist("destroy");
			return false;
		}
	});
}


function opFrmInit() {
	var dt = $("#opDataTable").DataTable();
	var rowSelected = dt.rows( ".selected" );
	var idx= rowSelected.indexes();

	function updateRange() {
		var mode = $("#opMode option:selected").text();
		$("#opEngine").attr("data-parsley-range","["+Config.csv.mode[mode].engineRange.toString()+"]");
		$("#opDyno").attr("data-parsley-range","["+Config.csv.mode[mode].dynoRange.toString()+"]");
	}

	if ( $("form#form-modal").hasClass("edit-op") ) {
		//in Edit mode  we should have only one row selected
		if ( rowSelected.count() !== 1 ) {
			alert("opFrmInit: [WARNING] several rows where selected instead of one");
			return;
		}

		// in edit mode we initialize the form the datatqble 
		//fill the form with data of the corresponding row
		$("#form-modal *").filter(".dataTableAutoImport").each( function() {
			$(this).val(rowSelected.data()[0][$(this).attr("id")]) ;
		});

		updateRange();
	} else {
		var msg = {};
		msg.type = "info";
		
		if ( rowSelected.data().length > 0 ) {
			msg.text = "This new operating point will be placed <strong>above</strong> the first item of your selection!";
		} else {
			msg.text = "This new operating point will be placed <strong>at the end</strong> of the list";
		}
		printCalloutMsg(msg) ;
	}

	// update the dyno and engine ranges upon user's mode selection
	$("select#opMode").on("change", function () { updateRange(); } );

	//edit form submit handler
	$("#btn-edit-op").on("click", function() {
		let formInstance = $("#form-modal").parsley(parsleyConfig);
		if ( formInstance.validate() ) {
			var obj = {};

			// initialize obj with data from the form 
			$("#form-modal *").filter(".dataTableAutoImport").each( function() {
				obj[$(this).attr("id")]= $(this).val() ;
			});
			
			// initialize remaining field with datatable
			obj.opId = dt.row(idx).id();
			obj.opIndex = dt.row(idx).data().opIndex;
			obj.opActive = dt.row(idx).data().opActive;
			obj.opSelected = dt.row(idx).data().opSelected;

			//update data table
			dt.row(idx).data(obj).draw();

			modalFormDestroy();
			return false;
		}
	});

	$("#btn-new-op").on("click", function() {
		let formInstance = $("#form-modal.new-op").parsley(parsleyConfig);
		if ( formInstance.validate() ) {
			var obj = {};

			// retrieve data from the form
			$("#form-modal *").filter(".dataTableAutoImport").each( function() {
				obj[$(this).attr("id")]= $(this).val() ;
			});

			//should set it manualy , defaultContent configuartion won't do it!
			obj.opId	= getNewId();
			obj.opActive	= Config.defaultContent.opActive;
			obj.opSelected	= Config.defaultContent.opSelected; 

			if ( rowSelected.data().length > 0 ) {
				// the new row will be inserted just before the first selected row
				obj.opIndex = rowSelected.data()[0].opIndex;

				// for all below rows we compute the new index
				dt.rows().data().each( function(e) {
					if( e.opIndex >= obj.opIndex ) {
						e.opIndex +=1;
					}
				});
				dt.rows().invalidate();
			}

			// add the row and force a draw
			dt.row.add(obj).draw();

			// select the last row added ( last row of the table in our case )
			dt.rows().deselect();
			dt.row( dt.rows().count() -1 ).select();

			formInstance.destroy();
			modalFormDestroy();
		}
	});
}

function frmInit(classname) {
	switch(classname) {
	case Config.frm.lblImport.class :
		lblImportInit();
		break;
	case Config.frm.csvImport.class :
		csvImportInit();
		break;
	case Config.frm.wizard.class :
		wizardFrmInit();
		break;
	
	case Config.frm.newOp.class :
	case Config.frm.editOp.class :
		opFrmInit();
		break;

	case Config.frm.newCh.class :
	case Config.frm.editCh.class :
		chFrmInit();
		break;
	default:
		alert("frmInit: unknown form!");
		return;
	}
}

// ======================================================== Helpers functions ===========================================================
function wizardAction() {
	var rows = [];
	var data = [];
	var t1 = $("#opDataTable").DataTable();

	var f = $("#form-modal.wizard").serializeArray().reduce(function(obj,item) {
		obj[item.name] = item.value;
		return obj;
	} , {} );

	data = wizard.data(f);

	rows = data.compute(f.direction);
	
	//clear existing values from the two datatables	
	t1.clear();
	$("#chnDataTable").DataTable().clear().draw();

	t1.rows.add(rows).draw();
	t1.row(0).select();
}

function buildOptions(dict){
	var t="";
	var withValue = Object.keys(dict).every( function(k) { return dict[k].hasOwnProperty("value"); } ); 
	for ( let key in dict) {
		if ( withValue ) {
			t+="<option value='" + dict[key].value + "'>"+ key + "</option>";
		} else {
			t+="<option>"+ key + "</option>";
		}
	}
	return t;
}

function modalFormCreate(title,classname) {
	var m = $("#modal-dialog");
	var frm;
	
	switch( classname ) {
	case Config.frm.lblImport.class:
		frm = configFrm(classname);
		break;
	case Config.frm.csvImport.class:
		frm = uploadFrm(classname);
		break;
	case Config.frm.editOp.class :
		frm = opFrm(classname); 
		break;
	case Config.frm.newOp.class :
		frm = opFrm(classname); 
		break;
	case Config.frm.editCh.class :
		frm = chFrm(classname); 
		break;
	case Config.frm.newCh.class :
		frm = chFrm(classname); 
		break;
	case Config.frm.wizard.class :
		frm = wizardFrm(classname); 
		break;

	default:
		alert("modalFormCreate: unknown form!");
		return;
	}

	m.find(".modal-title").text(title);
	m.find(".modal-body > .dynamic-content").html(frm);
	// puis 
	m.find(".modal-footer > .save").attr("id", "btn-"+classname);


	// $("#form-modal").parsley(opt)
	// 	.on("field:validated", function() {
	// 		var ok = $(".parsley-error").length === 0;
	// 		$(".bs-callout-info").toggleClass("hidden", !ok);
	// 		$(".bs-callout-warning").toggleClass("hidden", ok);
	// 	});

	$(".close,.cancel").on("click", function() {
		modalFormDestroy();	
	});

	frmInit(classname);

	var modalOptions = {
		backdrop: "static" ,
		keyboard: false,
		show: true
	};

	m.modal(modalOptions);
}

function modalFormDestroy() {
	var m = $("#modal-dialog");

	// $("#form-modal").parsley().destroy();
	m.find(".modal-title").empty();
	m.find(".modal-body > .dynamic-content").empty();
	m.find(".modal-footer > .save").removeAttr("id");
	$("button.save").off("click"); 
	// m.find(".btn.btn-primary").removeAttr("form");
	m.find(".bs-callout > p").empty();
	$(".bs-callout").addClass("hidden");
	m.modal("hide");
}
