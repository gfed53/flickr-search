angular.module("FlickrApp", ['ngAnimate'])
.controller("FlickrCtrl", ['$scope', '$timeout', '$q', '$http', function($scope, $timeout, $q, $http){
	$scope.initMap = initMap;
	$scope.initMap();
	// console.log($scope.map);

	function initMap() {
        $scope.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40, lng: -73},
          zoom: 8
        });
        var bounds = {
		    north: 41,
		    south: 40,
		    east: -73,
		    west: -74
		  };

		$scope.rectangle = new google.maps.Rectangle({
			bounds: bounds,
			editable: true,
			draggable: true
		});

		$scope.rectangle.setMap($scope.map);
        console.log($scope.map);
        console.log($scope.rectangle);


      }

	$scope.searchFlickr = function(tag){
		$scope.results = undefined;
		
		$scope.tagToSearch = $scope.tag;
		$scope.tagToSearch = tag;
		$scope.notifyResults = false;
		$scope.error = false;
		$scope.notifySearch = true;

		initMap();

		var url = "https://api.flickr.com/services/rest",
		params = {
			method: 'flickr.photos.search',
			api_key: "a35c104c1a7f9762e0f6cdf064f39657",
			tags: tag,
			format: 'json',
			nojsoncallback: 1
		};

		$http({
			method: 'GET',
			url: url,
			params: params
		})
		.then(function(response){
			$scope.notifySearch = false;
			$scope.notifyResults = true;
			$scope.results = response.data.photos.photo;
			
		},
		function(response){
			alert('Sorry, an error occurred.');
			$scope.error = true;
		})
		.then(function(){
			$scope.tag = "";
		});
	};
}])
.run(function(){
	// var map;
	// function initMap() {
 //        map = new google.maps.Map(document.getElementById('map'), {
 //          center: {lat: 40, lng: 73},
 //          zoom: 8
 //        });
 //      }

 //    initMap();
 //    console.log(map);
})