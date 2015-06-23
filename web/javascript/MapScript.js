/// <reference path="../../typings/jquery/jquery.d.ts"/>
/* global Microsoft */
/* global mapAction */
/* global Routing */
/* global TSP */
$(function() {
	var credentialsKey = "AkTr7IeJt5O4ZpWh9reo8wMmlcWN8purxjzGkLalDqeMICooYnrBJepl9dD7cmMt";
	var mapOptions = {
		credentials: credentialsKey,
		center: new Microsoft.Maps.Location(48.85720336058152, 2.3527531137302393),
		//mapTypeId: Microsoft.Maps.MapTypeId.automatic,
		mapTypeId: Microsoft.Maps.MapTypeId.aerial,
		zoom: 10
	};
	// Enregistrement des coins pour les terrains.
	var pinTable = [];
	var map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
	var search_engine_loaded   = false;
	var advanced_shapes_loaded = false;

	var shape      = [];
	var path       = [];
	var fields     = [];
	var polyFields = [];

	/*==========  Variable du drone  ==========*/
	var droneList = [];

	var dronePinList       = [];
	// var currentDroneAction = false;
	var droneSpeedKmH      = 40;
	// var droneSpeedKmH    = 40*4;
	var droneSpeed         = msToKmh(droneSpeedKmH);
	var iDrone             = 0;
	var numberOfDrones     = 2;

	var twigElements = false;

    var circleRadius = 0.0000008;

	var loadingAnim = $("#container-loading");

	$("#search").click(function() {
		var query = $("#search_query").val();
		if(query != "") {
			searchModule(query);
		}
	});

	$("#rectangleChoice").click(function(e) {
		e.preventDefault();
		$(this).toggleClass('active').trigger('fieldChoice');
		return false;
	});

	$("#interestPoint").click(function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
	});

	$("#putDrone").click(function (e) {
		e.preventDefault();
		$(this).toggleClass('active');
	});

	$("#start").click(function() {
		moveDrones();
	});

	$("#droneCentered").click(function() {
		if (dronePinList.length > 0) {
			var options = map.getOptions();
			options.center = dronePinList.getAverageLocation();
			options.zoom   = 18;
			map.setView(options);
		}
	});

	$(".selectAction").click(function() {
		$("#actionTaken").text($(this).attr('id'));
		var icon = "glyphicon ";
		switch($(this).attr('id')) {
			case 'photo':
				icon += "glyphicon-picture";
				break;
			case 'sound':
				icon += "glyphicon-volume-up";
				break;
			case 'video':
				icon += "glyphicon-facetime-video";
				break;
			case 'nothing':
				icon += "glyphicon-unchecked";
				break;
		}
		$("#interestPoint-icon").removeClass().addClass(icon);
	});

	/*==========  Évènements  ==========*/

	$(document).on('fieldChoice', function() {
		if($("#rectangleChoice").hasClass('active')) {
			var handleClick = Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
				if(e.targetType == "map") {
					var point = new Microsoft.Maps.Point(e.getX(), e.getY());
					var loc = e.target.tryPixelToLocation(point);
					addPointToShape(loc.latitude, loc.longitude);
				}
			});
		}else{
			if(handleClick !== false) {
				Microsoft.Maps.Events.removeHandler(handleClick);
				handleClick = false;
			}
			addShape();
		}
	});

	Microsoft.Maps.Events.addHandler(map, 'mouseover', changeCursor);
	Microsoft.Maps.Events.addHandler(map, 'click', changeCursorClick);


	/*==========  FONCTION D'INITIALISATION  ==========*/

	mapAction = function (pTwigElements, droneEntities, fieldEntities, interestPointEntities, queryAddress) {
		iDrone = droneEntities.length;
		if (!twigElements) {
			twigElements = pTwigElements;
		}
		var loc;
		var dronePinOptions = {
			icon: twigElements['quadcopter'],
			width: 50,
			height: 50,
			anchor: new Microsoft.Maps.Point(25, 25),
			text: "test"
		};
		droneEntities.forEach(function (e) {
			loc = new Microsoft.Maps.Location(
				e.latitude,
				e.longitude
			);
			dronePinOptions.text = e.product;
			droneList[e.id] = new Drone(e.id, e.latitude, e.longitude, e.altitude);
			dronePinList[e.id] = new Microsoft.Maps.Pushpin(loc, dronePinOptions);
			map.entities.push(dronePinList[dronePinList.length - 1]);
		});
		fieldEntities.forEach(function (e) {
			e.forEach(function (e) {
				addPointToShape(e.latitude, e.longitude, true);
			});
			addShape();
		});
		interestPointEntities.forEach(function (e) {
			addCircle(e.location, e.action);
			path[path.length] = e;
		});
		//Ajout de modules utilisés
		Microsoft.Maps.loadModule('Microsoft.Maps.Search', {
			callback: function () {
				search_engine_loaded = true;
				var query = queryAddress;
				if (query != "") {
					searchModule(query);
				}
			}
		});
		Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes', {
			callback: function () {
				advanced_shapes_loaded = true;
			}
		});
		if (dronePinList.length > 0) {
			getWeatherDrone(dronePinList.getAverageLocation().latitude, dronePinList.getAverageLocation().longitude);
		}
	};
	/*==========  Fonctions  ==========*/

	function searchModule(q) {
		if(search_engine_loaded) {
			var searchManager = new Microsoft.Maps.Search.SearchManager(map);
			var searchRequest = {
				where: q, 
				count: 5, 
				callback: searchGeoCallback, 
				errorCallback: searchError
			};
			searchManager.geocode(searchRequest);
		}
	}

	function searchGeoCallback(geocodeResult, userData) {
		map.setView({
			bounds: geocodeResult.results[0].bestView
		});
	}

	function searchError(searchRequest) {
		alert("An error occurred.");
	}

	function addPointToShape(lat, lon, loading) {
		if(typeof loading == undefined) {
			loading = false;
		}
		shape[shape.length] = new Microsoft.Maps.Location(lat, lon);
		var loc = new Microsoft.Maps.Location(lat, lon);

		if(!loading) {
			// Add a pin to the map
			pinTable[pinTable.length] = new Microsoft.Maps.Pushpin(loc); 
			map.entities.push(pinTable[pinTable.length-1]);
		}
	}

	function addShape() {
		if(shape.length > 0) {
			// On ferme la forme avec le premier point si ce n'est pas déjà fait.
			if(shape[0] != shape[shape.length-1]) {
				shape[shape.length] = shape[0];
			}
			var polyShape = shape.slice();
			var polygon = new Microsoft.Maps.Polygon(polyShape);
			polygon.setOptions({
				fillColor: { a: 10, r: 0, g: 0, b: 0 },
				strokeColor: { a: 200, r: 255, g: 255, b: 255 },
				infobox: "field",
				visible: true
			});
			// Suppression des points
			for (var i = 0; i < pinTable.length; i++) {
				map.entities.remove(pinTable[i]);
			}
			map.entities.push(polygon);
			// Remise à zéro du tableau de point.
			pinTable.length = 0;
			shape.length    = 0;
			Microsoft.Maps.Events.addHandler(polygon, 'click', addCircleEvent);
			polyFields[polyFields.length] = polygon;
			fields[fields.length]         = polyShape;
		}
	}

	function addCircleEvent(e) {
		if($("#interestPoint").hasClass('active')) {
			var point = new Microsoft.Maps.Point(e.getX(), e.getY());
			var loc = map.tryPixelToLocation(point);
			path[path.length] = {
				location: loc,
				action: $("#actionTaken").text(),
				shape: addCircle(loc, $("#actionTaken").text()),
				id: 0
			};
		}
	}

	function addCircle(location, action) {
		// var backgroundColor = new Microsoft.Maps.Color(10, 100, 0, 0);
		// var borderColor     = new Microsoft.Maps.Color(150, 200, 0, 0);
		// var R               = 6371; // Rayon de la terre en kilomètres
		var lat             = (location.latitude  * Math.PI) / 180;
		var lon             = (location.longitude * Math.PI) / 180;
		var d               = parseFloat(circleRadius);// / R;
		var circlePoints    = [];

		for (var x = 0; x <= 360; x += 2) {
			var position = new Microsoft.Maps.Location(0, 0);
			var xRadian  = x * Math.PI / 180;
			position.latitude = Math.asin(Math.sin(lat)
							  * Math.cos(d)
							  + Math.cos(lat)
							  * Math.sin(d)
							  * Math.cos(xRadian));

			position.longitude = (lon + Math.atan2(Math.sin(xRadian)
							   * Math.sin(d)
							   * Math.cos(lat),Math.cos(d)
							   - Math.sin(lat)
							   * Math.sin(position.latitude))) * 180 / Math.PI;
			position.latitude  = (position.latitude * 180) / Math.PI;
			circlePoints.push(position);
		}

		var polygon = new Microsoft.Maps.Polygon(circlePoints.slice());
		circlePoints.length = 0;

		var options = changeColorPin(action);

		polygon.setOptions(options);

		map.entities.push(polygon);
		return polygon;
	}

	function addDronePin(e) {
		if($("#putDrone").hasClass('active')) {
			var dronePinOptions = {
				icon: twigElements['quadcopter'], 
				width: 50, 
				height: 50, 
				anchor: new Microsoft.Maps.Point(25,25)
			}; 

			var point = new Microsoft.Maps.Point(e.getX(), e.getY());
			var loc = map.tryPixelToLocation(point);

			var newId = 0;
			droneList.forEach(function(drone) {
				if(drone.id > newId) {
					newId = drone.id;
				}
			});
			newId++;
			droneList[newId] = new Drone(newId, loc.latitude, loc.longitude, 1);

			dronePinList[newId] = new Microsoft.Maps.Pushpin(loc, dronePinOptions);
			map.entities.push(dronePinList[dronePinList.length - 1]);
			iDrone++;
			$("#putDrone").toggleClass('active');
			if(iDrone >= numberOfDrones) {
				$("#putDrone").parent().remove();
			}
		}
	}

	function changeCursor(e) {
		var crosshair = $("#rectangleChoice").hasClass('active') ||
						$("#interestPoint").hasClass('active')   ||
						$("#putDrone").hasClass('active');
		if(crosshair) {
			map.getRootElement().style.cursor = 'crosshair';
		}else {
			map.getRootElement().style.cursor = 'grab';
		}
	}

	function changeCursorClick(e) {
		var crosshair = $("#rectangleChoice").hasClass('active') ||
						$("#interestPoint").hasClass('active')   ||
						$("#putDrone").hasClass('active');
		if(crosshair) {
			map.getRootElement().style.cursor = 'crosshair';
		}else{
			map.getRootElement().style.cursor = 'grab';
		}
		addDronePin(e);
	}

	function isInPolygon(polygon, pin) {
		var isInside = false;
		var j = 0;
		var x = pin.longitude;
		var y = pin.latitude;
		var paths = polygon.getLocations();

		for (var i = 0; i < paths.length ; i++) {
			j++;
			if (j == paths.length) { j = 0; }
			if ((paths[i].latitude < y && paths[j].latitude >= y) ||
				(paths[j].latitude < y && paths[i].latitude >= y)) {
				if (paths[i].longitude
					+ (y - paths[i].latitude) / (paths[j].latitude - paths[i].latitude)
					* (paths[j].longitude - paths[i].longitude) < x) {
					isInside = !isInside;
				}
			}
		}
		return isInside;
	}

	function getCentroid(polygon) {
		if(typeof polygon == undefined) {
			return false;
		}else{
			var points            = polygon.getLocations();
			var latitudeCentroid  = 0;
			var longitudeCentroid = 0;
			points.forEach(function(e) {
				latitudeCentroid  += e.latitude;
				longitudeCentroid += e.longitude;
			});
			latitudeCentroid  /= points.length;
			longitudeCentroid /= points.length;

			return new Microsoft.Maps.Location(latitudeCentroid, longitudeCentroid);
		}
	}

	/*==========  Fonctions pour animer le drone  ==========*/

	function moveDrone() {
		if(dronePinList.length > 0) {
			var pathSliced = path.slice();
			if (pathSliced[pathSliced.length-1] != dronePinList.getAverageLocation()) {
				pathSliced[pathSliced.length] = {
					location: dronePinList.getAverageLocation(),
					action: 'nothing'
				};
			}
			pathSliced = getTSPPath(pathSliced);

			var dronePosition1 = getDronePosition(pathSliced, dronePin.getLocation()) + 1;
			pathSliced = shift(pathSliced, dronePosition1);

			$("#inAction").text('Flying');
			dronePinList.moveLocation(dronePinList.getAverageLocation(), pathSliced, droneSpeed);
		}
	}

	function moveDrones() {
		if(droneList.length > 0) {
			loadingAnim.show("fast");
			distributePath(path); // On affilie à chaque drone son propre chemin.
			
			// On ajoute la localisation du drone dans le chemin pour le TSP on optimise les chemins
			droneList.forEach(function(drone) {
				drone.addPointToPath({
					location: drone.getLocation(),
					action: 'nothing'
				});
				drone.path = getTSPPath(drone);
			});

			droneList.forEach(function(drone) {
				dronePinList[drone.id].moveLocation(drone.id, drone.getLocation(), drone.path.slice(), droneSpeed);
			});

			droneList.forEach(function(drone) {
				drone.path = [];
			});
		}
	}

	function getTSPPath (drone) { // p pour path
		var p       = drone.path;
		var min_lat = Infinity;
		var min_lon = Infinity;

		p.forEach(function(e) {
			if(e.location.latitude < min_lat) {
				min_lat = e.location.latitude;
			}
			if(e.location.longitude < min_lon) {
				min_lon = e.location.longitude;
			}
		});

		// On ramène les coordonnées à des coordonnées relatives pour ne pas avoir de coordonnées négatives
		var relativePath = [];
		// On multiplie par un coefficient pour une différence significative entre chaque chemin possible
		var coeff = 10000000;
		p.forEach(function(e) {
			relativePath.push({
				x: (e.location.latitude  - min_lat) * coeff,
				y: (e.location.longitude - min_lon) * coeff
			});
		});
		var relativeBestPath = TSP(relativePath);
/*		console.log("relativeBestPath");
		console.log(relativeBestPath);*/
		var bestPath = [];
		for (var i = 0; i < relativeBestPath.length; i++) {
			bestPath[bestPath.length] = p[relativeBestPath[i]];
        }
        var dronePosition = getDronePosition(bestPath, drone.getLocation());
		bestPath = shift(bestPath, dronePosition);

		return bestPath;
	}

	function shift(arr, k) {
		k = k % arr.length;
		while (k > 0) {
			var tmp = arr[0];
			for (var i = 1; i < arr.length; i++) {
				arr[i - 1] = arr[i];
			}
			arr[arr.length - 1] = tmp;
			k--;
		}
		return arr;
	}

	function getDronePosition(array, location) {
		for(var i = 0; i < array.length; i++) {
			if(array[i].location.latitude == location.latitude && array[i].location.longitude == location.longitude){
				return i + 1;
			}
		}
		return false;
	}

	function distributePath() {
		path.forEach(function(e) {
			var droneAttributedId = -1;
			var minDistance = -1;
			droneList.forEach(function(d) {
				if(getDistance(d.getLocation(), e["location"]) < minDistance || minDistance == -1) {
					droneAttributedId = d.id;
					minDistance = getDistance(d.getLocation(), e["location"]);
				}
			});
			
			if(droneAttributedId != -1) {
				droneList[droneAttributedId].addPointToPath(e);
			}else {
				droneList.getFirstElement().addPointToPath(e);
			}
		});
	}

	function getDistance(originLocation, endLocation) {
		var R           = 6371000; // metres
		var phi1        = originLocation.latitude * Math.PI / 180;
		var phi2        = endLocation.latitude * Math.PI / 180;
		var deltaPhi    = (endLocation.latitude-originLocation.latitude) * Math.PI / 180;
		var deltaLambda = (endLocation.longitude-originLocation.longitude) * Math.PI / 180;

		var a = Math.sin(deltaPhi/2)
				* Math.sin(deltaPhi/2)
				+ Math.cos(phi1)
				* Math.cos(phi2)
				* Math.sin(deltaLambda/2)
				* Math.sin(deltaLambda/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		return Math.round(R * c);
	}

	/*==========  Suppressions  ==========*/
	$('#deleteFields').click(function() {
		var pointsInFields = [];
		var shapePointLocation  = [];

		polyFields.forEach(function(p) {
			path.forEach(function(e) {
				if(isInPolygon(p, e['location'])) {
					pointsInFields.push(e['location']);
					shapePointLocation.push(e);
				}
			});
		});
		loadingAnim.show("fast");
		$.ajax({
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_fields', {_locale: "fr"}),
			data: {
				points: pointsInFields
			},
			success: function(data) {
				console.log("succes !");
				toastr.success('Enregistrement réussi');
				polyFields.forEach(function(e) {
					map.entities.remove(e);
				});
				shapePointLocation.forEach(function(e) {
					var index = -1;
					var equal = false;
					dronePinList.forEach(function(dronePin) {
						if(e.location.latitude  == dronePin.latitude
						 && e.location.longitude == dronePin.longitude) {
							equal = true;
						}				
					});
					if(!equal) {
						index = path.indexOf(e);
						map.entities.remove(path[index].shape);
					}
					if(index > -1) {
						path.splice(index, 1);
					}
				});
				polyFields.length = 0;
			}
		});
		loadingAnim.hide("slow");
	});

	$('#deleteInterestPoints').click(function() {
		loadingAnim.show("fast");
		$.ajax({
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_interest_points', {_locale: "fr"}),
			//data: datas,
			success: function(data) {
				console.log("succes !");
				toastr.success('Suppression réussie');
				path.forEach(function(e) {
					var equal = false;
					dronePinList.forEach(function(dronePin) {
						if(e.location.latitude  == dronePin.latitude
						 && e.location.longitude == dronePin.longitude) {
							equal = true;
						}				
					});
					if(!equal) {
						map.entities.remove(e.shape);
					}	
				});
				path.length = 0;
			}
		});
		loadingAnim.hide("slow");
	});

	$('#deleteDrones').click(function() {
		loadingAnim.show("fast");
		dronePinList.forEach(function(dronePin) {
			$.ajax({
				type: 'POST',
				url: Routing.generate('drone_ajax_delete_drones', {_locale: "fr"}),
				//data: datas,
				success: function(data) {
					console.log("succes !");
					toastr.success('Drone supprimé avec succès');
					map.entities.remove(dronePin);
					dronePin = false;
				}
			});
		});
		loadingAnim.hide("slow");
	});

	/*==========  Fonctions AJAX  ==========*/
	$('#submitDroneLocation').click(function() {
		if(dronePinList.length > 0) {
			ajaxCall('droneLocation');
		}
	});

	$('#submitInterestPoint').click(function() {
		// On filtre les nouveaux points rajoutés
		if(path.length > 0) {
			var i = 0, pathLen = path.length;
			var onlyPathLocation = [];
			for (; i < pathLen; i++) {
				if(path[i].id == 0) {
					onlyPathLocation[onlyPathLocation.length] =
					{
						location: {
							longitude: path[i].location.longitude,
							latitude: path[i].location.latitude
						},
						action: path[i].action
					};
				}
			};

			/*i = 0, pathLen = pathSliced.length;
			for (; i < pathLen; i++) {
				onlyPathLocation[onlyPathLocation.length] = {
					location: pathSliced[i].location,
					action: pathSliced[i].action
				}
			};*/

			var datas = {
				points: onlyPathLocation
			};

			ajaxCall('interestPointLocation', datas);
		}
	});

	$('#submitField').click(function() {
		if(fields.length > 0) {
			ajaxCall('fieldLocation');
		}
	});

	function ajaxCall(call, datas) {
		var route = false;
		var go    = true;
		if(datas === undefined) {
			datas = {};
		}
		if (call == 'droneLocation') {
			route = Routing.generate('drone_ajax_save_drone_location', {_locale: "fr"});
			go = false;
			loadingAnim.show("fast");
			droneList.forEach(function(dronePin) {
				var datas = {
					lat: dronePin.getLocation().latitude,
					lon: dronePin.getLocation().longitude,
					alt: dronePin.getPosition().altitude,
					id: dronePin.id
				};
				$.ajax({
					type: 'POST',
					url: route.toString(),
					data: datas,
					success: function(data) {
						console.log("succes !");
						toastr.success('Enregistrement réussi');
					}
				});
			});
			loadingAnim.hide("slow");
		}else if(call == 'interestPointLocation') {
			route = Routing.generate('drone_ajax_save_point_location', {_locale: "fr"});
		}else if(call == "fieldLocation") {
			console.log("Field Location");
			route = Routing.generate('drone_ajax_save_field_location', {_locale: "fr"});
			datas = {
				fieldCorners: fields
			};
			console.log(datas);
		}
		
		if (route != false && go) {
			loadingAnim.show("fast");
			$.ajax({
				type: 'POST',
				url: route.toString(),
				data: datas,
				success: function(data) {
					console.log("succes !");
					toastr.success('Enregistrement réussi');
				}
			});
			loadingAnim.hide("slow");
		}
	}

	/*==========  Requête pour la Météo  ==========*/

	function getWeatherDrone(la, lo) {
		if(typeof la === undefined || typeof lo === undefined) {
			return false;
		} else {
			loadingAnim.show("fast");
			$.ajax({
				type: 'get',
				url: "http://api.openweathermap.org/data/2.5/weather",
				data: {
					lat: la.toFixed(2),
					lon: lo.toFixed(2),
					lang: "fr",
					APPID: "c52c41cda0ea81049a945cbc5e878200"
				},
				success: function(data) {
					console.log(data);
					if(data.weather === undefined) {
						return false;
					}else{
						var sunrise = new Date(data.sys.sunrise * 1000);
						sunrise = sunrise.getHours() + ':' + fillZero(sunrise.getMinutes());
						var sunset = new Date(data.sys.sunset * 1000);
						sunset = sunset.getHours() + ':' + fillZero(sunset.getMinutes());
						$(".weather-main").text(data.weather[0].description);
						$(".weather-temp").text(kelvinToCelsius(data.main.temp));
						$(".weather-hum").text(data.main.humidity);
						$(".weather-wind").text(data.wind.speed);
						$(".weather-wind-dir").text(degToDir(data.wind.deg));
						$(".weather-sunrise").text(sunrise);
						$(".weather-sunset").text(sunset);
						setWeatherGlyph(data.weather[0].main, data.weather[0].icon);
						// Si le temps n'est pas propice à un vol on informe l'utilisateur
						if(!canFly(data.wind.speed, data.weather[0].main)) {
							$("#weather-war").addClass("glyphicon glyphicon-alert");
							toastr.warning('Le temps n\'est pas idéal pour un vol', 'Attention à la météo');
						}
						$("#weather").show("slow");
						loadingAnim.hide("slow");
						return true;
					}
				}
			});
		}
	}

	function setWeatherGlyph(weather, icon, id) {
		var weather = $("#weather-main");
		weather.removeClass();
		switch(weather) {
			case 'Clear':
				weather.addClass("wi wi-day-sunny");
			case 'Clouds':
				weather.addClass("wi wi-cloudy");
				break;
			case 'Rain':
				weather.addClass("wi wi-rain");
			default:
		}
		if(typeof icon !== undefined) {
			switch(icon) {
				case '01d':
					weather.addClass("wi wi-day-sunny");
					break;
				case '02d':
					weather.addClass("wi wi-day-cloudy");
					break;
				case '03d':
					weather.addClass("wi wi-cloudy");
					break;
				case '04d':
					weather.addClass("wi wi-cloudy");
					break;
				case '09d':
					weather.addClass("wi wi-rain");
					break;
				case '10d':
					$('#weather-main').addClass("wi wi-day-rain");
					break;
				case '11d':
					weather.addClass("wi wi-thunderstorm");
					break;
				case '13d':
					weather.addClass("wi wi-snow");
					break;
				case '50d':
					weather.addClass("wi wi-fog");
					break;
				default:
			}
		}

		if(typeof id !== undefined) {
			switch(id) {
				case 802:
					break;
				case 803:
					break;
				case 804:
					break;
				default:

			}
		}
	}

	function canFly(speedWind, main) {
		if(speedWind > 30) {
			return false;
		}

		// Weather condition
		var wc = main.toLowerCase();
		if(wc.indexOf('rain') > -1 || wc.indexOf('snow') > -1) {
			return false;
		}

		return true;
	}

	function kelvinToCelsius(t) {
		var cel = t - 273.15;
		return Math.round(cel);
	}

	function msToKmh(v) {
		return Math.round(v*1000/3600);
	}

	function fillZero(number) {
		if(number < 10){
			return '0' + number;
		}else {
			return number;
		}
	}

	function degToDir(d) {
		// On s'assure du fait que le paramètre est bien en degrée.
		d %= 360;
		var direction = "";
		if(		 d >= 348.75 && d < 11.25) {
			direction = 'Nord';
		}else if(d >= 11.25  && d < 33.75) {
			direction = 'Nord-Nord-Est';
		}else if(d >= 33.75  && d < 56.25) {
			direction = 'Nord-Est';
		}else if(d >= 56.25  && d < 78.75) {
			direction = 'Est-Nord-Est';
		}else if(d >= 78.75  && d < 101.25) {
			direction = 'Est';
		}else if(d >= 101.25 && d < 123.75) {
			direction = 'Est-Sud-Est';
		}else if(d >= 123.75 && d < 146.25) {
			direction = 'Sud-Est';
		}else if(d >= 146.25 && d < 168.75) {
			direction = 'Sud-Sud-Est';
		}else if(d >= 168.75 && d < 191.25) {
			direction = 'Sud';
		}else if(d >= 191.25 && d < 213.75) {
			direction = 'Sud-Sud-Ouest';
		}else if(d >= 213.75 && d < 236.25) {
			direction = 'Sud-Ouest';
		}else if(d >= 236.25 && d < 258.75) {
			direction = 'Ouest-Sud-Ouest';
		}else if(d >= 258.75 && d < 281.25) {
			direction = 'Ouest';
		}else if(d >= 281.25 && d < 303.75) {
			direction = 'Ouest-Nord-Ouest';
		}else if(d >= 303.75 && d < 326.25) {
			direction = 'Nord-Ouest';
		}else if(d >= 326.25 && d < 348.75) {
			direction = 'Nord-Nord-Ouest';
		}
        $("#weather-wind-direction").removeClass().addClass("wi wi-up");
		rotate(d);
		return direction;
	}

	function rotate(degrees) {
		$("#weather-wind-direction").css(
			{
				'-webkit-transform': 'rotate('+ degrees +'deg)',
				'-moz-transform': 	 'rotate('+ degrees +'deg)',
				'-ms-transform': 	 'rotate('+ degrees +'deg)',
				'transform': 		 'rotate('+ degrees +'deg)'
			}
		);
		return $(this);
    }

    function changeColorPin(action) {
		var options;
		switch(action) {
			case 'photo':
				options = {
					// #4647cb
					fillColor: { a: 150, r: 70, g: 71, b: 203 },
					strokeColor: { a: 200, r: 20, g: 20, b: 20 },
					infobox: "point",
					visible: true
				};
				break;
			case 'sound':
				options = {
					// #f54735
					fillColor: { a: 150, r: 245, g: 71, b: 53 },
					strokeColor: { a: 200, r: 20, g: 20, b: 20 },
					infobox: "point",
					visible: true
				};
				break;
			case 'video':
				options = {
					// #f5ab35
					fillColor: { a: 150, r: 245, g: 171, b: 53 },
					strokeColor: { a: 200, r: 20, g: 20, b: 20 },
					infobox: "point",
					visible: true
				};
				break;
			case 'nothing':
				options = {
					// #ffffff;
					fillColor: { a: 150, r: 255, g: 255, b: 255 },
					strokeColor: { a: 200, r: 20, g: 20, b: 20 },
					infobox: "point",
					visible: true
				};
				break;
			default:
				options = {
					fillColor: { a: 150, r: 255, g: 255, b: 255 },
					strokeColor: { a: 200, r: 20, g: 20, b: 20 },
					infobox: "point",
					visible: true
				};
				break;
		}
		return options;
	}
});
