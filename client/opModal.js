/* Note:
 * 1 - element of dataTableAutoImport class must have an id which match exactly the data columns field data field 
 */
var str_opModal = `
		<div class="form-group contextualItems">
			<label for="type" class="control-label">Mode:</label>
			<select class="form-control dataTableAutoImport" id="opMode">
				<option >N/ACCEL</option>
				<option >N/C_BRT_5H</option>
				<option >N/X_VALUE</option>
				<option >C_BRT_5H/ACCEL</option>
				<option >C_BRT_5H/N</option>
				<option >C_BRT_5H/X_VALUE</option>
			</select>
		</div>
		<div class="form-group contextualItems">
			<label for="value" class="control-label">Dyno:</label>
			<input type="number" class="form-control dataTableAutoImport" id="opDyno">
		</div>
		<div class="form-group contextualItems">
			<label for="value" class="control-label">Engine:</label>
			<input type="number" class="form-control dataTableAutoImport" id="opEngine">
		</div>
		<div class="form-group contextualItems">
			<label for="value" class="control-label">Time:</label>
			<input type="number" class="form-control dataTableAutoImport" id="opTime">
		</div>
`;
