L'optimisation du chemin
========================

La logique de toute la communication avec les drones se trouve dans le fichier MapScript.js

Qu'y a-t-il dedans ?
--------------
[MapScript.js][0] centralise toute l'algorithme lié à la cartographie :
* La connexion avec [Bing Maps API][1]
* La manipulation des données de l'utilisateur (drones, champs, points d'intérêt)
* Les interactions avec l'utilisateur sur la carte Bing Maps de la page /map
* L'optimisation du chemin pour chaque drone (voir mmTSP)
* La connexion à la météo avec l'API [Open Weather Map][2]

La fonction moveDrones s'occupe de répartir les points à chaque drone, de calculer le chemin optimal et de lancer les données JSON

```javascript
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
				dronePinList[drone.id].moveLocation(drone.id, drone.getLocation(), drone.path.slice(), droneSpeed); // On envoie le chemin aux drones pour qu'il soit exécuté.
			});

			droneList.forEach(function(drone) {
				drone.path = []; // On vide les listes associées aux drones
			});
		}else{
			loadingAnim.hide("slow");
		}
	}
```

[0]: /MapScript.js
[1]: https://msdn.microsoft.com/en-us/library/gg427610.aspx
[2]: http://openweathermap.org/