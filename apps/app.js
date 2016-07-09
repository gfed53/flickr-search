angular.module('FlickrApp', ['ngAnimate'])

.controller('FlickrCtrl', ['$timeout', '$q', '$http', 'flInitMap', 'flSearchFlickr', FlickrCtrl]);


function FlickrCtrl ($timeout, $q, $http, flInitMap, flSearchFlickr){
	var vm = this;
	vm.initMap = initMap;
	vm.searchFlickr = searchFlickr;

	vm.initMap();

	function initMap() {
		var mapObj = flInitMap(update);
		vm.map = mapObj.map;
		vm.rectangle = mapObj.rectangle;
		update();

		function update(){
			var bounds = vm.rectangle.getBounds();
			vm.points = {
				south: bounds.f.f,
				north: bounds.f.b,
				east: bounds.b.f,
				west: bounds.b.b
			};
		};
	}

	function searchFlickr(tag, points) {
		vm.results = undefined;
		vm.tagToSearch = vm.tag;
		vm.tagToSearch = tag;
		vm.notifyResults = false;
		vm.error = false;
		vm.notifySearch = true;

		flSearchFlickr(tag, points).getResults()
		.then(function(response){
			vm.notifySearch = false;
			vm.notifyResults = true;
			vm.results = response.data.photos.photo;	
		},
		function(response){
			vm.error = true;
		})
		.then(function(){
			vm.tag = "";
		});
	};
};


