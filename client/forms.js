/* global Config alert wizard getNewId Channel FileReader localStorage Labels*/
/* Note:
 * 1 - element of dataTableAutoImport class must have an id which match exactly the data columns field data field 
 */
//TODO: change calmelcase name contextual-items, dataTableAutoImport chnLabelList chnValue etc.. => contextual-items
//TODO: build option list for unit 
//TODO: in a2L there is more than map,curve,value => how to deal with that

function chFrm( className ) {
	var t = "<form id='form-modal' class='" + className + "'>";
	t += 	"<div class='form-group contextual-items'>" ;
	t += 	"<label for='label' class='control-label'>Label:</label>"  ;
	t += 	"<input type='text' class='form-control dataTableAutoImport' id='chnLabel' placeholder='Choose label to apply...' required > " ;
	// t += 		"<datalist id='chnLabelList'> </datalist>" ;
	t += 	"</div>" ;
	t += 	"<div class='form-group contextual-items'>" ;
	t += 		"<label for='value' class='control-label'>Value:</label>" ;
	t += 		"<input type='number' class='form-control dataTableAutoImport' id='chnValue'>" ;
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
	t += 	"<div class='form-group contextual-items'>" ;
	t += 		"<label for='type' class='control-label'>Unit (optional):</label>" ;
	t += 		"<select class='form-control dataTableAutoImport' id='chnUnit'>" ;
	t += 			"<option>-</option>" ;
	t += 			"<option>km/h</option>" ;
	t += 		"</select> " ;
	t += 	"</div>" ;
	t += 	"<div class='form-group contextual-items'>" ;
	t += 		"<label for='description' class='control-label'>Comment (optional):</label> " ;
	t += 		"<textarea class='form-control dataTableAutoImport' rows='2' id='chnDesc'>commentaires...</textarea> " ;
	t += 	"</div>";
	t += 	"</form>";

	return t;
}

function uploadFrm(className) {
	var t = "<form id='form-modal' class='" + className + "'>";
	t += "<label class='btn btn-primary contextual-items' for='file-selector'>" ;
	t += "<input id='file-selector' class='" + className + "' type='file' style='display:none;' >Select file" ; 
	t += "</label>";
	t += "</form>";
	return t;
}

function opFrm(className) {
	var t = "<form id='form-modal' class='" + className + "'>";
	t+= "<div class='form-group contextual-items'>"; 
	t+= "<label for='type' class='control-label'>Mode:</label>" ;
	t +=		"<select class='form-control dataTableAutoImport' name='regulation-mode' id='opMode' required>";
	t +=		"<option value='' disabled selected>Select a regulation mode ... </option>";
	t +=		buildOptions(Config.csv.mode);
	t +=		"</select>";
	t+= 	"</div>" ;
	t+= 	"<div class='form-group contextual-items'>" ;
	t+= 		"<label for='value' class='control-label'>Dyno:</label>" ;
	t+= 		"<input class='form-control dataTableAutoImport' id='opDyno' type='number' required>" ;
	t+= 	"</div>" ;
	t+= 	"<div class='form-group contextual-items'>" ;
	t+= 		"<label for='value' class='control-label'>Engine:</label>" ;
	t+= 		"<input class='form-control dataTableAutoImport' id='opEngine' type='number' required>" ;
	t+= 	"</div>" ;
	t+= 	"<div class='form-group contextual-items'>" ;
	t+= 		"<label for='value' class='control-label'>Time:</label>" ;
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
	t +=			"<span class='input-group-addon' id='basic-addon1' >Control time</span>";
	t +=			"<input type='number' class='form-control'  aria-describedby='basic-addon1' name='control-time' value='45' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<hr class='contextual-items'>";
	t +=	"<h5 class='contextual-items'>Direction settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='radio'>";
	t +=			"<label class='active'><input type='radio' name='direction' aria-label='Step' value='down-up' checked='' >Down-Up</label>";
	t +=		"</div>";
	t +=		"<div class='radio'>";
	t +=			"<label ><input type='radio' name='direction' aria-label='Step' value='up-down' >Up-Down</label>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<hr class='contextual-items'>";
	t +=	"<h5 class='contextual-items'>Dyno settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon1'>Min</span>";
	t +=			"<input type='number' name='min-dyno' id='min-dyno' class='form-control'  aria-describedby='basic-addon1' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon2'>Max</span>";
	t +=			"<input type='number' name='max-dyno' id='max-dyno' class='form-control'  aria-describedby='basic-addon2' data-parsley-gt='#min-dyno' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class= 'input-group'>";
	t +=			"<span class='input-group-addon'>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label class='active'><input type='radio' name='type-dyno' aria-label='Step' checked='' value='step'>Step</label>";
	t +=				"</div>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label><input type='radio' name ='type-dyno' aria-label='Step' value='count'>Count</label>";
	t +=				"</div>";
	t +=			"</span>";
	t +=			"<input type='number' class='form-control'  name='type-dyno-value' aria-describedby='basic-addon1' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<hr class='contextual-items'>";
	t +=	"<h5 class='contextual-items'>Engine settings:</h5>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon3'>Min</span>";
	t +=			"<input type='number' class='form-control'  aria-describedby='basic-addon3' name='min-engine' id='min-engine' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class='input-group'>";
	t +=			"<span class='input-group-addon' id='basic-addon1'>Max</span>";
	t +=			"<input type='number' class='form-control'  aria-describedby='basic-addon1' name='max-engine' id='max-engine' data-parsley-gt='#min-engine' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +=	"<div class='form-group contextual-items'>";
	t +=		"<div class= 'input-group'>";
	t +=			"<span class='input-group-addon'>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label class='active'><input type='radio' name ='type-engine' aria-label='Step' checked='' value='step'>Step</label>";
	t +=				"</div>";
	t +=				"<div class='radio-inline'>";
	t +=					"<label><input type='radio' name ='type-engine' aria-label='Step' value='count'>Count</label>";
	t +=				"</div>";
	t +=			"</span>";
	t +=			"<input type='number' class='form-control'  name='type-engine-value' aria-describedby='basic-addon1' required>";
	t +=		"</div>";
	t +=	"</div>";
	t +="</form>";
	return t;
}

