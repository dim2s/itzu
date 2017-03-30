// require JQuery.js

var Chart = function () {
	const chartType = {
		'torque-X':  { 
			dynoDomain : [ 0, 300],
		   	engineDomain : [ 0, 1000],
		   	xLabel:"Torque (N/m)",
		   	yLabel:"X"
		},
		'torque-accel':  { 
			dynoDomain : [ 0, 300],
		   	engineDomain : [ 0, 120],
		   	xLabel:"Torque (N/m)",
		   	yLabel:"Accel (%)"
		},
		'speed-torque':  { 
			dynoDomain : [ 0, 3500],
		   	engineDomain : [ 0, 300],
		   	xLabel:"Speed (rpm)",
		   	yLabel:"Torque (N/m)"
		},
		'speed-accel': { 
			dynoDomain : [ 0, 3500],
		   	engineDomain : [0, 120],
		   	xLabel:"Speed (rpm)",
		   	yLabel:"Accel (%)"
		},
		'speed-X': { 
			dynoDomain : [ 0, 3500],
		   	engineDomain : [0, 1000],
		   	xLabel:"Speed (rpm)",
		   	yLabel:"X"
		}
	};
					 
	var _type;			//type of chart: N-SPEED, N-TORQUE, N-ACCEL, N-X
	var _margin =    { top:20, bottom:60, left:60, right: 20};
	var _outerSize = { height: 600, width: 1200}; 
	var _innerSize = { 
		height: _outerSize.height - _margin.top - _margin.bottom,
		width:  _outerSize.width  - _margin.right - _margin.left };
	var _domain = { dyno:null, engine:null};
	var _xScale = d3.scaleLinear();
	var _yScale = d3.scaleLinear();
	var _xAxis = d3.axisBottom(_xScale);
	var _yAxis = d3.axisLeft(_yScale);
	var _radius = 6;

	//methods and properties publicly available
	//
	//method that migth be necessary to implement
	//removeNode
	//addNode
	//editNode
	//drawArcs
	//removeArc
	//addArc
	//editArc
	return {
		type: myType,
		init: myInit,
		draw: myDraw
		}	

	function myDraw(opList) {
		myDrawNodes(opList);
		myDrawArcs(opList);
	}


	function myDrawArcs(opList){
		var	lineFunction = d3.line()
			.x( function(d) { return _xScale(d.opDyno); } )
			.y( function(d) { return _yScale(d.opEngine); } )
			.curve( d3.curveLinear );
		
		d3.select(".arcs")
			.selectAll("path")
			.datum(opList)
			.attr("d", function(d) { return lineFunction(d); })
			;
	}

	// drawNodes:
	//  draw all nodes corresponding to (engine,dyno) datas
	function myDrawNodes(opList) {
		
		var nodes = d3.select(".nodes")
						.selectAll("circle")
						.data(opList, function(d) { return d.opId; });

		nodes.exit().remove();

		nodes
			.enter()
			.append("circle")
			.on("click", handleMouseClick)
			.attr("r", _radius)
			//.attr("data-selected", 'false' )

			.merge(nodes)
			.attr("id", function(d,i) { return  d.opId; } )
			.attr("data-active", function(d) { return parseInt(d.opActive) === 1 ? 'true' : 'false' } )
			.attr("data-selected", function(d) { return parseInt(d.opSelected) === 1 ? 'true' : 'false' } )
			.attr("data-mode", function(d) { return d.opMode } )
			.attr("cx", function(d) { return _xScale(parseFloat(d.opDyno)); } )
			.attr("cy", function(d) { return _yScale(parseFloat(d.opEngine)); } )
			;
	}

	// add a dependencies to datatable and other modules
	// but I have no other workaround
	function handleMouseClick(d,i) {
		var circle_selected = d3.select(this).attr("data-selected");

		if ( circle_selected === 'true') {
			$('#opDataTable').DataTable().row( function ( idx, data, node) { return data.opId === d.opId ? true : false ; } ).deselect()

		} else {
			$('#opDataTable').DataTable().row( function ( idx, data, node) { return data.opId === d.opId ? true : false ; } ).select()
		}
	}

	// myInit:
	// prepare everything in order to be able to draw the chart
	function myInit(opList=[],t="N/C_BRT_5H") {

		var chartWrapper = null;

		//set the type of graphique & extract required data
		this.type(t);	

		//Update the x-scale
		//the bigger domain between the default one and the inputs data
		_xScale
			.domain(d3.extent(
						opList.map( function(d) { return parseFloat(d.opDyno);})
						.concat(chartType[_type].dynoDomain)))
			.range([0, _innerSize.width]);
		
		//Update the y-scale
		_yScale
			.domain(d3.extent(
						opList.map( function(d) { return parseFloat(d.opEngine);})
						.concat(chartType[_type].engineDomain)))
			.range([_innerSize.height, 0]);

		//select the svg element, if it exists
		var svg = d3.select("#svg-container").selectAll("svg").data([opList]);
		var svgEnter= svg.enter().append("svg");

		//otherwise, create the skeletal chart
		chartWrapper = svgEnter
						.append('g')
						.attr("class","chart-wrapper");

		chartWrapper.append("g").attr("class", "x axis");
		chartWrapper.append("g").attr("class", "y axis");
		chartWrapper.append("g").attr("class", "nodes");
		var arcs = chartWrapper.append("g").attr("class", "arcs");
		var path = arcs 
			.append("path")
			.datum(opList)
			.attr("class", "line"); 

		//update the outer dimensions
		svgEnter
			.attr("viewBox", "0 0 " + _outerSize.width + " " + _outerSize.height )
			.classed("svg-content-responsive",true)
			.attr("preserveAspectRatio", "xMidYMid meet");

		//update the inner dimensions
		chartWrapper.attr("transform", "translate(" + _margin.left + ", " + _margin.top + " )");

		//update the x-axis
		chartWrapper.select(".x.axis")
			.attr("transform", "translate(0," + _yScale.range()[0] + ")")
			.call(_xAxis)
			.append('text')
			.attr('text-anchor', 'middle')
			.attr("transform", "translate(" + _innerSize.width/2 + ", " + _margin.bottom/2 + " )")
			.classed("axis-label", true)
			.text(chartType[_type].xLabel);
		
		//update the y-axis
		chartWrapper.select(".y.axis")
			.call(_yAxis)
			.append('text')
			.attr('text-anchor', 'middle')
			.attr("transform", "translate(" + -_margin.left/2 + ", " + _innerSize.height/2 + " ) rotate(-90)")
			.classed("axis-label", true)
			.text(chartType[_type].yLabel);
	}

	//myType:
	//	set (get) the predefined type of graphics
	// C_BRT_5H/ACCEL
	// C_BRT_5H/X_VALUE
	function myType(_) {
		if ( !arguments.length )
			return _type;
		
		switch(_) {
			case "N/C_BRT_5H":
			case "C_BRT_5H/N":
				_type = "speed-torque";
				break;
			case "N/ACCEL":
			   _type = "speed-accel";
		   		break;
			case "N/X_VALUE":
				_type = "speed-X";
				break;		
			case "C_BRT_5H/ACCEL":
				_type = "torque-accel";
				break;
			case "C_BRT_5H/X_VALUE":
				_type = "torque-X";
				break;
			default:
				console.log("warning: unknowned type (" + _ + ")");
				console.log("... using default type (speed-torque)");
				_type = "speed-torque";
		}
		return this;	
	}
}
