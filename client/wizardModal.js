/* Note:
 * 1 - element of dataTableAutoImport class must have an id which match exactly the data columns field data field 
 */
var str_wizardModal = `
	<form id="form-wizard">
		<h5>Control mode settings:</h5>
		<div class="form-group contextualItems">
			<select class="form-control" id="opMode">
				<option >N/ACCEL</option><!--value=8-->
				<option >N/C_BRT_5H</option><!--value=12-->
				<option >N/X_VALUE</option><!--value=16-->
				<option >C_BRT_5H/ACCEL</option><!--value=11-->
				<option >C_BRT_5H/N</option><!--value=13-->
				<option >C_BRT_5H/X_VALUE</option><!--value=17-->
			</select>
		</div>
		<hr>
		<h5>Direction settings:</h5>
		<div class="form-group contextualItems">
			<div class="radio">
				<label><input type="radio" name ="direction-radio" aria-label="Step">Up-Down</label>
			</div>

			<div class="radio">
				<label><input type="radio" name ="direction-radio" aria-label="Step">Down-Up</label>
			</div>
		</div>
		<hr>
		<h5>Engine settings:</h5>
		<div class="form-group contextualItems">
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Max</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Min</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class= "input-group">
				<span class="input-group-addon">
					<div class="radio-inline">
						<label class="active"><input type="radio" name ="step-radio" aria-label="Step" checked="">Step</label>
					</div>

					<div class="radio-inline">
						<label><input type="radio" name ="step-radio" aria-label="Step" >Count</label>
					</div>
				</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<hr>
		<h5>Dyno settings:</h5>
		<div class="form-group contextualItems">
			<!--label for="type" class="control-label">Max:</label-->
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Max</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<!--label for="type" class="control-label">Min:</label-->
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Min</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class= "input-group">
				<span class="input-group-addon">
					<div class="radio-inline">
						<label class="active"><input type="radio" name ="dyno-step-radio" aria-label="Step" checked="">Step</label>
					</div>

					<div class="radio-inline">
						<label><input type="radio" name ="dyno-step-radio" aria-label="Step">Count</label>
					</div>
				</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
	</form>
`
