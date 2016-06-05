angular.module("FlickrApp", ['ngAnimate'])

.controller("FlickrCtrl", ['$timeout', '$q', '$http', function($timeout, $q, $http){
	var vm = this;
	vm.initMap = initMap;
	vm.searchFlickr = searchFlickr;
	vm.initMap();
	// console.log(vm.map);

	function initMap() {
        vm.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40, lng: -73},
          zoom: 8
        });
        var bounds = {
		    north: 41,
		    south: 40,
		    east: -73,
		    west: -74
		  };

		vm.rectangle = new google.maps.Rectangle({
			bounds: bounds,
			editable: true,
			draggable: true
		});

		vm.rectangle.setMap(vm.map);
        console.log(vm.map);
        console.log(vm.rectangle);
        vm.rectangle.addListener("bounds_changed", function(){
        	console.log(vm.rectangle.getBounds());
        });


      }

	function searchFlickr(tag) {
		vm.results = undefined;
		vm.tagToSearch = vm.tag;
		vm.tagToSearch = tag;
		vm.notifyResults = false;
		vm.error = false;
		vm.notifySearch = true;

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
			vm.notifySearch = false;
			vm.notifyResults = true;
			vm.results = response.data.photos.photo;
			
		},
		function(response){
			alert('Sorry, an error occurred.');
			vm.error = true;
		})
		.then(function(){
			vm.tag = "";
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