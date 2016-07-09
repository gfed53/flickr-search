angular.module('FlickrApp')

.factory('flInitMap', [flInitMap])
.factory('flSearchFlickr', ['$http', '$q', flSearchFlickr])

function flInitMap(){
	return function(callback){
		var map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: 39, lng: -99},
			zoom: 2
		});

		var bounds = {
			north: 42,
			south: 37,
			east: -88,
			west: -97
		};

		var rectangle = new google.maps.Rectangle({
			bounds: bounds,
			editable: true,
			draggable: true
		});

		rectangle.setMap(map);
		rectangle.addListener("bounds_changed", function(){
			callback();
		});

		var mapObj = {
			map: map,
			rectangle: rectangle
		}

		return mapObj;
	}
}

function flSearchFlickr($http, $q){
	return function(tag, points){
		var url = "https://api.flickr.com/services/rest",
		params = {
			method: "flickr.photos.search",
			api_key: "a35c104c1a7f9762e0f6cdf064f39657",
			tags: "outdoor, -people, -portrait, "+ tag,
			tag_mode: "all",
			bbox: points.west+", "+points.south+", "+points.east+", "+points.north,
			safe_search: 1,
			format: "json",
			nojsoncallback: 1
		};

		var services = {
			getResults: getResults
		};
		
		return services;

		function getResults(){
			return $http({
				method: "GET",
				url: url,
				params: params
			})
			.then(function(response){
				return $q.when(response);
			},
			function(response){
				alert("Sorry, an error occurred.");
			})
		}	
	}
}







