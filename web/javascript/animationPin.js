(function ($m) {
	(function(proto) {
		if(!proto.moveLocation) {
			proto.moveLocation = function(initLoc, locs, speed, that, startLoc) {
				$("#inAction").text('Flying.');
				// speed = vitesse du drone en m/s
				if(that === undefined) {
					that = this;
				}
				if(startLoc === undefined) {
					startLoc = this.getLocation();
				}
				var locations    = proto.nearestLocation(that, initLoc, locs);
				var endLoc       = locations[0]['location'], startTime = new Date();
				var nextDistance = proto.getNextDistance(that, endLoc);
				var finalTime    = Math.round(nextDistance / speed) * 1000; // t = d/v en millisecondes

				var interval = window.setInterval(function() {
					var timeElapsed = new Date() - startTime;
					if (timeElapsed >= finalTime) {
						that.setLocation(endLoc);
						window.clearInterval(interval, locations[0]);
						if(locations.length > 1) {
							proto.doActionAndGo(initLoc, locations, speed, that, endLoc);
						}else{
							$("#inAction").text('In the recharging base.');
						}
					}
					
					var timeElapsedPercent  = timeElapsed / finalTime;
					var latitudeDistToMove  = endLoc.latitude - startLoc.latitude;
					var longitudeDistToMove = endLoc.longitude - startLoc.longitude;
					that.setLocation(new $m.Location(
						startLoc.latitude  + (timeElapsedPercent * latitudeDistToMove),
						startLoc.longitude + (timeElapsedPercent * longitudeDistToMove)
					));
				}, 10);
			};
		}
		if(!proto.nearestLocation) {
			proto.nearestLocation = function(that, initLoc, locs) {
				var locations  = locs.slice();
				var nearestKey = false;
				var nearest    = false;
				var distance   = Infinity;
				for(var i = 0; i < locations.length; i++) {
					if(locations[i]['location'].latitude  != initLoc.latitude &&
					   locations[i]['location'].longitude != initLoc.longitude) {
						var currentDistance = proto.getNextDistance(that, locations[i]['location']);
						if(currentDistance < distance) {
							nearestKey = i;
							nearest    = locations[i];
							distance   = currentDistance;
						}
					}
				}
				if(nearest != false) {
					var temp              = locations[0];
					locations[0]          = nearest;
					locations[nearestKey] = temp;
				}

				return locations;
			}
		}
		if(!proto.getNextDistance) {
			proto.getNextDistance = function(that, nextLocation) {
				var originLocation = that.getLocation();

				var R           = 6371000; // metres
				var phi1        = originLocation.latitude * Math.PI / 180;
				var phi2        = nextLocation.latitude * Math.PI / 180;
				var deltaPhi    = (nextLocation.latitude-originLocation.latitude) * Math.PI / 180;
				var deltaLambda = (nextLocation.longitude-originLocation.longitude) * Math.PI / 180;

				var a = Math.sin(deltaPhi/2)
						* Math.sin(deltaPhi/2)
						+ Math.cos(phi1)
						* Math.cos(phi2)
						* Math.sin(deltaLambda/2)
						* Math.sin(deltaLambda/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

				return Math.round(R * c);
			}
		}
		if(!proto.doActionAndGo) {
			proto.doActionAndGo = function(initLoc, locations, speed, that, endLoc) {
				switch (locations[0]['action']) {
					case 'photo':
						$("#inAction").text('Taking a photo.');
						setTimeout(function() {
							proto.goNext(initLoc, locations, speed, that, endLoc)
						}, 1000);
						break;
					case 'sound':
						$("#inAction").text('Recording a sound.');
						setTimeout(function() {
							proto.goNext(initLoc, locations, speed, that, endLoc)
						}, 2000);
						break;
					case 'video':
						$("#inAction").text('Recording a video.');
						setTimeout(function() {
							proto.goNext(initLoc, locations, speed, that, endLoc)
						}, 5000);
						break;
					case 'nothing':
						$("#inAction").text('Nothing');
						proto.goNext(initLoc, locations, speed, that, endLoc);
						break;
					default:
						$("#inAction").text('Par défaut');
				}
				return true;
			}
		}
		if(!proto.goNext) {
			proto.goNext = function(initLoc, locations, speed, that, endLoc) {
				locations.shift();
				proto.moveLocation(initLoc, locations, speed, that, endLoc);
			}
		}
	})($m.Pushpin.prototype);
})(Microsoft.Maps);
