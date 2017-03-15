var str_setvalueForm = `
	<form class="contextualItems" id="formNewSetValue">
		<div class="form-group">
			<label for="label" class="control-label">Label:</label> 
			<input type="text" class="form-control newSetvalue-input" id="setvalue-label" list="label-datalist" >  
			<datalist id="label-datalist"> 
				<option value="toto"> 
				<option value="titi"> 
				<option value="tata"> 
			 </datalist>
		</div>
		<div class="form-group">
			<label for="value" class="control-label">Value:</label>
			<input type="number" class="form-control newSetvalue-input" id="setvalue-value">
		</div>
		<div class="form-group">
			<label for="trigger" class="control-label">Trigger:</label>
			<select class="form-control newSetvalue-input" id="setvalue-trigger" >
				<option>Before Operating Point</option>
				<option>After Operating Point</option>
			</select>
		</div>
		<div class="form-group">
			<label for="type" class="control-label">Type (optional):</label>
			<select class="form-control newSetvalue-input" id="setvalue-type">
				<option>ECU Map</option>
				<option>ECU Curve</option>
				<option>ECU Value</option>
				<option>STD NN</option>
				<option>Draft NN</option>
			</select>
		</div>
		<div class="form-group">
			<label for="type" class="control-label">Unit (optional):</label>
			<select class="form-control" id="setvalue-unit">
				<option>-</option>
				<option>km/h</option>
				<option>m/s</option>
				<option>%</option>
				<option>N</option>
				<option>rpm</option>
				<option>m/s2</option>
				<option>Nm</option>
				<option>ml</option>
				<option>s</option>
				<option>SZ</option>
				<option>FSN</option>
				<option>A</option>
				<option>V</option>
				<option>0/1</option>
				<option>kg/m2</option>
				<option>m3/h</option>
				<option>l/min</option>
				<option>mV</option>
				<option>mg/s</option>
				<option>mbar</option>
				<option>rpm</option>
				<option>bar</option>
				<option>mg/str</option>
				<option>g/s</option>
				<option>g</option>
				<option>V/s</option>
				<option>min</option>
				<option>h</option>  
				<option>d</option> 
				<option>ppm</option>  
				<option>ms</option>  
				<option>Hz</option>  
			</select> 
		</div>
		<div class="form-group">
			<label for="description" class="control-label">Comment (optional):</label> 
			<textarea class="form-control" rows="2">commentaires...</textarea> 
		</div>
	</form>
`
