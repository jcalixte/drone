		// Importation du module
    <script>Microsoft.Maps.registerModule('AnimationModule');</script>
    <script src="{{ asset('javascript/AnimationModule.js') }}" type="text/javascript" charset="utf-8"></script>

		// L'appel au module
		var animation_loaded = false;
		Microsoft.Maps.loadModule('AnimationModule', { callback: function(){
			animation_loaded = true;
		}});

		// Les fonctions

		function ClearMap() {
			map.entities.clear();

			if (currentAnimation != null) {
				currentAnimation.stop();
				currentAnimation = null;
			}
		}

		function MovePinOnPath(isGeodesic) {
			ClearMap();

			var pin = new Microsoft.Maps.Pushpin(path[0]);
			map.entities.push(pin);

			currentAnimation = new Bing.Maps.Animations.PathAnimation(path, function (coord) {
				pin.setLocation(coord);
			}, isGeodesic, 1000);

			currentAnimation.play();
		}

		function DrawPath(isGeodesic) {
			ClearMap();

			var line;

			currentAnimation = new Bing.Maps.Animations.PathAnimation(path, function (coord, idx, frameIdx) {
				if (frameIdx == 1) {
					//Create the line the line after the first frame so that we have two points to work with.
					line = new Microsoft.Maps.Polyline([path[0], coord]);
					map.entities.push(line);
				}
				else if (frameIdx > 1) {
					var points = line.getLocations();
					points.push(coord);
					line.setLocations(points);
				}
			}, isGeodesic, 40000);

			currentAnimation.play();
		}