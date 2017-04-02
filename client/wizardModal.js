/* Note:
 * 1 - element of dataTableAutoImport class must have an id which match exactly the data columns field data field 
 */
var str_wizardModal = `
	<form id="form-wizard">
		<h5 class="contextualItems">Control mode settings:</h5>
		<div class="form-group contextualItems">
			<select class="form-control" name="regulation-mode">
				<option >N/C_BRT_5H</option><!--value=12-->
				<option >N/ACCEL</option><!--value=8-->
				<option >N/X_VALUE</option><!--value=16-->
				<option >C_BRT_5H/ACCEL</option><!--value=11-->
				<option >C_BRT_5H/N</option><!--value=13-->
				<option >C_BRT_5H/X_VALUE</option><!--value=17-->
			</select>
		</div>
		<div class="form-group contextualItems">
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1" >Control time</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" name="control-time" value="45">
			</div>
		</div>
		<hr class="contextualItems">
		<h5 class="contextualItems">Direction settings:</h5>
		<div class="form-group contextualItems">
			<div class="radio">
				<label class="active"><input type="radio" name="direction" aria-label="Step" value="down-up" checked="" >Down-Up</label>
			</div>

			<div class="radio">
				<label ><input type="radio" name="direction" aria-label="Step" value="up-down" >Up-Down</label>
			</div>
		</div>
		<hr class="contextualItems">
		<h5 class="contextualItems">Dyno settings:</h5>
		<div class="form-group contextualItems">
			<!--label for="type" class="control-label">Min:</label-->
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Min</span>
				<input type="number" name="min-dyno" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Max</span>
				<input type="number" name="max-dyno" class="form-control"  aria-describedby="basic-addon1" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class= "input-group">
				<span class="input-group-addon">
					<div class="radio-inline">
						<label class="active"><input type="radio" name="type-dyno" aria-label="Step" checked="" value="step">Step</label>
					</div>

					<div class="radio-inline">
						<label><input type="radio" name ="type-dyno" aria-label="Step" value="count">Count</label>
					</div>
				</span>
				<input type="number" class="form-control"  name="type-dyno-value" aria-describedby="basic-addon1" required>
			</div>
		</div>
		<hr class="contextualItems">
		<h5 class="contextualItems">Engine settings:</h5>
		<div class="form-group contextualItems">
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Min</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" name="min-engine" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class="input-group">
				<span class="input-group-addon" id="basic-addon1">Max</span>
				<input type="number" class="form-control"  aria-describedby="basic-addon1" name="max-engine" required>
			</div>
		</div>
		<div class="form-group contextualItems">
			<div class= "input-group">
				<span class="input-group-addon">
					<div class="radio-inline">
						<label class="active"><input type="radio" name ="type-engine" aria-label="Step" checked="" value="step">Step</label>
					</div>

					<div class="radio-inline">
						<label><input type="radio" name ="type-engine" aria-label="Step" value="count">Count</label>
					</div>
				</span>
				<input type="number" class="form-control"  name="type-engine-value" aria-describedby="basic-addon1" required>
			</div>
		</div>
	</form>
`
