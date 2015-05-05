var canvas, ctx;
var WIDTH = 500, HEIGHT = 500;
var points = [];
var running;
var canvasMinX, canvasMinY;
var doPreciseMutate;

var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

var ITERATION = 100;
var current_i = 0;

$(function() {
	/*
	$('#addRandom_btn').click(function() {
		addRandomPoints(50);
		$('#status').text("");
		running = false;
	});

	$('#clear_btn').click(function() {
		running === false;
		initData();
		points = new Array();
	});

	$('#stop_btn').click(function() {
		if(running === false && currentGeneration !== 0){
			running = true;
		} else {
			running = false;
		}
	});
	*/

	TSP = function (path) {
		//init(); Inutile sans canvas.
		initData(path.length);
		points = path;
		ITERATION = Math.max(3 * points.length + 1, 100);
		if(points.length >= 3) {
			GAInitialize();
			running = true;
			TSP_Path = draw();
			return TSP_Path;
		}else {
			//alert("add some more points to the map!");
			return false;
		}
	};

	initData = function (size) {
		running               = false;
		POPULATION_SIZE       = size;
		ELITE_RATE            = 0.3;
		CROSSOVER_PROBABILITY = 0.9;
		MUTATION_PROBABILITY  = 0.01;
		UNCHANGED_GENS        = 0;
		mutationTimes         = 0;
		doPreciseMutate       = true;
		
		bestValue         = undefined;
		best              = [];
		currentGeneration = 0;
		currentBest;
		population        = [];
		values            = new Array(POPULATION_SIZE);
		fitnessValues     = new Array(POPULATION_SIZE);
		roulette          = new Array(POPULATION_SIZE);

		current_i = 0;
	};

	draw = function () {
		while(running && current_i <= ITERATION) {
			current_i++;
			GANextGeneration();
			/*
			$('#status').text("There are " + points.length + " cities in the map, "
				+ "the " + currentGeneration + "th generation with "
				+ mutationTimes + " times of mutation. best value: "
				+ bestValue);
			*/
		}
		return best;
	};
});

	/*
	init = function () {
		// ctx    = $('#canvas')[0].getContext("2d");
		// WIDTH  = $('#canvas').width();
		// HEIGHT = $('#canvas').height();
		setInterval(draw, 10);
		// init_mouse();
	};

	addRandomPoints function (number) {
		running = false;
		for(var i = 0; i<number; i++) {
			points.push(randomPoint());
		}
	}
	function drawCircle(point) {
		ctx.fillStyle   = '#000';
		ctx.beginPath();
		ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
	function drawLines(array) {
		ctx.strokeStyle = '#f00';
		ctx.lineWidth = 1;
		ctx.beginPath();

		ctx.moveTo(points[array[0]].x, points[array[0]].y);
		 
		ctx.lineTo(points[array[0]].x, points[array[0]].y);

		ctx.stroke();
		ctx.closePath();
	}
	function draw_base() {
		if(running && current_i <= ITERATION) {
			current_i++;
			console.log(current_i);
			GANextGeneration();
		} else {
			$(this).trigger('fieldChoice');
		}
		$('#status').text("There are " + points.length + " cities in the map, "
							+ "the " + currentGeneration + "th generation with "
							+ mutationTimes + " times of mutation. best value: "
							+ ~~(bestValue));
		// clearCanvas();
		if (points.length > 0) {
			for(var i=0; i<points.length; i++) {
				drawCircle(points[i]);
			}
			if(best.length === points.length) {
				drawLines(best);
			}
		}
	}

	function clearCanvas() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}

	function init_mouse() {
		$("canvas").click(function(evt) {
			if(!running) {
				canvasMinX = $("#canvas").offset().left;
				canvasMinY = $("#canvas").offset().top;
				$('#status').text("");

				x = evt.pageX - canvasMinX;
				y = evt.pageY - canvasMinY;
				points.push(new Point(x, y));
			}
		});
	}
	*/
/*================================================
=            Intégrer le TSP au drone            =
==================================================

- Ajouter un attribut path à chaque drone.
- Répartir les points entre les différents drones disponibles.
- Pour chaque chemin, réaliser le TSP

-------  End of Intégrer le TSP au drone  ------*/

