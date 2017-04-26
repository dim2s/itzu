/* global $ Chart document Config str_opModal str_chnModal Channel wizard*/
/* unordered ToDo list:
	child row with additional info: unit, description, etc..
	hidden column unit, description, type, targetsRow
	a2l,puma NN list convertion to json
	onreload page confirmation before loosing data
	group row by type ( channel tab uniquement )
	limit the number of row datalist can show ( or use JQuery flexdatalist plugin )
	autocomplete unit, description and type base on label selection
	autodetect the type of file(*.a2l, *.csv) and tel the user for invalid file type
	write on the UI, the a2l et qty.csv in use ( datatable information ? )
*/
$(document).ready(function() {

	var chart = new Chart;
	var targetMode="N/CBRT_5_H";
	chart.init();

	//common Datatables properties
	$.extend( true, $.fn.dataTable.defaults, {
		"searching": true,
		"paging": false,
		"info": true,
		"scrollY": "600px",
		"scrollCollapse": true,
		"select" : { 
			style: "os", 
			selector: "td:first-child"
		},
	});

	var t2 = $("#chnDataTable").DataTable({
		columnDefs:[
			{className: "select-checkbox", targets: 0, width: "10px", defaultContent: ""},
			{
				title:"Label", 
				targets:1, 
				className: "chnLabel dt-body-center dt-head-center", 
				data: "chnLabel", 
				render: function (data ,type ,row ,meta ) { 
					return "<a href='#' data-toggle='popover' data-placement='bottom' data-container='body' data-content='"
						+row["chnDesc"] +"'>"+ data + "</a>"  ;
				}
			},
			{
				title:"Value",
				targets:2,
				className: "chnValue dt-body-center dt-head-center",
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
			{title:"Trigger", targets:3, className: "chnTrigger dt-body-center dt-head-center", data: "chnTrigger"},
			{title:"Type", targets:4, className : "chnType", data: "chnType" , name: "chnType", visible: false} ,
			{title:"Unit", targets:5, className : "chnUnit", data: "chnUnit", visible: false }, 
			{title:"Desc", targets:6, className : "chnDesc", data: "chnDesc" , visible: false}

		],
		dom: "<'#chnToolbar'>Britp",
		buttons: [ // ** do not change the name attribute **
			{ 
				text: Config.frm.newCh.label ,
				name: "new" ,
				className: Config.frm.newCh.class, 
				action:	function(event, dt, button, config) {
					// rowEditFormCreate(button,str_chnModal,dt.table().node().id).modal("show");
					modalFormCreate( button.text() );
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
				text: Config.frm.editCh.label ,
				name: 	"edit",
				className: Config.frm.editCh.class,
				state:false,
				action: function(event,dt,button,config) {
					modalFormCreate( button.text() );
					// editRow(event,dt,button,str_chnModal);
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
				text: Config.frm.a2lImport.label ,
				name: "chnImport-btn",
				className: Config.frm.a2lImport.class,
				action:	function(event, dt, button, config) {
					// fileUploadFormCreate(button,str_fileUploadModal).modal("show");
					modalFormCreate( button.text() );
				}
			} 
		]
	});

// rowReorder seems not to be compatible with select	
	var t1 = $("#opDataTable").DataTable({
		rowId: "opId",
		"columnDefs":[
			{ orderable: false, targets: "_all"},
			{ title: "<span id='op-select-all'></span>"     ,  targets:0 , data: null,       className: "select-checkbox",  width: "10px", defaultContent: "" },
			{ name: "index",	title: "#",		targets:1 , defaultContent: "", className: "dt-body-center dt-head-center" },
			{ 
				name: "mode",
				title: "Mode",
				targets:2,
				data: "opMode" ,
				className: "dt-body-center dt-head-center",
				render: function ( data, type, row) {
					
					if (type === "display") {
						return reverseMode[data];
					}
					
					return data 
					// return type === "export" ?  Config.csv.mode[data] : data;
				}
			},
			{ name: "dyno",		title: "Dyno",		targets:3 , data: "opDyno" , className: "dt-body-center dt-head-center" },
			{ name: "engine",	title: "Engine",	targets:4 , data: "opEngine", className: "dt-body-center dt-head-center" },
			{ name: "time",		title: "Time",		targets:5 , data: "opTime" , className: "dt-body-center dt-head-center" },
			{ 
				name: "active",
				title: "Activ",
				targets:6 ,
				data: "opActive",
				visible: true ,
				defaultContent: Config.defaultContent.opActive,
				className: "dt-body-center dt-head-center active-control",
				render: function ( data, type, row) {
					if ( type === "display") {
						//Todo: apres un import csv la valeur est une string ensuite la valeur est un number.
						//A regarder de pret pour avoir de la constistence. en attendant "==="=> "=="
					if ( data == "1" ) { 
							return "<span class='glyphicon glyphicon-ok-circle'></span>";
						} else if ( data == "0" ) {
							return "<span class='glyphicon glyphicon-ban-circle'></span>";
						}
					}
					return data;
				}
			},
			{
				name: "selected",
				title: "Selected",
				targets:7,
				data: "opSelected",
				visible: false ,
				defaultContent: Config.defaultContent.opSelected 
			},
			{
				name: "id",
				title: "Id",
				targets:8 ,
				data: "opId",
				visible: false ,
				width: "10px"
			},
			{ 
				name: "channels",
				title: "Channels",
				targets:9,
				data: null,
				visible: false,
				render: function ( data, type, row) {
					return type === "export" ?  channelsCsvValue(row.opId.toString()) : data;
				}
			},
		],
		dom: "<'#opToolbar'>Britp",
		buttons: [
			{ 
				text: Config.frm.newOp.label ,
				name: Config.frm.newOp.class,
				className: "new", 
				action:	function(event,dt,button, config ) {
					modalFormCreate( button.text() );
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
				text: Config.frm.editOp.label,
				name: Config.frm.editOp.class,
				className: "edit",
				action: function(event,dt,button,config) {
					modalFormCreate( button.text() );
				}
			},
			{ 
				text: Config.frm.wizard.label ,
				name: Config.frm.wizard.class,
				className : Config.frm.wizard.class,
				action:	function(event, dt, button, config) {
					modalFormCreate( button.text() );
				}
			},
			{ 
				text: "Export CSV", 
				extend: "csvHtml5",
				fieldSeparator: Config.csv.fieldSeparator,
				exportOptions: { 
					columns: ["active:name","mode:name","engine:name","dyno:name","time:name","channels:name"],
					orthogonal: "export",
					format: {
						header : function ( data, columnIdx ) {
							if ( data === "Channels" ) {
								return channelsCsvHeader();
							} else {
								return Config.csv.header[data].label; 
							}
						}
					}
				},
				customize: function (csv) {
					return csv.replace(/\"/g, "");
				}
			} ,
			{ 
				text: Config.frm.csvImport.label,
				name: Config.frm.csvImport.class,
				className: Config.frm.csvImport.class,
				action:	function(event, dt, button, config) {
					// fileUploadFormCreate(button,str_fileUploadModal).modal("show");
					modalFormCreate( button.text() );
				}
			}
		],
		autoFill:{
			columns: ["dyno:name","engine:name","time:name"] 
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
		}else{
			d["opActive"] = 0;
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

	//new row, save modal handler
	/* ToDo:
		* make this function more dynamique by using only the attribute id without the use of a classname
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

	// hander for a2l file import
	$(document).on("change", "#file-selector.a2l-import", function(e) {
		// var file = this.files[0];
		// var reader = new FileReader();
		// var channelList = [];
                //
		// function parseA2l( content ) {
		// 	var re = /\/begin CHARACTERISTIC([\s\S]*?)\/end CHARACTERISTIC/g;
		// 	var characteristic;
		// 	var channel = [];
		// 	while ((  characteristic = re.exec(content)) !== null) {
		// 		//console.log("regex match, prochaine correspondance à partir de " + re.lastIndex);
		// 		parseCharacteristics( characteristic[1] );
		// 	}
                //
		// 	function parseCharacteristics( buffer ) {
		// 		var re = /[^\s\n\t]+["\w .%-/]+/g;
		// 		var token = buffer.match(re);
		// 		var obj ={};
                //
		// 		obj.name = token[0];
		// 		obj.type = token[2];
		// 		obj.desc = token[1];
		// 		obj.min  = parseFloat(token[7]);
		// 		obj.max  = parseFloat(token[8]);
                //
		// 		channel.push(obj);
		// 	}
                //
		// 	return channel;
		// }
		// reader.onload = function( event ) {
		// 	channelList = parseA2l(event.target.result);
		// };
                //
		// reader.onloadend = function ( event ) {
		// 	if ( event.target.readyState == FileReader.DONE ) {
		// 		$("#formModal").find(".modal-body").append("<div class='file-selector-info contextualItems'>");
		// 		$(".file-selector-info").append("<hr>");
		// 		$(".file-selector-info").append("<div class='alert alert-success contextualItems'>");
		// 		$(".alert-success").append( "<strong>Success!</strong></br>" );
		// 		$(".alert-success").append( "file name: " + file.name + "</br>" );
		// 		$(".alert-success").append( "file size: " + (file.size/1024).toFixed(1) + " KByte </br>" );
		// 		$(".alert-success").append( "Channels: " + channelList.length + "</br>" );
		// 	}
		// };
		//
                //
		// reader.readAsText(file);
                //
		// $(document).on("click","#btn-a2l-import", function(e) {
		// 	var a2l ={};
		// 	a2l.list = channelList;
		// 	a2l.file = file.name;
		// 	
		// 	if (typeof(Storage) !== "undefined") {
		// 		localStorage.setItem("a2l", JSON.stringify(a2l));
		// 	} else {
		// 		alert("Sorry! No Web Storage support.. your informations will be lost when you close the browser");
		// 	}
                //
		// 	$("#formModal").modal("hide"); 
		// });
	});

	// handler for csv file import
	//************************************* datatable common logic **********************************************
	if (t1.rows().count() === 0)
		t1.buttons(["remove:name", Config.frm.editOp.class + ":name"]).disable();

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
			dt.cell(i,'selected:name').data( s ) ;
		});

		var selectedRows = dt.rows(".selected");
		if (selectedRows.count() > 0 ) {
			targetMode = selectedRows.data()[0].opMode;
			var data = selectRowToDraw(targetMode); 
			chart.init( data, reverseMode[targetMode] );	
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

	function fileUploadFormCreate(b,str) {
		var m = $("#formModal");
		var types = ["csv-import", "a2l-import"];
		var btnType ="";

		types.some( function(e) { if (b.hasClass(e) ) { btnType = e; } } );

		if (!btnType) {
			str = "not yet implemented";
		}

		m.find(".contextualItems").remove();
		m.find(".modal-title").text(b.text());
		m.find(".modal-body").append(str);
		m.find(".modal-footer").append(
			"<input type='submit' class='btn btn-primary contextualItems' id='btn-" + btnType + "' value='Save' form='form-"+btnType +"'>"
		);
		m.find("#file-selector").addClass(btnType);
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