//================================================ Init Functions ============================================================================
function lblImportInit() {
	var library = Labels();
	var reader = new FileReader();
	var file;

	// store channelList on localStore
	$("#form-modal.lbl-import").parsley()
		.on("form:submit", function() {
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem("a2l", JSON.stringify(library));
			} else {
				alert("Sorry! No Web Storage support.. your informations will be lost when you close the browser");
			}
			modalFormDestroy();
			return false;
		});

	// parse A2L file
	$("#file-selector.lbl-import").on("change",function() {
		file = this.files[0];
		
		reader.onload = function( event ) {
			library.parse(file.name, event.target.result);
		};

		reader.onloadend = function ( event ) {
			if ( event.target.readyState == FileReader.DONE ) {
				$(".modal-body").append("<div class='file-selector-info contextualItems'>");
				$(".file-selector-info").append("<hr>");
				$(".file-selector-info").append("<div class='alert alert-success contextualItems'>");
				$(".alert-success").append( "<strong>Success!</strong></br>" );
				$(".alert-success").append( "file name: " + file.name + "</br>" );
				$(".alert-success").append( "file size: " + (file.size/1024).toFixed(1) + " KByte </br>" );
				$(".alert-success").append( "Channels: " + library.db.length + "</br>" );
				$(".alert-success").append( "Warnings: " + library.errors.length + "</br>" );
			}
		};

		reader.readAsText(file);
	});
}

