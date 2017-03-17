/* Note:
 * 1 - element of dataTableAutoImport class must have an id which match exactly the data columns field data field 
 */
var str_chnModal = `
		<div class="form-group contextualItems">
			<label for="label" class="control-label">Label:</label> 
			<input type="text" class="form-control dataTableAutoImport" id="chnLabel" list="chnLabelList" placeholder="Choose the channel to apply..." >  
			<datalist id="chnLabelList"> 
				<!--option value="toto"> 
				<option value="titi"> 
				<option value="tata"--> 
			 </datalist>
		</div>
		<div class="form-group contextualItems">
			<label for="value" class="control-label">Value:</label>
			<input type="number" class="form-control dataTableAutoImport" id="chnValue">
		</div>
		<div class="form-group contextualItems">
			<label for="trigger" class="control-label">Trigger:</label>
			<select class="form-control dataTableAutoImport" id="chnTrigger" >
				<option>Before</option>
				<option>After</option>
			</select>
		</div>
		<div class="form-group contextualItems">
			<label for="type" class="control-label">Type (optional):</label>
			<select class="form-control dataTableAutoImport" id="chnType">
				<option>Map</option>
				<option>Curve</option>
				<option>Value</option>
				<option>NN</option>
				<option>Draft</option>
			</select>
		</div>
		<div class="form-group contextualItems">
			<label for="type" class="control-label">Unit (optional):</label>
			<select class="form-control dataTableAutoImport" id="chnUnit">
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
		<div class="form-group contextualItems">
			<label for="description" class="control-label">Comment (optional):</label> 
			<textarea class="form-control dataTableAutoImport" rows="2" id="chnDesc">commentaires...</textarea> 
		</div>
`
