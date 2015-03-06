(function ($m) {
    (function(proto) {
        if (!proto.moveLocation){
            proto.moveLocation = function(loc, speed) {
                // loc = Location to move the pushpin to
                // speed = time (in milliseconds) to perform animation
                var that = this, startLoc = this.getLocation(),
                    endLoc = loc, startTime = new Date();
                if (speed === undefined){
                    speed = 1000; // Default to 1 second
                }
                var interval = window.setInterval(function() {
                    var timeElapsed = (new Date()) - startTime;
                    if (timeElapsed >= speed){
                        // Full animation time (speed) has elapsed
                        // Just set final location and end animation
                        that.setLocation(endLoc);
                        window.clearInterval(interval);
                    }
                    // Set the Latitude/Longitude values to a percentage
                    // of the total distance to move based on the amount
                    // of time that has elapsed since animation started.
                    var timeElapsedPercent = (timeElapsed / speed);
                    var latitudeDistToMove = (
                        endLoc.latitude - startLoc.latitude
                    );
                    var longitudeDistToMove = (
                        endLoc.longitude - startLoc.longitude
                    );
                    that.setLocation(new $m.Location(
                        startLoc.latitude + (timeElapsedPercent * latitudeDistToMove),
                        startLoc.longitude + (timeElapsedPercent * longitudeDistToMove)
                        ));
                }, 10);
            };
        }
    })($m.Pushpin.prototype);
})(Microsoft.Maps);
