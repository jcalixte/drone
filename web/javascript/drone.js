var Drone = function(id, latitude, longitude, altitude) {
	this.id        = id;
	this.latitude  = typeof latitude  !== undefined ? latitude  : null;
	this.longitude = typeof longitude !== undefined ? longitude : null;
	this.altitude  = typeof altitude  !== undefined ? altitude  : null;
	this.speed     = 0;
	this.path      = [];
	this.getLocation = function() {
		var retour = {
			latitude:  this.latitude,
			longitude: this.longitude
		}; 
		return retour;
	};
	this.getPosition = function() {
		var retour = {
			latitude:  this.latitude,
			longitude: this.longitude,
			altitude:  this.altitude,
		}; 
		return retour;
	};
	this.setSpeed = function(speed) {
		if(speed >= 0){
			this.speed = speed;
		}
	};
	this.addPointToPath = function(point) {
		this.path.push(point);
	};
}