function csvImportInit() {
	var opList = [];
	var chnList = {};

	$("#form-modal.csv-import").parsley()
		.on("form:submit", function() {

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
		var lines = [];
		var dict_header = {};
		var dict_mode = {};
		var dict_trigger = {};

		for ( let k in Config.csv.trigger ) {
			dict_trigger[Config.csv.trigger[k]] = k;
		}
	
		for ( let k in Config.csv.header ) {
			dict_header[ Config.csv.header[k].label ] = Config.csv.header[k].data;
		}

		for ( let k in Config.csv.mode ) {
			dict_mode[ Config.csv.mode[k] ] = k;
		}
		
		reader.onload = function( event ) {
			lines = event.target.result.split(/\r\n|\r|\n/g);
			// lines 1: header => init the parser
			let header = lines[0].split(Config.csv.fieldSeparator);
			let headerPart1 = Object.keys(Config.csv.header).length;
			for(let i=1 ; i < lines.length ; i ++ ) {
				let op = {};
				let line = lines[i].split(Config.csv.fieldSeparator);
				for ( let j=0 ; j < headerPart1  ; j++ ){
					op[ dict_header[header[j]] ] = line[j] ;
				}
				// op.opMode = dict_mode[op.opMode];
				op.opId = getNewId().toString();
				opList.push(op);

				for ( let j= headerPart1 ; j<header.length; j++ ){
					let label, type, val, trigger, key;
					[ label , type ] = header[j].split(Config.csv.valueSeparator);
					[ val, trigger ] = line[j].split(Config.csv.valueSeparator);
					val = ( val === "*") ? null : val ;
					key = [label,trigger].join("#");

					if (!(key in chnList)) {
						var chn = {};
						chn.chnLabel = label;
						chn.chnType = type;
						// chn.chnTrigger = dict_trigger[trigger];
						chn.chnTrigger = trigger;
						chn.chnSetValues = Channel().create();
						chn.chnUnit = "";
						chn.chnDesc = "";
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
		};

		reader.onloadend = function ( event ) {
			if ( event.target.readyState == FileReader.DONE ) {
				$(".modal-body").append("<div class='file-selector-info contextualItems'>");
				$(".file-selector-info").append("<hr>");
				$(".file-selector-info").append("<div class='alert alert-success contextualItems'>");
				$(".alert-success").append( "<strong>Success!</strong></br>" );
				$(".alert-success").append( "file name: " + file.name + "</br>" );
				$(".alert-success").append( "file size: " + (file.size/1024).toFixed(1) + " KByte </br>" );
				$(".alert-success").append( "lines: " + lines.length + "</br>" );
			}
		};
		reader.readAsText(file);
	});
}

function wizardFrmInit() {
	$("select#regulation-mode").on("change", function() {
		var mode = $("#regulation-mode option:selected").text();
		$("#min-engine,#max-engine").attr("data-parsley-range","["+Config.csv.mode[mode].engineRange.toString()+"]");
		$("#min-dyno,#max-dyno").attr("data-parsley-range","["+Config.csv.mode[mode].dynoRange.toString()+"]");
	});

	$("#form-modal.wizard").parsley()
		.on("form:submit", function() {
			wizardAction();
			modalFormDestroy();
			return false;
		});
}

// TODO: before validation check that channelLabel#trigger is not duplicate
function chFrmInit() {
	var dt = $("#chnDataTable").DataTable();
	var rowSelected = dt.rows( ".selected" );
	var idx= rowSelected.indexes();
	var a2l = JSON.parse(localStorage.getItem("a2l"));
	var labelList = a2l.db;
	var targets = new Set ($("#opDataTable").DataTable().rows(".selected").ids().toArray());

	$("#chnLabel").flexdatalist({
		minLength: 1,
		searchIn: "name",
		maxShownResults: 10,
		visibleProperties: ["name"],
		valueProperty: "*",
		data:labelList
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
		$("#chnDesc").text(option.desc);
		if ( typeof(option.max)==="number" && typeof(option.min) === "number" ) {
			$("#chnValue").attr("data-parsley-range","["+option.min+", "+ option.max + "]");
		} else if ( typeof(option.max)==="number" ) {
			$("#chnValue").attr("data-parsley-gt",option.max);
		} else if (typeof(option.min) === "number" ) {
			$("#chnValue").attr("data-parsley-lt",option.min);
		}

		if ( option.unit ) {
			$("#chnUnit ").val(option.unit).prop("disabled",true);
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
		$("#chnUnit").val(rowSelected.data()[0].chnUnit);
		$("#chnDesc").val(rowSelected.data()[0].chnDesc);
		$("#chnTrigger").val(rowSelected.data()[0].chnTrigger);
		$("#chnValue").val(rowSelected.data()[0].chnValue);

		//edit form submit handler
		$("#form-modal.edit-ch").parsley()
			.on("form:submit", function() {
				var obj = {};
				// initialize obj with data from the form 
				obj.chnLabel = $("#chnLabel-flexdatalist").val();
				obj.chnType = $("#chnType").val();
				obj.chnUnit = $("#chnUnit").val();
				obj.chnDesc = $("#chnDesc").val();
				obj.chnTrigger = $("#chnTrigger").val();
				obj.chnValue = $("#chnValue").val();
				
				// initialize remaining field with datatable
				obj.chnSetValues = dt.row(idx).data().chnSetValues;
				obj.chnSetValues.add(obj.chnValue, targets);

				//update data table
				dt.row(idx).data(obj).draw();

				modalFormDestroy();
				$("#chnLabel").flexdatalist("destroy");
				return false;
			});

	} else if ( $("#form-modal").hasClass("new-ch") ) {
		$("#form-modal.new-ch").parsley()
			.on("form:submit", function() {
				var obj = {};


				// initialize obj with data from the form 
				obj.chnLabel = $("#chnLabel-flexdatalist").val();
				obj.chnType = $("#chnType").val();
				obj.chnUnit = $("#chnUnit").val();
				obj.chnDesc = $("#chnDesc").val();
				obj.chnTrigger = $("#chnTrigger").val();
				obj.chnValue = $("#chnValue").val();
				obj.chnSetValues = Channel().create();

				obj.chnSetValues.add( obj.chnValue, targets);

				// add the row and force a draw
				dt.row.add(obj).draw();
				modalFormDestroy();
				$("#chnLabel").flexdatalist("destroy");
				// submitting the form data will force a reload of the page,
				// we don't want it so we return false
				return false;
			});
	} else {
		alert("opFrmInit: unknown form!!!!");
	}
}

function opFrmInit() {
	var dt = $("#opDataTable").DataTable();
	var rowSelected = dt.rows( ".selected" );
	var idx= rowSelected.indexes();

	// update the dyno and engine ranges upon user's mode selection
	$("select#opMode").on("change", function() {
		var mode = $("#opMode option:selected").text();
		$("#opEngine").attr("data-parsley-range","["+Config.csv.mode[mode].engineRange.toString()+"]");
		$("#opDyno").attr("data-parsley-range","["+Config.csv.mode[mode].dynoRange.toString()+"]");
	});

	if ( $("#form-modal").hasClass("edit-op") ) { 
		// in edit mode we initialize the form the datatqble 
		// we should have only one row selected
		if ( rowSelected.count() !== 1 ) {
			alert("opFrmInit: [WARNING] several rows where selected instead of one");
			return;
		}
		$("#form-modal *").filter(".dataTableAutoImport").each( function() {
			$(this).val(rowSelected.data()[0][$(this).attr("id")]) ;
		});

		//edit form submit handler
		$("#form-modal.edit-op").parsley()
			.on("form:submit", function() {
				var obj = {};

				// initialize obj with data from the form 
				$("#form-modal *").filter(".dataTableAutoImport").each( function() {
					obj[$(this).attr("id")]= $(this).val() ;
				});
				
				// initialize remaining field with datatable
				obj.opId = dt.row(idx).id();
				obj.opActive = dt.row(idx).data().opActive;
				obj.opSelected = dt.row(idx).data().opSelected;

				//update data table
				dt.row(idx).data(obj).draw();

				modalFormDestroy();
				return false;
			});

	} else if ( $("#form-modal").hasClass("new-op") ) {
		$("#form-modal.new-op").parsley()
			.on("form:submit", function() {
				var obj = {};

				// retrieve data from the form
				$("#form-modal *").filter(".dataTableAutoImport").each( function() {
					obj[$(this).attr("id")]= $(this).val() ;
				});

				//should set it manualy , defaultContent configuartion won't do it!
				obj.opId	= getNewId();
				obj.opActive	= Config.defaultContent.opActive;
				obj.opSelected	= Config.defaultContent.opSelected; 

				// add the row and force a draw
				dt.row.add(obj).draw();
				modalFormDestroy();
				// submitting the form data will force a reload of the page,
				// we don't want it so we return false
				return false;
			});
	} else {
		alert("opFrmInit: unknown form!!!!");
	}
}

function frmInit(title) {
	switch(title) {
	case Config.frm.lblImport.label :
		lblImportInit();
		break;
	case Config.frm.csvImport.label :
		csvImportInit();
		break;
	case Config.frm.wizard.label :
		wizardFrmInit();
		break;
	
	case Config.frm.newOp.label :
	case Config.frm.editOp.label :
		opFrmInit();
		break;

	case Config.frm.newCh.label :
	case Config.frm.editCh.label :
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
		
	t1.clear();
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

function modalFormCreate(title) {
	var m = $("#modal-dialog");
	var frm;
	
	switch( title ) {
	case Config.frm.lblImport.label:
		frm = uploadFrm(Config.frm.lblImport.class);
		break;
	case Config.frm.csvImport.label:
		frm = uploadFrm(Config.frm.csvImport.class);
		break;
	case Config.frm.editOp.label :
		frm = opFrm(Config.frm.editOp.class); 
		break;
	case Config.frm.newOp.label :
		frm = opFrm(Config.frm.newOp.class); 
		break;
	case Config.frm.editCh.label :
		frm = chFrm(Config.frm.editCh.class); 
		break;
	case Config.frm.newCh.label :
		frm = chFrm(Config.frm.newCh.class); 
		break;
	case Config.frm.wizard.label :
		frm = wizardFrm(Config.frm.wizard.class); 
		break;

	default:
		alert("modalFormCreate: unknown form!");
		return;
	}

	m.find(".modal-title").text(title);
	m.find(".modal-body").append(frm);
	// As the button is in .modal-footer so outside the <form></form> we need to bind it to the form
	m.find(".btn.btn-primary").attr("form", "form-modal");

	var opt = {
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

	$("#form-modal").parsley(opt)
		.on("field:validated", function() {
			var ok = $(".parsley-error").length === 0;
			$(".bs-callout-info").toggleClass("hidden", !ok);
			$(".bs-callout-warning").toggleClass("hidden", ok);
		});

	$(".btn-default").on("click", function() {
		modalFormDestroy();	
	});

	frmInit(title);
	m.modal("show");
}

function modalFormDestroy() {
	var m = $("#modal-dialog");

	// $("#form-modal").parsley().destroy();
	m.find(".modal-title").empty();
	m.find(".modal-body").empty();
	m.find(".btn.btn-primary").removeAttr("form");
	m.modal("hide");
}
