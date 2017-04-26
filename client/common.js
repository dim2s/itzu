/* global $ Chart document Config modalFormCreate reverseMode reverseTrigger*/
/* eslint no-unused-vars:off */
/* unordered ToDo list:
	child row with additional info: unit, description, etc..
	hidden column unit, description, type, targetsRow
	onreload page confirmation before loosing data
	group row by type ( channel tab uniquement )
	limit the number of row datalist can show ( or use JQuery flexdatalist plugin )
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
			{
				title:"Trigger",
				targets:3,
				className: "chnTrigger dt-body-center dt-head-center",
				data: "chnTrigger",
				render: function( data, type, row, meta) {
					if ( type === "display" ) {
						return reverseTrigger[data] ; 
					}

					return data;
				}
			},
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
				action: function(event,dt,button,config) {
					modalFormCreate( button.text() );
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
				text: Config.frm.lblImport.label ,
				name: "chnImport-btn",
				className: Config.frm.lblImport.class,
				action:	function(event, dt, button, config) {
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
					
					return data ;
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
					// toggleDataTable_EditRemoveBtn(dt) ;
				}
			},
			{
				text: Config.frm.editOp.label,
				name: "edit",
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
				name: "exportcsv",
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
					modalFormCreate( button.text() );
				}
			}
		],
		autoFill:{
			columns: ["dyno:name","engine:name","time:name"] 
		} 
	});


//************************************* datatable common logic **********************************************
	// if there is no row, there is no need to edit, remove or export csv

	t2.buttons(["new:name","edit:name","remove:name","mergeAll:name"]).disable();

	// toolbar definition
	$("#opToolbar").html("<h4>Operating points definition</h4>");
	$("#chnToolbar").html("<h4>Channels definition</h4>");

//************************************* datatable event handlers **********************************************
	t1.on( "order.dt", function () {
		t1.column(1, { order:"applied"}).nodes().each( function (cell, i) { cell.innerHTML = i; } );
	} ).draw();

	t1.on( "draw", function (e, settings) {
		var data = selectRowToDraw(targetMode);

		// if there is at least one row, we should be able to export an CSV
		t1.buttons(["exportcsv:name"]).enable(t1.rows().count() > 0 ? true:false);

		// edit is possible only if one and only one row is selected 
		t1.buttons(["edit:name"]).enable(t1.rows(".selected").count() === 1 ? true:false);

		// remove is possible if there is some selected row 
		t1.buttons(["remove:name"]).enable(t1.rows(".selected").count() > 0 ? true:false);

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

//************************************* jQuery event handlers **********************************************
//TODO: bugfix when using global select the chart is not refresh
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

//************************************* helper function **********************************************
	// make sure that chnDataTable 'new' button is activated only if 
	// one operating point is selected
	function toggleChnDataTable_NewBtn() { 
		var selectedOp = t1.rows(".selected");
		//TODO: peut etre remplacer par une ligne de code
		//var table = $('#myTable').DataTable();
		// 
		// table.button( 'edit:name' ).enable(
		//     table.rows( { selected: true } ).indexes().length === 0 ?
		//             false :
		//                     true
		//                     );
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
			dt.cell(i,"selected:name").data( s ) ;
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

	// generate the value for the channels during the csv export ( "channelValue/Trigger") 
	function channelsCsvValue(opId) {
		var line = [];
		$("#chnDataTable").DataTable().rows().data().each( function ( data, index ) {
			line.push([data.chnSetValues.value(opId), data.chnTrigger].join(Config.csv.valueSeparator));
		});

		return line.join(Config.csv.fieldSeparator);
	}

	// generate the header for the channels during the csv export ( "channelName/type" )
	function channelsCsvHeader() {
		var header = [];
		$("#chnDataTable").DataTable().rows().data().each( function ( data, index ) {
			header.push([data.chnLabel, Config.csv.type[data.chnType]].join(Config.csv.valueSeparator));
		});
		return header.join(Config.csv.fieldSeparator);
	}
}); // function.ready({})
