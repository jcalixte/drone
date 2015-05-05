var drone = function (name, latitude, longitude, altitude) {
	this.name      = typeof name  !== undefined ? name  : "";
	this.latitude  = typeof latitude  !== undefined ? latitude  : null;
	this.longitude = typeof longitude !== undefined ? longitude : null;
	this.altitude  = typeof altitude  !== undefined ? altitude  : null;
	this.speed     = 0;
	this.getPosition = function () {
		var data = {
			latitude:  this.latitude,
			longitude: this.longitude,
			altitude:  this.altitude,
		};
		return data;
	}
	this.setSpeed = function (speed) {
		if (speed >= 0) {
			this.speed = speed;
		}
	}
}