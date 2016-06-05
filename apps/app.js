angular.module("FlickrApp", ['ngAnimate'])

.controller("FlickrCtrl", ['$timeout', '$q', '$http', function($timeout, $q, $http){
	var vm = this;
	vm.initMap = initMap;
	vm.searchFlickr = searchFlickr;

	vm.initMap();
	// vm.north = 33;
	// vm.south = 42;
	// vm.east = -91;
	// vm.west = -107;
	// console.log(vm.map);

	function initMap() {
        vm.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 39, lng: -99},
          zoom: 2
          	// center: {lat: 40, lng: -73},
          	// zoom: 8
        });
        var bounds = {
		    // north: 33,
		    // south: 42,
		    // east: -91,
		    // west: -107
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
        console.log(vm.map);
        console.log(vm.rectangle);
        vm.rectangle.addListener("bounds_changed", function(){
        	//Obj order: south, north, east, west?
        	var bounds = vm.rectangle.getBounds();
        	vm.south = bounds.H.H;
        	vm.north = bounds.H.j;
        	vm.east = bounds.j.H;
        	vm.west = bounds.j.j;
        	console.log(vm.south);
        	console.log(vm.north);
        	console.log(vm.east);
        	console.log(vm.west);

        });


      }

	function searchFlickr(tag) {
		vm.results = undefined;
		vm.tagToSearch = vm.tag;
		vm.tagToSearch = tag;
		vm.notifyResults = false;
		vm.error = false;
		vm.notifySearch = true;

		// initMap();

		var url = "https://api.flickr.com/services/rest",
		params = {
			method: "flickr.photos.search",
			api_key: "a35c104c1a7f9762e0f6cdf064f39657",
			tags: "outdoor, -people, -portrait, "+ tag,
			tag_mode: "all",
			bbox: vm.west+", "+vm.south+", "+vm.east+", "+vm.north,
			// bbox: [vm.west, vm.south, vm.east, vm.north],
			safe_search: 1,
			format: "json",
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
			console.log(vm.results);
			
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