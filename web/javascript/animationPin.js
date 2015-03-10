(function ($m) {
    (function(proto) {
        if (!proto.moveLocation){
            proto.moveLocation = function(locs, finalTime, that, startLoc) {
                // locs = Locations to move the pushpin to
                // finalTime = time (in milliseconds) to perform animation
                if(that === undefined){
                    that = this;
                }
                if(startLoc === undefined){
                    startLoc = this.getLocation();
                }
                if (finalTime === undefined){
                    finalTime = 1000; // Default to 1 second
                }
                var endLoc = locs[0], startTime = new Date();
                var interval = window.setInterval(function() {
                    var timeElapsed = (new Date()) - startTime;
                    if (timeElapsed >= finalTime){
                        // Full animation time (finalTime) has elapsed
                        // Just set final location and end animation
                        that.setLocation(endLoc);
                        window.clearInterval(interval);
                        if(locs.length > 1){
                            locs.shift();
                            proto.moveLocation(locs, finalTime, that, endLoc);
                        }
                    }
                    // Set the Latitude/Longitude values to a percentage
                    // of the total distance to move based on the amount
                    // of time that has elapsed since animation started.
                    var timeElapsedPercent = (timeElapsed / finalTime);
                    var latitudeDistToMove = (
                        endLoc.latitude - startLoc.latitude
                    );
                    var longitudeDistToMove = (
                        endLoc.longitude - startLoc.longitude
                    );
                    that.setLocation(new $m.Location(
                        startLoc.latitude +  (timeElapsedPercent * latitudeDistToMove),
                        startLoc.longitude + (timeElapsedPercent * longitudeDistToMove)
                        ));
                }, 10);
            };
        }
    })($m.Pushpin.prototype);
})(Microsoft.Maps);
