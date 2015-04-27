var drone = function(latitude, longitude, altitude) {
	this.latitude  = typeof latitude  !== undefined ? latitude  : null;
	this.longitude = typeof longitude !== undefined ? longitude : null;
	this.altitude  = typeof altitude  !== undefined ? altitude  : null;
	this.speed     = 0;
	this.getPosition = function() {
		return
		{
			latitude:  this.latitude,
			longitude: this.longitude,
			altitude:  this.altitude,
		};
	}
	this.setSpeed = function(speed) {
		if(speed >= 0){
			this.speed = speed;
		}
	}
}