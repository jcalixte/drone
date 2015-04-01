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
	
	var dronePin           = false;
	var currentDroneAction = false;
	var droneSpeedKmH      = 40;
	//var droneSpeedKmH    = 40*4;
	var droneSpeed         = msToKmh(droneSpeedKmH);
	var iDrone             = 0;
	const numberOfDrones   = 1;

	var twigElements = false;

	$("#search").click(function() {
		var query = $("#search_query").val();
		if(query != "") {
			searchModule(query);
		}
	});

	$("#rectangleChoice").click(function(e) {
		e.preventDefault();
		$(this).toggleClass('active').trigger('fieldChoice');
		if($(this).hasClass('active')) {
			$(this).text("Finir votre contour");
		}else{
			$(this).text("Détourer votre terrain");
		}
		return false;
	});

	$("#interestPoint").click(function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
		if($(this).hasClass('active')) {
			$(this).text("Finir");
		}else{
			$(this).text("Point de passage");
		}
	});

	$("#putDrone").click(function (e) {
		e.preventDefault();
		$(this).toggleClass('active');
		if($(this).hasClass('active')) {
			$(this).text("Finir");
		}else{
			$(this).text("Placer votre drone");
		}
	});

	$("#start").click(function() {
		moveDrone();
	});

	$("#droneCentered").click(function() {
		if (dronePin != false) {
			var options = map.getOptions();
			options.center = dronePin.getLocation();
			options.zoom   = 18;
			map.setView(options);
		}
	});

	$(".selectAction").click(function() {
		$("#actionTaken").text($(this).attr('id'));
	});

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
			})
		});
		$.ajax({
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_fields'),
			data: {
				points: pointsInFields,
			},
			success: function(data) {
				console.log("succes !");
				toastr.success('Enregistrement réussi');
				polyFields.forEach(function(e) {
					map.entities.remove(e);
				});
				shapePointLocation.forEach(function(e) {
					var index = -1;
					if(dronePin == false ||
						(e.location.latitude != dronePin.latitude && e.location.longitude != dronePin.longitude)) {
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
	});

	$('#deleteInterestPoints').click(function() {
		toastr.info('Enregistrement réussi');
		$.ajax({
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_interest_points'),
			//data: datas,
			success: function(data) {
				console.log("succes !");
				toastr.success('Enregistrement réussi');
				path.forEach(function(e) {
					if(dronePin == false ||
						(e.location.latitude != dronePin.latitude && e.location.longitude != dronePin.longitude)) {
						map.entities.remove(e.shape);
					}
				});
				path.length = 0;
			}
		});
	});

	$('#deleteDrones').click(function() {
		$.ajax({
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_drones'),
			//data: datas,
			success: function(data) {
				console.log("succes !");
				toastr.success('Enregistrement réussi');
				map.entities.remove(dronePin);
				dronePin = false;
			}
		});
	});

	/*==========  Évènements  ==========*/

	$(document).on('fieldChoice', function() {
		if($("#rectangleChoice").hasClass('active')) {
			handleClick = Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
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
	
	mapAction = function(pTwigElements, droneEntities, fieldEntities, interestPointEntities, queryAddress) {

		iDrone = droneEntities.length;
		if(!twigElements) {
			twigElements = pTwigElements;
		}

		var loc             = false;
		var dronePinOptions = {
			icon: twigElements['quadcopter'], 
			width: 50, 
			height: 50, 
			anchor: new Microsoft.Maps.Point(25,25)
		};

		droneEntities.forEach(function(e) {
			loc = new Microsoft.Maps.Location(
				e.latitude, 
				e.longitude
			);
			dronePin = new Microsoft.Maps.Pushpin(loc, dronePinOptions);
			map.entities.push(dronePin);
			
		});

		fieldEntities.forEach(function(e) {
			e.forEach(function(e) {
				addPointToShape(e.latitude, e.longitude, true);
			});
			addShape();
		});

		interestPointEntities.forEach(function(e) {
			addCircle(0.000001, e.location);
			path[path.length] = e;
		});

		//Ajout de modules utilisés
		var handleClick = false;
		Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: function() {
				search_engine_loaded = true;
				var query = queryAddress;
				if(query != "") {
					searchModule(query);
				}
			}
		});
		Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes', { callback: function() {
				advanced_shapes_loaded = true;
			}
		});

		if(dronePin != false) {
			getWeatherDrone(dronePin.getLocation().latitude, dronePin.getLocation().longitude);
		}
	}

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

	function searchError(searchRequest)
	{
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
				fillColor: {
					a: 50,
					r: 0,
					g: 0,
					b: 0
				},
				strokeColor: {
					a: 200,
					r: 255,
					g: 255,
					b: 255
				},
				infobox: "field",
				visible: true,
			});
			// Suppression des points
			for (var i = 0; i < pinTable.length; i++) {
				map.entities.remove(pinTable[i]);
			};
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
				shape: addCircle(0.000001, loc),
				id: 0,
			};
		}
	}

	function addCircle(radius, location) {
		var backgroundColor = new Microsoft.Maps.Color(10, 100, 0, 0);
		var borderColor     = new Microsoft.Maps.Color(150, 200, 0, 0);
		//var R               = 6371; // Rayon de la terre en kilomètres
		var lat             = (location.latitude  * Math.PI) / 180;     
		var lon             = (location.longitude * Math.PI) / 180;
		var d               = parseFloat(radius);// / R;
		var circlePoints    = [];

		for (x = 0; x <= 360; x += 5) {
			var position = new Microsoft.Maps.Location(0, 0);
			xRadian = x * Math.PI / 180;
			position.latitude = Math.asin(Math.sin(lat)
							  * Math.cos(d)
							  + Math.cos(lat)
							  * Math.sin(d)
							  * Math.cos(xRadian));

			position.longitude = ((lon + Math.atan2(Math.sin(xRadian)
								 * Math.sin(d)
								 * Math.cos(lat),Math.cos(d)
								 - Math.sin(lat)
								 * Math.sin(position.latitude))) * 180) / Math.PI;
			position.latitude  = (position.latitude * 180) / Math.PI;
			circlePoints.push(position);
		}

		var polygon = new Microsoft.Maps.Polygon(circlePoints.slice());
		circlePoints.length = 0;

		polygon.setOptions({
			fillColor: {
				a: 150,
				r: 255,
				g: 255,
				b: 255
			},
			strokeColor: {
				a: 200,
				r: 20,
				g: 20,
				b: 20
			},
			infobox: "point",
			visible: true,
		});

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
			dronePin = new Microsoft.Maps.Pushpin(loc, dronePinOptions);
			map.entities.push(dronePin);
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
		}else{
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
		if(dronePin != false) {
			var pathSliced = path.slice();
			if (pathSliced[pathSliced.length-1] != dronePin.getLocation()) {
				pathSliced[pathSliced.length] = {
					location: dronePin.getLocation(),
					action: 'nothing',
				};
			};
			$("#inAction").text('Flying');
			dronePin.moveLocation(dronePin.getLocation(), pathSliced, droneSpeed);
		}
	}

	/*==========  Fonctions AJAX  ==========*/
	$('#submitDroneLocation').click(function() {
		if(dronePin != false) {
			ajaxCall('droneLocation');
		}
	});

	$('#submitInterestPoint').click(function() {
		// On filtre les nouveaux points rajoutés
		if(path.length > 0) {
			var i = 0, pathLen = pathSliced.length;
			var onlyPathLocation = [];
			for (; i < pathLen; i++) {
				if(path[i].id == 0) {
					onlyPathLocation[onlyPathLocation.length] = pathSliced[i];
				}
			};

			/*i = 0, pathLen = pathSliced.length;
			for (; i < pathLen; i++) {
				onlyPathLocation[onlyPathLocation.length] = {
					location: pathSliced[i].location,
					action: pathSliced[i].action
				}
			};*/

			datas = {
				points: onlyPathLocation,
			}
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
		if(datas === undefined) {
			datas = {};
		}
		if (call == 'droneLocation') {
			route = Routing.generate('drone_ajax_save_drone_location');
			datas = {
				lat: dronePin.getLocation().latitude,
				lon: dronePin.getLocation().longitude
			} 
		}else if(call == 'interestPointLocation') {
			route = Routing.generate('drone_ajax_save_point_location');
		}else if(call == "fieldLocation") {
			route = Routing.generate('drone_ajax_save_field_location');
			datas = {
				fieldCorners: fields,
			};
		}
		if(route != false) {
			$.ajax({
				type: 'POST',
				url: route,
				data: datas,
				success: function(data) {
					console.log("succes !");
					toastr.success('Enregistrement réussi');
				}
			});
		}
	}

	/*==========  Requête pour la météo  ==========*/

	function getWeatherDrone(la, lo) {
		if(typeof la === undefined || typeof lo == undefined) {
			return false;
		}else{
			$.ajax({
				type: 'get',
				url: "http://api.openweathermap.org/data/2.5/weather",
				data: {
					lat: la.toFixed(2),
					lon: lo.toFixed(2),
					lang: "fr",
					APPID: "c52c41cda0ea81049a945cbc5e878200",
				},
				success: function(data) {
					console.log(data);
					if(data.weather === undefined) {
						return false;
					}else{
						var sunrise = new Date(data.sys.sunrise * 1000);
						sunrise = sunrise.getHours() + ':' + sunrise.getMinutes();
						var sunset = new Date(data.sys.sunset * 1000);
						sunset = sunset.getHours() + ':' + sunset.getMinutes();
						$(".weather-main").text(data.weather[0].description);
						$(".weather-temp").text(kelvinToCelsius(data.main.temp));
						$(".weather-hum").text(data.main.humidity);
						$(".weather-wind").text(data.wind.speed);
						$(".weather-wind-dir").text(degToDir(data.wind.deg));
						$(".weather-sunrise").text(sunrise);
						$(".weather-sunset").text(sunset);
						setWeatherGlyph(data.weather[0].main);
						$(".weather-content").show("slow");
						return true;
					}
				}
			});
		}
	}

	function setWeatherGlyph(w) {
		switch(w) {
			case 'Clouds':
				$("#weather-main").removeClass();
				$("#weather-main").addClass("wi wi-cloudy");
				break;
			case 'Rain':
				$("#weather-main").removeClass();
				$("#weather-main").addClass("wi wi-rain");
			default:
		}
	}

	function kelvinToCelsius(t) {
		var cel = t - 273.15;
		return Math.round(cel);
	}

	function msToKmh(v) {
		return Math.round(v*1000/3600);
	}

	function degToDir(d) {
		// On s'assure du fait que le paramètre est bien en degrée.
		d %= 360;
		console.log(d);
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
		$("#weather-wind-direction").removeClass();
		$("#weather-wind-direction").addClass("wi wi-wind-default _0-deg");
		rotate(d);
		return direction;
	}

	function rotate(degrees) {
		console.log(degrees);
		$("#weather-wind-direction").css(
			{
				'-webkit-transform': 'rotate('+ degrees +'deg)',
				'-moz-transform': 'rotate('+ degrees +'deg)',
				'-ms-transform': 'rotate('+ degrees +'deg)',
				'transform': 'rotate('+ degrees +'deg)'
			}
		);
		return $(this);
	};
});