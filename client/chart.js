// require JQuery.js
// require DataTable
// require d3.js

var Chart = (function () {
	const aspectRatioHeight = 0.4; // graph height = aspectRatio * width 
	const aspectRatioCircle = 0.008; // graph height = aspectRatio * width 
	const margin = {top:20, bottom:20, left:50, right:50}; // margin are necessary to draw the axis
	const y = { min:0 , max:300}; //Torque default range
	const x = { min:600 , max:3500}; //Speed default range
	var graphSize = {};
	var radius ;
	var xScale, yScale;
	var xAxis, yAxis;
	var lineFunction; // the path generator for the line function
	var svgContainer , chartWrapper;
	var path;
	var data = [];


	function handleMouseClick(d, i){
		var circle_selected = d3.select(this).classed("selected");

		//toggle ".selected" circle class
		//d3.select(this).classed("selected", !circle_selected);

		//toggle row select state
		if (circle_selected) {
			$('#opDataTable').DataTable().row(d.idx).deselect();
			d.selected = false;
		} else {
			$('#opDataTable').DataTable().row(d.idx).select();
			d.selected = true;
		}
	}

	function drawCircles( ) {

		if ( data.length > 0 ) {
			var circles = chartWrapper.select(".circles")	
				.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("class", "active") 
				.classed("disabled", function(d){ return d.active !==1 ;})
				.classed("selected", function(d){ return d.selected ;})
				.attr("cx",  function (d){ return xScale(d.x); }) 
				.attr("cy",  function (d){ return yScale(d.y); }) 
				.attr("id",  function (d){ return d.idx; }) 
				.attr("r", radius )
				//.on("dblclick", handleMouseClick)
				.on("click", handleMouseClick)
				//.on("mouseout", handleMouseOut)
				//.on("mouseover", handleMouseOver);
				;

			//svgContainer.selectAll(".line")
			//	.attr("marker-end", "url(#arrow-head)");
		}

	} //draw circles	

	// get data from the datasource
	// return an array of node with properties of the column of the datatable
	function initData( dtName ){

		var dt_rows = $(dtName).DataTable().rows(); 
		
		for (var i=0; i < dt_rows.data().length; i++ ){
			var node = {};
			node.x = parseInt(dt_rows.data()[i].opDyno);
			node.y = parseInt(dt_rows.data()[i].opEngine);
			node.active= parseInt(dt_rows.data()[i].opActive);
			node.idx = dt_rows.row(i).index(); 
			node.selected = $(dt_rows.row(i).node()).hasClass('selected');
			data.push(node);
		}
	} // initData


	// set the dimensions of the graph with a 0.7 ratio aspect
	function updateDimensions() {

		var w = document.getElementById('panel-graph').clientWidth;

		graphSize.width = w - margin.left - margin.right;
		graphSize.height = aspectRatioHeight*w - margin.top - margin.bottom;
		radius = w*aspectRatioCircle;
	} //updateDimensions


	return {
		update : function () {
				 },
		resize : function () {
				 },

		init : function (dtName) {
			// draw N/Torque and torque/N axis
			var min_y, max_y, min_x, max_x;

			initData(dtName);

			min_y = d3.min(data, function(d) { return d.y; });
			max_y = d3.max(data, function(d) { return d.y; });
			min_x = d3.min(data, function(d) { return d.x; });
			max_x = d3.max(data, function(d) { return d.x; });
			
			// reset the domain boudaries if necessary. deals with NaN cases!!!! 
			if ( min_y < y.min ) 
				y.min = min_y;

			if ( max_y > y.max )
				y.max = max_y;

			if ( min_x < x.min )
				x.min = min_x;

			if ( max_x > x.max )
				x.max = max_x;

			// Initialise the scales
			xScale = d3.scaleLinear().domain([x.min, x.max]);
			yScale = d3.scaleLinear().domain([y.min, y.max]);
		
			//Initialise the axis
			xAxis = d3.axisBottom(xScale);
			yAxis = d3.axisLeft(yScale);

			//Initialise the path generator for the line chart
			lineFunction = d3.line()
				.x( function(d) { return xScale(d.x); } )
				.y( function(d) { return yScale(d.y); } )
				.curve( d3.curveLinear );

			//init svg
			d3.select("svg").remove();
			svgContainer = d3.select("#svgContainer").append("svg");
			chartWrapper = svgContainer
							.append('g')
							.attr("class","chartWrapper");

			//draw lines
			path = chartWrapper 
				.append("path")
				.datum(data)
				.attr("class", "line") 
				/*.attr("d", function(d) { return lineFunction(d );})*/;

			chartWrapper.append("g").attr("class", "x axis");
			chartWrapper.append("g").attr("class", "y axis");
			chartWrapper.append("g").attr("class", "circles");

			// render the chart
			this.render( );
		} // init 
		,

	   render : function () {
	
			//set dimensions based on window size and aspect ratio
			updateDimensions();

			//update scalers ranges	
			xScale.range([0, graphSize.width-margin.left-margin.right]);// should be only graphSize, but I can't figure out why the svg is not centered
			yScale.range([graphSize.height,0]);

			//update svg elements to new dimension
			svgContainer
				.attr('width', graphSize.width + margin.left + margin.right ) 	
				.attr('height', graphSize.height + margin.bottom + margin.top ); 	

			chartWrapper.select('circles').remove();

			chartWrapper.attr(
					"transform",
					"translate(" + margin.left + "," + margin.top + ")"
					);

			//update axis
			xAxis.scale(xScale);
			yAxis.scale(yScale);

			chartWrapper.select('.x.axis')
				.attr("transform", "translate(0," + graphSize.height + ")")
				.call(xAxis);

			chartWrapper.select('.y.axis')
				.call(yAxis);


			path.attr('d', lineFunction);

			drawCircles();
		} // render function
	};	
})();



/*
function draw_plot(dt ) {
//function draw_plot(x_tab, y_tab, idx_tab ) {
// 
//  - check that they all have the same sise...
//  - mettre une valeur par defaut pour le label, au cas ou l'utilisateur ne le fait pas




	// Create event handlers for mouse out circle
	function handleMouseOut(d, i){
		d3.select(this)
			.attr("fill", "black" )
			.attr("r", radius );
		
	}

	// Create event handlers for mouse over circle
	function handleMouseOver(d, i){
		d3.select(this)
			.attr("fill", "orange")
			.attr("r", radius * 2);
		
	}


	// arrow-head
	svgContainer.append("svg:defs")
		.append("svg:marker")
		.attr("id", "arrow-head")
		.attr("refX", 2)
		.attr("refY", 6)
		.attr("markerWidth", 13)
		.attr("markerHeight", 13)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M2,2 L2,11 L10,6 L2,2")
		.style("fill", "black");

//	$('#svgContainer').on( 'dblclick',  function () {
//			alert("jquery double click");
//	});


	// On Click, we want to add data to the array and chart
	svgContainer.on("dblclick", function() {
//		var coords = d3.mouse(this);

		// Normally we go from data to pixels, but here we're doing pixels to data
		var newData= {
			 x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
			 y: Math.round( yScale.invert(coords[1]))
		 };

		dataset.push(newData);   // Push data to our array

		svg.selectAll("circle")  // For new circle, go through the update process
		  .data(dataset)
		  .enter()
		  .append("circle")
		  .attr(circleAttrs)  // Get attributes from circleAttrs var
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);

		alert("svg double click ajoute un pdf!!!!!");
});


} // draw plot
*/	
