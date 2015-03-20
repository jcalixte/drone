$(function(){
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

	var dronePin           = false;
	var currentDroneAction = false;
	var droneSpeedKmH      = 40;
	//var droneSpeedKmH    = 40*4;
	var droneSpeed         = Math.round(droneSpeedKmH*1000/3600);
	var iDrone             = 0;
	const numberOfDrones   = 1;

	var twigElements = false;

	$("#search").click(function(){
		var query = $("#search_query").val();
		if(query != ""){
			searchModule(query);
		}
	});

	$("#rectangleChoice").click(function(e){
		e.preventDefault();
		$(this).toggleClass('active').trigger('fieldChoice');
		if($(this).hasClass('active')){
			$(this).text("Finir votre contour");
		}else{
			$(this).text("Détourer votre terrain");
		}
		return false;
	});

	$("#interestPoint").click(function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			$(this).text("Finir");
		}else{
			$(this).text("Point de passage");
		}
	});

	$("#putDrone").click(function (e) {
		e.preventDefault();
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
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

	$(".selectAction").click(function(){
		$("#actionTaken").text($(this).attr('id'));
	});

	/*==========  Suppressions  ==========*/
	$('#deleteFields').click(function() {
		var pointsInFields = [];
		var shapePointLocation  = [];
		var progress       = 0;
		var ratio          = 1;

		polyFields.forEach(function(p) {
			path.forEach(function(e) {
				if(isInPolygon(p, e['location'])){
					pointsInFields.push(e['location']);
					shapePointLocation.push(e);
				}
			})
		});
		$('.progress-bar').width('0%');
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				xhr.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						if(!$('.progress').is(":visible")){
							$('.progress').show();
						}
						progress += Math.round(percentComplete)*100 * ratio;
						$('.progress-bar').width(progress + '%');
					}
				}, false);

				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {  
						var percentComplete = evt.loaded / evt.total;
						if(!$('.progress').is(":visible")){
							$('.progress').show();
						}
						progress += Math.round(percentComplete)*100 * (1-ratio);
						$('.progress-bar').width(progress + '%');
					}
				}, false);
				return xhr;
			},
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_fields'),
			data: {
				points: pointsInFields,
			},
			success: function(data){
				progress = 0;
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
					if(index > -1){
						path.splice(index, 1);
					}
				});
				polyFields.length = 0;
			}
		});
	});

	$('#deleteInterestPoints').click(function() {
		var progress = 0;
		var ratio = 1;
		$('.progress-bar').width('0%');
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				xhr.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						if(!$('.progress').is(":visible")){
							$('.progress').show();
						}
						progress += Math.round(percentComplete)*100 * ratio;
						$('.progress-bar').width(progress + '%');
					}
				}, false);
				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {  
						var percentComplete = evt.loaded / evt.total;
						if(!$('.progress').is(":visible")){
							$('.progress').show();
						}
						progress += Math.round(percentComplete)*100 * (1-ratio);
						$('.progress-bar').width(progress + '%');
					}
				}, false);
				return xhr;
			},
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_interest_points'),
			//data: datas,
			success: function(data){
				progress = 0;
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
		var progress = 0;
		var ratio = 1;
		$('.progress-bar').width('0%');
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				xhr.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						if(!$('.progress').is(":visible")){
							$('.progress').show();
						}
						progress += Math.round(percentComplete)*100 * ratio;
						$('.progress-bar').width(progress + '%');
					}
				}, false);

				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {  
						var percentComplete = evt.loaded / evt.total;
						if(!$('.progress').is(":visible")){
							$('.progress').show();
						}
						progress += Math.round(percentComplete)*100 * (1-ratio);
						$('.progress-bar').width(progress + '%');
					}
				}, false);

				return xhr;
			},
			type: 'POST',
			url: Routing.generate('drone_ajax_delete_drones'),
			//data: datas,
			success: function(data){
				progress = 0;
				map.entities.remove(dronePin);
				dronePin = false;
			}
		});
	});

	/*==========  Évènements  ==========*/

	$(document).on('fieldChoice', function(){
		if($("#rectangleChoice").hasClass('active')){
			handleClick = Microsoft.Maps.Events.addHandler(map, 'click', function(e){
				if(e.targetType == "map"){
					var point = new Microsoft.Maps.Point(e.getX(), e.getY());
					var loc = e.target.tryPixelToLocation(point);
					addPointToShape(loc.latitude, loc.longitude);
				}
			});
		}else{
			if(handleClick !== false){
				Microsoft.Maps.Events.removeHandler(handleClick);
				handleClick = false;
			}
			addShape();
		}
	});

	Microsoft.Maps.Events.addHandler(map, 'mouseover', changeCursor);
	Microsoft.Maps.Events.addHandler(map, 'click', changeCursorClick);

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
			//console.log(dronePin);
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
		Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: function(){
				search_engine_loaded = true;
				var query = queryAddress;
				if(query != ""){
					searchModule(query);
				}
			}
		});
		Microsoft.Maps.loadModule('Microsoft.Maps.AdvancedShapes', { callback: function(){
				advanced_shapes_loaded = true;
			}
		});
	}

	/*==========  Fonctions  ==========*/

	function searchModule(q){
		if(search_engine_loaded){
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

	function searchGeoCallback(geocodeResult, userData){
		map.setView({
			bounds: geocodeResult.results[0].bestView
		});
	}

	function searchError(searchRequest)
	{
		alert("An error occurred.");
	}

	function addPointToShape(lat, lon, loading){
		if(typeof loading == undefined){
			loading = false;
		}
		shape[shape.length] = new Microsoft.Maps.Location(lat, lon);
		var loc = new Microsoft.Maps.Location(lat, lon);

		if(!loading){
			// Add a pin to the map
			pinTable[pinTable.length] = new Microsoft.Maps.Pushpin(loc); 
			map.entities.push(pinTable[pinTable.length-1]);
		}
	}

	function addShape(){
		if(shape.length > 0){
			// On ferme la forme avec le premier point si ce n'est pas déjà fait.
			if(shape[0] != shape[shape.length-1]){
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

	function addCircleEvent(e){
		if($("#interestPoint").hasClass('active')){
			var point = new Microsoft.Maps.Point(e.getX(), e.getY());
			var loc = map.tryPixelToLocation(point);
			path[path.length] = {
				location: loc,
				action: $("#actionTaken").text(),
				shape: addCircle(0.000001, loc),
			};
		}
	}

	function addCircle(radius, location){ //latitude, longitude){
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

	function addDronePin(e){
		if($("#putDrone").hasClass('active')){
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
			if(iDrone >= numberOfDrones){
				$("#putDrone").remove();
			}
		}
	}

	function changeCursor(e){
		var crosshair = $("#rectangleChoice").hasClass('active') ||
						$("#interestPoint").hasClass('active')   ||
						$("#putDrone").hasClass('active');
		if(crosshair){
			map.getRootElement().style.cursor = 'crosshair';
		}else{
			map.getRootElement().style.cursor = 'grab';
		}
	}

	function changeCursorClick(e){
		var crosshair = $("#rectangleChoice").hasClass('active') ||
						$("#interestPoint").hasClass('active')   ||
						$("#putDrone").hasClass('active');
		if(crosshair){
			map.getRootElement().style.cursor = 'crosshair';
		}else{
			map.getRootElement().style.cursor = 'grab';
		}
		addDronePin(e);
	}

	function isInPolygon(polygon, pin){
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

	function getCentroid(polygon){
		if(typeof polygon == undefined){
			return false;
		}else{
			var points            = polygon.getLocations();
			var latitudeCentroid  = 0;
			var longitudeCentroid = 0;
			points.forEach(function(e){
				latitudeCentroid  += e.latitude;
				longitudeCentroid += e.longitude;
			});
			latitudeCentroid  /= points.length;
			longitudeCentroid /= points.length;

			return new Microsoft.Maps.Location(latitudeCentroid, longitudeCentroid);
		}
	}

	/*==========  Fonctions pour animer le drone  ==========*/

	function moveDrone(){
		if(dronePin != false){
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
	$('#submitDroneLocation').click(function(){
		if(dronePin != false){
			ajaxCall('droneLocation');
		}
	});

	$('#submitInterestPoint').click(function(){
		console.log(path);
		if(path.length > 0){
			var onlyPathLocation = [];
			path.forEach(function(e){
				onlyPathLocation[onlyPathLocation.length] = {
					location: e.location,
					action: e.action
				}
			});
			datas = {
				points: onlyPathLocation,
			}
			ajaxCall('interestPointLocation', datas);
		}
	});

	$('#submitField').click(function(){
		if(fields.length > 0){
			ajaxCall('fieldLocation');
		}
	});

	function ajaxCall(call, datas){
		var route = false;
		if(datas === undefined){
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
		if(route != false){
			var progress = 0;
			var ratio = 1/2;
			$('.progress-bar').width('0%');
			$.ajax({
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.addEventListener("progress", function(evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							if(!$('.progress').is(":visible")){
								$('.progress').show();
							}
							progress += Math.round(percentComplete)*100 * ratio;
							$('.progress-bar').width(progress + '%');
						}
					}, false);

					xhr.addEventListener("progress", function(evt){
						if (evt.lengthComputable) {  
							var percentComplete = evt.loaded / evt.total;
							if(!$('.progress').is(":visible")){
								$('.progress').show();
							}
							progress += Math.round(percentComplete)*100 * (1-ratio);
							$('.progress-bar').width(progress + '%');
						}
					}, false);

					return xhr;
				},
				type: 'POST',
				url: route,
				data: datas,
				success: function(data){
					progress = 0;
				}
			});
		}
	}
});