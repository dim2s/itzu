// add some operation to Set object
/* module.exports =  */(function extendSet() {
	Set.prototype.isSuperset = function(subset) {
		var that = this;
		// for (var elem of subset) {
		subset.forEach( function(elem) {
			if (!that.has(elem)) {
				return false;
			}
		});
		return true;
	};

	Set.prototype.union = function(setB) {
		var union = new Set(this);
		// for (var elem of setB) {
		setB.forEach( function( elem) {
			union.add(elem);
		});
		return union;
	};

	Set.prototype.intersection = function(setB) {
		var intersection = new Set();
		var that = this;
		setB.forEach( function(elem) {
		// for (var elem of setB) {
			if (that.has(elem)) {
				intersection.add(elem);
			}
		});
		return intersection;
	};

	Set.prototype.purge = function(setB) {
		var that = this;
		setB.forEach( function(elem) {
		// for (var elem of setB) {
			if (that.has(elem)) {
				that.delete(elem);
			}
		});
	};

	Set.prototype.difference = function(setB) {
		var difference = new Set(this);
		setB.forEach( function(elem) {
		// for (var elem of setB) {
			difference.delete(elem);
		});
		return difference;
	};
})();
