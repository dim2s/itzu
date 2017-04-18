/* global $ Chart document Config str_opModal str_chnModal Channel wizard*/
/* unordered ToDo list:
	child row with additional info: unit, description, etc..
	hidden column unit, description, type, targetsRow
	a2l,puma NN list convertion to json
	csv import
	form validation (required value, range, uniqness)
	onreload page confirmation before loosing data
	group row by type ( channel tab uniquement )
	limit the number of row datalist can show ( or use JQuery flexdatalist plugin )
	autocomplete unit, description and type base on label selection
	implement local storage feature
	when filling form, goes to next input on enter key pressed event
	frontend user input validation ( using HTML5 feature like 'required' attribute for form' and JQuery form method )
	handle submit event when save button is pressed :
	for now I'm not able to catch it using JQuery
	the usage of <input type="submit" make the page reload => data loss
	templating on client side (mustach,js?)
*/
$(document).ready(function() {

	var chart = new Chart;
	var targetMode="N/CBRT_5_H";
	chart.init();

	//common Datatables properties
	$.extend( true, $.fn.dataTable.defaults, {
		"searching": true,
		"paging": false,
		"info": false,
		"scrollY": "600px",
		"scrollCollapse": true,
		"select" : { 
			style: "os", 
			selector: "td:first-child"
		}
	});

	var t2 = $("#chnDataTable").DataTable({
		columnDefs:[
			{className: "select-checkbox", targets: 0, width: "10px", defaultContent: ""},
			{
				title:"Label", 
				targets:1, 
				className: "chnLabel", 
				data: "chnLabel", 
				render: function (data ,type ,row ,meta ) { 
					return "<a href='#' data-toggle='popover' data-placement='bottom' data-container='body' data-content='"
						+row["chnDesc"] +"'>"+ data + "</a>"  ;
				}
			},
			{
				title:"Value",
				targets:2,
				className: "chnValue",
				data: null, //"chnValue",
				render: function( data, type, row, meta) {
					var idSet = $("#opDataTable").DataTable().rows(".selected").ids().toArray();
					var status = row.chnSetValues.status( idSet ) ;
					var str = "";

					switch (status) {
					case "sticky" :
						str=row.chnSetValues.default + " " + row["chnUnit"] + "<span class='glyphicon glyphicon-pushpin'></span>";
						break;
					case "multi" :
						str = "<span class='glyphicon glyphicon-option-horizontal'></span>";
						break;
					case "empty" :
						str = "<span class='glyphicon glyphicon-asterisk'></span>";
						break;
					case "single" : 
						str = row.chnSetValues.filter(idSet)[0].value + " " + row["chnUnit"];
						break;
					}
					return str; 
				} 
			},
			{title:"Trigger", targets:3, className: "chnTrigger", data: "chnTrigger"},
			{title:"Type", targets:4, className : "chnType", data: "chnType" , name: "chnType", visible: false} ,
			{title:"Unit", targets:5, className : "chnUnit", data: "chnUnit", visible: false }, 
			{title:"Desc", targets:6, className : "chnDesc", data: "chnDesc" , visible: false}

		],
		dom: "<'#chnToolbar'>Brtip",
		buttons: [ // ** do not change the name attribute **
			{ 
				text:"New",
				name: "new",
				action: function(event,dt,button, config ) {
					rowEditFormCreate(button,str_chnModal,dt.table().node().id).modal("show");
				}
			},
			{ 
				text:"Remove",
				name: "remove",
				action:	function( event, dt, btn, config ) {
					removeRows(event, dt, btn, config);
				}
			},
			{ 
				text:"Edit",
				name: "edit",
				state:false,
				action: function(event,dt,button,config) {
					editRow(event,dt,button,str_chnModal);
				}
			},
			{ 
				text:"Merge All",
				name: "mergeAll",
				action: function( event, dt, button, config) {
					var rows = dt.rows(".selected");

					rows.every( function (rowIdx, tableLoop, rowLoop ) {
						dt.row( rowIdx ).data().chnSetValues.mergeAll(dt.row( rowIdx ).data().chnValue);
					});
					dt.rows().invalidate("data").draw("false");
				}
			},
			{ 
				text: "Import A2L",
				name: "chnImport-btn",
				action: function(event, dt, button, config) {
					alert("Import A2l: fonction pas encore implémentée");
				}
			} 
		]
	});

// rowReorder seems not to be compatible with select	
	var t1 = $("#opDataTable").DataTable({
		//ajax : {
		//	url :"/opImport.json",
		//	dataSrc: ''
		//},
		rowId: "opId",
		"columnDefs":[
			{ orderable: false, targets: "_all"},
			{ title: "<span id='op-select-all'></span>"     ,  targets:0 , data: null,       className: "select-checkbox",  width: "10px", defaultContent: "" },
			{ name: "index",	title: "#",		targets:1 , defaultContent: ""},
			{ 
				name: "mode",
				title: "Mode",
				targets:2,
				data: "opMode" ,
				render: function ( data, type, row) {
					return type === "export" ?  Config.csv.mode[data] : data;
				}
			},
			{ name: "dyno",		title: "Dyno",		targets:3 , data: "opDyno" ,	},
			{ name: "engine",	title: "Engine",	targets:4 , data: "opEngine",	},
			{ name: "time",		title: "Time",		targets:5 , data: "opTime" ,	},
			{ name: "active",	title: "Activ",		targets:6 , data: "opActive",	 visible: false , defaultContent: "1" },
			{ name: "state", 	title: "State",		targets:7 , data: null,		className: "active-control", defaultContent: "<i></i>" },
			{ name: "selected",	title: "Selected",	targets:8 , data: "opSelected",	visible: false , defaultContent: "0" },
			{ name: "id",		title: "Id",		targets:9 , data: "opId",	visible: false , width: "10px",  },
			{ 
				name: "channels",
				title: "Channels",
				targets:10,
				data: null,
				visible: false,
				render: function ( data, type, row) {
					return type === "export" ?  channelsCsvValue(row.opId.toString()) : data;
				}
			},
		],
		dom: "<'#opToolbar'>Brtip",
		buttons: [
			{ 
				text: "New" ,
				name: "new",
				action:	function(event,dt,button, config ) {
					rowEditFormCreate(button,str_opModal,dt.table().node().id).modal("show");
				}
			},
			{
				text: "Remove",
				name: "remove",
				action: function( event, dt, btn, config ) {
					removeRows(event, dt, btn, config);
					toggleDataTable_EditRemoveBtn(dt) ;
				}
			},
			{
				text: "Edit",
				name: "edit",
				action: function(event,dt,button,config) {
					editRow(event,dt,button,str_opModal);
				}
			},
			{ 
				text: "Wizard" ,
				action:	function(event, dt, button, config) {
					wizardFormCreate(button,str_wizardModal,dt.table().node().id).modal("show");
				}
			},
			{ 
				text: "Export CSV", 
				extend: "csvHtml5",
				fieldSeparator: Config.csv.fieldSeparator,
				exportOptions: { 
					columns: ["activ:name","mode:name","engine:name","dyno:name","time:name","channels:name"],
					orthogonal: "export",
					format: {
						header : function ( data, columnIdx ) {
							if ( data === "Channels" ) {
								return channelsCsvHeader();
							} else {
								return Config.csv.header[data]; 
							}
						}
					}
				},
				customize: function (csv) {
					return csv.replace(/\"/g, "");
				}
			} ,
			{ 
				text: "Import CSV",
				action:	function(event, dt, button, config) {
					importCsvFormCreate(button,str_importCsvModal).modal("show");
				}
			}
		],
		autoFill:{
			columns: ["dyno:name","engine:name","time:name","active:name"] 
		} 
	});

	function channelsCsvValue(opId) {
		var line = [];
		$("#chnDataTable").DataTable().rows().data().each( function ( data, index ) {
			line.push([data.chnSetValues.value(opId),Config.csv.trigger[data.chnTrigger]].join(Config.csv.valueSeparator));
		});

		return line.join(Config.csv.fieldSeparator);
	}

	function channelsCsvHeader() {
		var header = [];
		$("#chnDataTable").DataTable().rows().data().each( function ( data, index ) {
			header.push([data.chnLabel, Config.csv.type[data.chnType]].join(Config.csv.valueSeparator));
		});
		return header.join(Config.csv.fieldSeparator);
	}

	//************************************* datatable event handlers **********************************************
	t1.on( "order.dt", function () {
		t1.column(1, { order:"applied"}).nodes().each( function (cell, i) { cell.innerHTML = i; } );
	} ).draw();

	t1.on( "draw", function (e, settings) {
		var data = selectRowToDraw(targetMode); 
		chart.draw(data);
	} );

	t1.on( "select deselect", function (e,dt,type,index) {
		selectHandler( dt, index, e.type );
		// we need to re-render '#chnDataTable' to update the polyvalency attribute
		t2.rows().invalidate("data").draw("false");
	} ).draw();

	t2.on( "select deselect", function (e,dt,type,index) {
		toggleDataTable_EditRemoveBtn(dt) ;
		toggleChnDataTable_NewBtn() ;
	} );

	t2.on( "draw", function (e, settings) {
		//var idSet = $('#opDataTable').DataTable().rows('.selected').ids().toArray();
		//var channel = $('#chnDataTable').DataTable().row(0).data();
		//var values = getChnValuesFromSelection( idSet , channel ) ;
	} );

	//************************************* jQuery event handlers **********************************************
	//Todo: bugfix when using global select the chart is not refresh
	

	$("#opDataTable_wrapper").on( "click" ,"th.select-checkbox",  function () {
		var dt=$("#opDataTable").DataTable();

		// toggle select status for all rows	
		if (dt.rows(".selected").count() > 0) {
			dt.rows().deselect().draw();
		} else { 
			dt.rows().select().draw();
		}
	});

	// toggle Activ cell value on click
	$("#opDataTable tbody").on( "click", "td.active-control" , function () {
		var tr = $(this).closest("tr");
		var tr_idx = tr.index();
		var d = t1.row(tr_idx).data();

		if ( d["opActive"] === 0 ){
			d["opActive"] = 1;
			tr.removeClass( "ban");
		}else{
			d["opActive"] = 0;
			tr.addClass( "ban");
		}

		t1.row(tr_idx).data(d).draw();
	});

	/*TODO: triggered when a new label is selected
	/*TODO: triggered when a new label is selected
	  		should be use in order to autocomplete the form
	*/
	$(document).on("change", "#chnLabel", function(e) {
		console.log("chocote");
	});

	//clean dynamic element from modal DOM object
	$("#formModal").on("hidden.bs.modal", function(e) {
		$("#formModal .contextualItems").remove();
	});

	//wizard handler
	$(document).on("submit", "#form-wizard", function(e) {
		var rows = [];
		var data = [];

		var f = $("#form-wizard").serializeArray().reduce(function(obj,item) {
			obj[item.name] = item.value;
			return obj;
		} , {} );

		e.preventDefault();
		data = wizard.data(f);

		rows = data.compute(f.direction);
			
		t1.clear();
		t1.rows.add(rows).draw();
		t1.row(0).select();
		$("#formModal").modal("hide");
	});

	//new row, save modal handler
	/* ToDo:
		* make this function more dynamiaue by using only the attribute id without the use of a classname
		* dynamically retrieve the available datatable id ( if possible )
	*/
	$(document).on("click","#ListModify", function(e) {
		//check who triggered the click event
		var button = document.getElementById("ListModify"); 
		var table_id = "#"+button.dataset.tableid;
		var recipient = button.dataset.btntype;
		var allowedBtn = [ "Edit", "New"] ;

		//if it's not the chnEdit-btn or chnNew-btn just let a message in console.log but leave
		if( $.inArray(recipient, allowedBtn) === -1 )
			return;

		var dt = $(table_id).DataTable();
		var inputObj = {};

		$("#formModal *").filter(".dataTableAutoImport").each( function() {
			inputObj[$(this).attr("id")]= $(this).val() ;
		});
		
		inputObj.source = table_id;	
		// todo:
		//	*retrieve the value of the default content automaticaly
		//	*defferentiate inputObj op vs chn

		// in any cases during saving operation of 'chnDataTable' form
		// the saved value is applied to the selection of rows in '#opDataTable'
		var set = {};
		if (inputObj.source === "#chnDataTable") {
			set.value = inputObj.chnValue;
			set.targets = new Set ($("#opDataTable").DataTable().rows(".selected").ids().toArray());
		}

		//some times we will add a new row, in other case we will edit the existing row	
		if( recipient === allowedBtn[1] ) {
			if ( inputObj.source === "#opDataTable" ) { 
			// unfortunately defaultContent is not set by datatable in this case so
			// we should set it manualy 
				inputObj.opId = getNewId();
				inputObj.opActive =  1 ;
				inputObj.opSelected = 0 ;
			}
			if ( inputObj.source === "#chnDataTable" ) {
				// we also supposed the unicity of the setvalues !!must be checked by the form input
				inputObj.chnSetValues = Channel().create();
				inputObj.chnSetValues.add(set.value, set.targets);
			}
			dt.row.add(inputObj).draw();
		} else { 
			//we can use indexes as we're supposed to have only one row selected
			//make sure it is always the case other wise it is a bug
			var idx=dt.rows(".selected").indexes();
			if ( inputObj.source === "#opDataTable" ) {
				inputObj.opId = dt.row(idx).id();
				inputObj.opActive = dt.row(idx).data().opActive;
				inputObj.opSelected = dt.row(idx).data().opSelected;
			}
			
			// no intersection allowed between the current selection and
			// all other chnTargets
			if ( inputObj.source === "#chnDataTable" ) {
				inputObj.chnSetValues = dt.row(idx).data().chnSetValues;
				inputObj.chnSetValues.add(set.value, set.targets);
			}
			dt.row(idx).data(inputObj).draw();
		}
		$("#formModal").modal("hide"); 
	});

	// handler for csv file import
	$(document).on("change","#csv-file-selector", function(e) {
		var file = this.files[0];
		var reader = new FileReader();
		var lines = [];

		reader.onload = function( event ) {
			lines = event.target.result.split(/\r\n|\r|\n/g);
		};

		reader.onloadend = function ( event ) {
			if ( event.target.readyState == FileReader.DONE ) {
				$("#formModal").find(".modal-body").append("<hr><div class='file-selector-info contextualItem'>");
				$(".file-selector-info").append("<div class='alert alert-success contextualItem'>");
				$(".alert-success").append( "<strong>Success!</strong></br>" );
				$(".alert-success").append( "file name: " + file.name + "</br>" );
				$(".alert-success").append( "file size: " + (file.size/1024).toFixed(1) + " KByte </br>" );
				$(".alert-success").append( "lines: " + lines.length + "</br>" );
			}
		};

		reader.readAsText(file);
		// $("#formModal").modal("hide"); 
	});
	//************************************* datatable common logic **********************************************
	if (t1.rows().count() === 0)
		t1.buttons(["remove:name","edit:name"]).disable();

	t2.buttons(["new:name","edit:name","remove:name","mergeAll:name"]).disable();

	// toolbar definition
	$("#opToolbar").html("<h4>Operating points definition</h4>");
	$("#chnToolbar").html("<h4>Channels definition</h4>");

	//************************************* helper function **********************************************
	// make sure that chnDataTable 'new' button is activated only if 
	// one operating point is selected
	function toggleChnDataTable_NewBtn() { 
		var selectedOp = t1.rows(".selected");
		if ( selectedOp.count() > 0 ){
			t2.button("new:name").enable();
		} else {
			t2.button("new:name").disable();
		}
		
		var selectedChn = t2.rows(".selected");
		var ids = selectedOp.ids().toArray();
		t2.button("mergeAll:name").disable();
		if( selectedChn.count() > 0 ) {
			//todo:regarder si on ne peut pas utiliser l'api de datatable
			//au lieu de convertir en tableau
			if( selectedChn.data().toArray().every( function(v) {
				return v.chnSetValues.status(ids) !== "multi"; }
			)) {
				t2.button("mergeAll:name").enable();
			}
		} 
		
	}

	// rules:  
	// * you can edit only one item at the time
	// * you can remove several rows at the same time
	// * items should be selected to be edit or remove	
	function toggleDataTable_EditRemoveBtn( dt ) { 
		var count = dt.rows(".selected").count();  
		if ( count === 0 )
			dt.buttons(["remove:name","edit:name"]).disable();
		if ( count === 1 )
			dt.buttons(["remove:name","edit:name"]).enable();
		if (count > 1) {
			dt.button("edit:name").disable();
			dt.button("remove:name").enable();
		}
	}

	function selectRowToDraw(mode) {
		return $("#opDataTable")
			.DataTable()
			.rows( function(idx,d,node) { return (d.opMode == mode) ? true : false ;} )
			.data()
			.toArray();
	}

	function selectHandler( dt, index, action ) {
		var s = (action==="select") ? 1:0;
		toggleChnDataTable_NewBtn() ;
		toggleDataTable_EditRemoveBtn(dt) ;

		//toggle the state of the select column value
		index.forEach( function(i) { 
			dt.cell(i,8).data( s ) ;
		});

		var selectedRows = dt.rows(".selected");
		if (selectedRows.count() > 0 ) {
			targetMode = selectedRows.data()[0].opMode;
			var data = selectRowToDraw(targetMode); 
			chart.init( data, targetMode );	
			chart.draw(data);
		}
	}

	function removeRows(event, dt, btn, config) {
		dt.rows(".selected").remove().draw();
		if ( dt.rows().count() === 0)
			dt.buttons(["remove:name","edit:name"]).disable();
	}

	//type = 'chn' or 'op' 
	//mais est-ce vraiment necessaire puisqu'il s'agit de la meme fenetre
	function rowEditFormCreate(b,str,dt_id) {
		var m=$("#formModal");
		m.find(".modal-footer").append(
			'<button type="button" class="btn btn-primary contextualItems" id="ListModify" data-tableid="' +dt_id+ '" data-btntype="'+b.text()+'">Save</button>'
		//	'<input type="submit" class="btn btn-primary contextualItems" id="btn-newSetvalue" value="Save" form="formNewSetValue">'
		);
		m.find(".modal-title").text(b.text());
		m.find(".modal-body").append(str);

		//initialize the datalist only for chnDataTable
		if ( dt_id === "chnDataTable" )
			loadChnList();

		return m;
	}

	function wizardFormCreate(b,str,dt_id) {
		var m = $("#formModal");

		m.find(".contextualItems").remove();
		m.find(".modal-title").text(b.text());
		m.find(".modal-body").append(str);
		m.find(".modal-footer").append(
			"<input type='submit' class='btn btn-primary contextualItems' id='btn-wizard' value='Save' form='form-wizard'>"
		);
		return m;
	}

	function importCsvFormCreate(b,str) {
		var m = $("#formModal");

		m.find(".contextualItems").remove();
		m.find(".modal-title").text(b.text());
		m.find(".modal-body").append(str);
		m.find(".modal-footer").append(
			"<input type='submit' class='btn btn-primary contextualItems' id='btn-importCsv' value='Save' form='form-wizard'>"
		);
		return m;
	}

	function editRow(e,dt,button,template) {
		var rowSelected = dt.rows( ".selected" );

		if( rowSelected.count() === 1) {
			var m= rowEditFormCreate(button,template,dt.table().node().id ); 
			$("#formModal *").filter(".dataTableAutoImport").each( function() {
				$(this).val(rowSelected.data()[0][$(this).attr("id")]) ;
			});

			m.modal("show"); 
		} else {
			alert( "something goes wrong! you should not be in this state...." );
		}
	}
}); // function.ready({})
