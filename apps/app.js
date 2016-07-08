angular.module('FlickrApp', ['ngAnimate'])

.controller('FlickrCtrl', ['$timeout', '$q', '$http', function($timeout, $q, $http){
	var vm = this;
	vm.initMap = initMap;
	vm.searchFlickr = searchFlickr;

	vm.initMap();

	function initMap() {
        vm.map = new google.maps.Map(document.getElementById("map"), {
          center: {lat: 39, lng: -99},
          zoom: 2
        });
        
        var bounds = {
		    north: 42,
		    south: 37,
		    east: -88,
		    west: -97
		  };

		vm.rectangle = new google.maps.Rectangle({
			bounds: bounds,
			editable: true,
			draggable: true
		});

		vm.rectangle.setMap(vm.map);
        vm.rectangle.addListener("bounds_changed", function(){
        	var bounds = vm.rectangle.getBounds();
        	vm.south = bounds.f.f;
        	vm.north = bounds.f.b;
        	vm.east = bounds.b.f;
        	vm.west = bounds.b.b;
        });
      }

	function searchFlickr(tag) {
		vm.results = undefined;
		vm.tagToSearch = vm.tag;
		vm.tagToSearch = tag;
		vm.notifyResults = false;
		vm.error = false;
		vm.notifySearch = true;

		var url = "https://api.flickr.com/services/rest",
		params = {
			method: "flickr.photos.search",
			api_key: "a35c104c1a7f9762e0f6cdf064f39657",
			tags: "outdoor, -people, -portrait, "+ tag,
			tag_mode: "all",
			bbox: vm.west+", "+vm.south+", "+vm.east+", "+vm.north,
			safe_search: 1,
			format: "json",
			nojsoncallback: 1
		};

		$http({
			method: "GET",
			url: url,
			params: params
		})
		.then(function(response){
			vm.notifySearch = false;
			vm.notifyResults = true;
			vm.results = response.data.photos.photo;	
		},
		function(response){
			alert("Sorry, an error occurred.");
			vm.error = true;
		})
		.then(function(){
			vm.tag = "";
		});
	};
}])


