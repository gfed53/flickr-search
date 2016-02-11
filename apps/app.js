angular.module("FlickrApp", [])
.controller("FlickrCtrl", ['$scope', '$timeout', '$q', '$http', function($scope, $timeout, $q, $http){

	$scope.searchFlickr = function(tag){
		console.log("searching");
		$scope.tag = tag;
		$scope.notifySearch = true;
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
			console.log(response.data.photos.photo);
			$scope.results = response.data.photos.photo;
		},
		function(response){
			alert('error');
			$scope.error = true;
		});


	};
}]);