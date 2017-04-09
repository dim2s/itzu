/* unordered ToDo list:
	child row with additional info: unit, description, etc..
	hidden column unit, description, type, targetsRow
	a2l,puma NN list convertion to json
	csv import/export
	form validation (required value, range, uniqness)
	onreload page confirmation before loosing data
	group row by type ( channel tab uniquement )
	limit the number of row datalist can show ( or use JQuery flexdatalist plugin )
	autocomplete unit, description and type base on label selection
	implement local storage feature
	when filling form, goes to next input on enter key pressed event
	mark select all check box when check
	frontend user input validation ( using HTML5 feature like 'required' attribute for form' and JQuery form method )
	handle submit event when save button is pressed :
	for now I'm not able to catch it using JQuery
	the usage of <input type="submit" make the page reload => data loss
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
			style: "multi", 
			selector: 'td:first-child'
		}
	});

	var t2 = $('#chnDataTable').DataTable({
		columnDefs:[
			{className: 'select-checkbox', targets: 0, width: "10px", defaultContent: ""},
			{
				title:"Label", 
				targets:1, 
				className: "chnLabel", 
				data: "chnLabel", 
				render: function (d,t,r,m) { 
					return "<a href='#' data-toggle='popover' data-placement='bottom' data-container='body' data-content='"
						+r['chnDesc'] +"'>"+ d + "</a>"  ;
				}
			},
			{
				title:"Value",
				targets:2,
				//className: "chnValue",
				data: null, //"chnValue",
				render: function( data, type, row, meta) {
					var idSet = $('#opDataTable').DataTable().rows('.selected').ids().toArray();
					var values = getChnValuesFromSelection( idSet , row ) ;
					var str = '';

					switch (values.length) {
						case 0 :
							str = "<span class='glyphicon glyphicon-asterisk'></span>";
							break;
						case 1 : 
							str = values.toString() + " " + row["chnUnit"];
							break;
						default :
							str = "<span class='glyphicon glyphicon-option-horizontal'></span>";
					}
					return str; 
				} 
			},
			{title:"Trigger", targets:3, className: "chnTrigger", data: "chnTrigger"},
			{title:"Type", targets:4, className : "chnType", data: "chnType" , name: "chnType", visible: false} ,
			{title:"Unit", targets:5, className : "chnUnit", data: "chnUnit", visible: false }, 
			{title:"Desc", targets:6, className : "chnDesc", data: "chnDesc" , visible: false} ,
			{title:"Special", targets:7, className : "chnSpecialValues", data: "chnSpecialValues" , defaultContent: "none"} ,
			{title:"Global", targets:8, className : "chnGlobalValue", data: "chnGlobalValue" , defaultContent: "*"} 

		],
		dom: '<"#chnToolbar">Brtip',
		buttons: [ // ** do not change the name attribute **
			{ 
				text:"New",
				name: "new",
				action: function(event,dt,button, config ) {
						rowEditFormCreate(button,str_chnModal,dt.table().node().id).modal('show');
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
				text:"Merge",
				name: "merge"
			},
			{ text:"Merge All", name: "chnMergeAll-btn"},
			{ text: "Import A2L", name: "chnImport-btn"} 
		]
	});

// rowReorder seems not to be compatible with select	
	var t1 = $('#opDataTable').DataTable({
		//ajax : {
		//	url :"/opImport.json",
		//	dataSrc: ''
		//},
		rowId: "opId",
		"columnDefs":[
			{ orderable: false, targets: '_all'},
			{ title: "<span id='op-select-all'></span>"     ,  targets:0 , data: null,       className: 'select-checkbox',  width: "10px", defaultContent: "" },
			{ title: "State",  targets:7 , data: null,       className: 'active-control', defaultContent: "<i></i>" },
			{ title: "Id",     targets:9 , data: "opId",     className: 'export', width: "10px", visible: false },
			{ title: "#",      targets:1  , defaultContent: ""},
			{ title: "Activ",  targets:6 , data: "opActive", className: 'exportCSV', visible: true , defaultContent: "1" },
			{ title: "Selected",  targets:8 , data: "opSelected",  visible: true , defaultContent: "0" },
			{ title: "Mode",   targets:2 , data: "opMode" ,  className: 'exportCSV'},
			{ title: "Dyno",   targets:3 , data: "opDyno" ,  className: 'exportCSV',},
			{ title: "Engine", targets:4 , data: "opEngine", className: 'exportCSV'},
			{ title: "Time",   targets:5 , data: "opTime" ,  className: 'exportCSV'},
		],
		dom: '<"#opToolbar">Brtip',
		buttons: [
			{ 
				text: 'New' ,
				name: "new",
				action:	function(event,dt,button, config ) {
						rowEditFormCreate(button,str_opModal,dt.table().node().id).modal('show');
					}
			},
			{
				text: 'Remove',
				name: 'remove',
				action: function( event, dt, btn, config ) {
						removeRows(event, dt, btn, config);
						toggleDataTable_EditRemoveBtn(dt) ;
					}
			},
			{
				text: 'Edit',
				name: 'edit',
				action: function(event,dt,button,config) {
						editRow(event,dt,button,str_opModal);
					}
			},
			{ 
				text: 'Wizard' ,
				action:	function(event, dt, button, config) {
						wizardFormCreate(button,str_wizardModal,dt.table().node().id).modal('show');
					}
			},
			{ 
				text: 'Export CSV', 
				extend: 'csvHtml5',
				fieldSeparator: ';',
				exportOptions: { columns: '.exportCSV'}
			} ,
			{ text: 'Import CSV' }
		],
		autoFill:{
			columns: [3,4,5,6] 
		} 
	});

	//************************************* datatable event handlers **********************************************
	t1.on( 'order.dt', function () {
		t1.column(1, { order:'applied'}).nodes().each( function (cell, i) { cell.innerHTML = i; } );
	} ).draw();

	t1.on( 'draw', function (e, settings) {
		var data = selectRowToDraw(targetMode); 
		chart.draw(data);
	} );

	t1.on( 'select deselect', function (e,dt,type,index) {
		selectHandler( dt, index, e.type ) 
		// we need to re-render '#chnDataTable' to update the polyvalency attribute
		t2.rows().invalidate('data').draw('false');
	} ).draw();

	t2.on( 'select deselect', function (e,dt,type,index) {
		toggleDataTable_EditRemoveBtn(dt) ;
	} );

	t2.on( 'draw', function (e, settings) {
		//var idSet = $('#opDataTable').DataTable().rows('.selected').ids().toArray();
		//var channel = $('#chnDataTable').DataTable().row(0).data();
		//var values = getChnValuesFromSelection( idSet , channel ) ;
	} );

	//************************************* jQuery event handlers **********************************************
	//Todo: bugfix when using global select the chart is not refresh
	$('#opDataTable_wrapper').on( 'click' ,'th.select-checkbox',  function () {
			var dt=$('#opDataTable').DataTable();

			// toggle select status for all rows	
			if (dt.rows('.selected').count() > 0) {
				dt.rows().deselect().draw();
			} else { 
				dt.rows().select().draw();
			}
	});

	// toggle Activ cell value on click
	$('#opDataTable tbody').on( 'click', 'td.active-control' , function () {
			var tr = $(this).closest('tr');
			var tr_idx = tr.index();
			var d = t1.row(tr_idx).data();

			if ( d["opActive"] === 0 ){
				d["opActive"] = 1;
				tr.removeClass( 'ban');
			}else{
				d["opActive"] = 0;
				tr.addClass( 'ban');
			}

			t1.row(tr_idx).data(d).draw();
	});

	/*TODO: triggered when a new label is selected
	/*TODO: triggered when a new label is selected
	  		should be use in order to autocomplete the form
	*/
	$(document).on('change', '#chnLabel', function(e) {
			console.log("chocote");
	});

	//clean dynamic element from modal DOM object
	$('#formModal').on('hidden.bs.modal', function(e) {
			$('#formModal .contextualItems').remove();
	});

	//wizard handler
	$(document).on('submit', '#form-wizard', function(e) {
			var rows = [];
			var data = [];
			var m=$('#form-wizard');

			var f = $('#form-wizard').serializeArray().reduce(function(obj,item) {
				obj[item.name] = item.value;
				return obj;
				} , {} );

			e.preventDefault();
			data = wizard.data(f);

			rows = data.compute(f.direction);
			
			t1.clear();
			t1.rows.add(rows).draw();
			t1.row(0).select();
			$('#formModal').modal('hide');
	});

	//new row, save modal handler
	/* ToDo:
		* make this function more dynamiaue by using only the attribute id without the use of a classname
		* dynamically retrieve the available datatable id ( if possible )
	*/
	$(document).on('click','#ListModify', function(e) {
		//check who triggered the click event
		var button = document.getElementById('ListModify'); 
		var table_id = '#'+button.dataset.tableid;
		var recipient = button.dataset.btntype;
		var allowedBtn = [ 'Edit', 'New'] ;

		//if it's not the chnEdit-btn or chnNew-btn just let a message in console.log but leave
		if( $.inArray(recipient, allowedBtn) === -1 )
			return;

		var dt = $(table_id).DataTable();
		var inputObj = {};

		$('#formModal *').filter('.dataTableAutoImport').each( function(i) {
			inputObj[$(this).attr('id')]= $(this).val() ;
		});
		
		inputObj.source = table_id;	
		// todo:
		//	*retrieve the value of the default content automaticaly
		//	*defferentiate inputObj op vs chn

		// in any cases during saving operation of 'chnDataTable' form
		// the saved value is applied to the selection of rows in '#opDataTable'
		var set = {};
		if (inputObj.source === '#chnDataTable') {
			set.value = inputObj.chnValue;
			set.targets = new Set ($('#opDataTable').DataTable().rows('.selected').ids().toArray());
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
			if ( inputObj.source === '#chnDataTable' ) {
				// we also supposed the unicity of the setvalues !!must be checked by the form input
				inputObj.chnTargets = [];
				inputObj.chnTargets.push(set);
			}
			dt.row.add(inputObj).draw();
		} else { 
			//we can use indexes as we're supposed to have only on row selected
			//make sure it is always the case other wise it is a bug
			var idx=dt.rows('.selected').indexes();
			if ( inputObj.source === "#opDataTable" ) {
				inputObj.opId = dt.row(idx).id();
				inputObj.opActive = dt.row(idx).data().opActive;
				inputObj.opSelected = dt.row(idx).data().opSelected;
			}
			
			// no intersection allowed between the current selection and
			// all other chnTargets
			if ( inputObj.source = '#chnDataTable' ) {
				dt.row(idx).data().chnTargets.forEach( function(obj) {
					obj.targets.purge(set.targets);
				});
				
				inputObj.chnTargets = dt.row(idx).data().chnTargets;
				inputObj.chnTargets.push(set);
			}
			dt.row(idx).data(inputObj).draw();
		}
		$('#formModal').modal('hide'); 
	});

	//************************************* datatable common logic **********************************************
	if (t1.rows().count() === 0)
		t1.buttons(['remove:name','edit:name']).disable();

	t2.buttons(['new:name','edit:name','remove:name','merge:name']).disable();

	// toolbar definition
	$('#opToolbar').html('<h4>Operating points definition</h4>');
	$('#chnToolbar').html('<h4>Channels definition</h4>');

	//************************************* helper function **********************************************
	// make sure that chnDataTable 'new' button is activated only if 
	// one operating point is selected
	function toggleChnDataTable_NewBtn() { 
		if ( t1.rows('.selected').count() > 0 ){
			t2.button('new:name').enable();
		} else {
			t2.button('new:name').disable();
		}
	}

	// rules:  
	// * you can edit only one item at the time
	// * you can remove several rows at the same time
	// * items should be selected to be edit or remove	
	function toggleDataTable_EditRemoveBtn( dt ) { 
		var count = dt.rows('.selected').count();  
		if ( count === 0 )
			dt.buttons(['remove:name','edit:name']).disable();
		if ( count === 1 )
			dt.buttons(['remove:name','edit:name']).enable();
		if (count > 1) {
			dt.button('edit:name').disable();
			dt.button('remove:name').enable();
		}
	}

	function selectRowToDraw(mode) {
		return $('#opDataTable')
			.DataTable()
			.rows( function(idx,d,node) { return (d.opMode == mode) ? true : false ;} )
			.data()
			.toArray();
	}

	function toggleNodeSelectActive(idx) {
		var isActive = ( $('circle#' + idx).attr('data-active') == "true");
		$('circle#' + idx).attr('data-active', !isActive );
	}

	function selectHandler( dt, index, action ) {
		var s = (action==="select") ? 1:0;
		toggleChnDataTable_NewBtn() ;
		toggleDataTable_EditRemoveBtn(dt) ;

		//toggle the state of the select column value
		index.forEach( function(i) { 
			dt.cell(i,8).data( s ) ;
		});

		var selectedRows = dt.rows('.selected');
		if (selectedRows.count() > 0 ) {
			targetMode = selectedRows.data()[0].opMode;
			var data = selectRowToDraw(targetMode); 
			chart.init( data, targetMode );	
			chart.draw(data);
		}
	}

	function removeRows(event, dt, btn, config) {
		dt.rows('.selected').remove().draw();
		if ( dt.rows().count() === 0)
			dt.buttons(['remove:name','edit:name']).disable();
	};

	//type = 'chn' or 'op' 
	//mais est-ce vraiment necessaire puisqu'il s'agit de la meme fenetre
	function rowEditFormCreate(b,str,dt_id) {
		var m=$('#formModal');
		m.find('.modal-footer').append(
			'<button type="button" class="btn btn-primary contextualItems" id="ListModify" data-tableid="' +dt_id+ '" data-btntype="'+b.text()+'">Save</button>'
		//	'<input type="submit" class="btn btn-primary contextualItems" id="btn-newSetvalue" value="Save" form="formNewSetValue">'
		);
		m.find('.modal-title').text(b.text());
		m.find('.modal-body').append(str);

		//initialize the datalist only for chnDataTable
		if ( dt_id === 'chnDataTable' )
			loadChnList();

		return m;
	}

	function wizardFormCreate(b,str,dt_id) {
		var m = $('#formModal');

		m.find('.contextualItems').remove();
		m.find('.modal-title').text(b.text());
		m.find('.modal-body').append(str);
		m.find('.modal-footer').append(
			'<input type="submit" class="btn btn-primary contextualItems" id="btn-wizard" value="Save" form="form-wizard">'
		);
		return m;
	}

	function editRow(e,dt,button,template) {
		var rowSelected = dt.rows( '.selected' );

		if( rowSelected.count() === 1) {
			var m= rowEditFormCreate(button,template,dt.table().node().id ); 
			console.log(rowSelected.data()[0]);	
			$('#formModal *').filter('.dataTableAutoImport').each( function(i) {
				$(this).val(rowSelected.data()[0][$(this).attr('id')]) ;
			});

			m.modal('show'); 
		} else {
			alert( 'something goes wrong! you should not be in this state....' );
		}
	}

	// return an array containing all the values for a given channels and a selection of operating
	// points	
	// Polyvalency:
	// 	* single: a unique value for the selection ( only value )
	// 	* multiple: several value for the selection ( glyphicon option-horizontal)
	// 	* empty: no value for the selection (glyphicon: asterisk)
	// 	* sticky: same value for all, even for ones not yet created (value + glyphicon: pushpin)
	function getChnValuesFromSelection( idSet , channel ) {
		return channel.chnTargets.filter ( function(obj) {
			return (obj.targets.intersection(idSet).size > 0);
		}).map ( function(obj) {
			return obj.value;
		});
	}

	
	function getValue( id, channel ) {

		var chn = channel.chnTargets.filter ( function(obj) { return obj.targets.has(id); });

		if ( chn.length === 1 ) { 
			return chn[0].value;
		}
	}

}); // function.ready({})
