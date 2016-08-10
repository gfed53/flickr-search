angular.module('FlickrApp', ['ngAnimate'])

.controller('FlickrCtrl', ['$scope', '$timeout', 'flInitMap', 'flSearchFlickr', 'flTranslate', 'flFilters', FlickrCtrl]);


function FlickrCtrl ($scope, $timeout, flInitMap, flSearchFlickr, flTranslate, flFilters){
	var vm = this;
	vm.initMap = initMap;
	vm.searchFlickr = searchFlickr;
	vm.translate = translate;
	vm.langs = flTranslate.langs;
	vm.lang = vm.langs[0];
	vm.outdoor = true;

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
		}
	}

	function translate(tag, lang){
		flTranslate.translate(tag, lang)
		.then(function(response){
			vm.tag = response.data.text[0];
		}, function(error){
			
		});
	}

	function searchFlickr(tag, points) {
		vm.results = undefined;
		vm.tagToSearch = tag;
		var tagList = flFilters.checkOutdoor(tag, vm.outdoor);
		vm.notifyResults = false;
		vm.error = false;
		vm.notifySearch = true;

		flSearchFlickr(tagList, points).getResults()
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
	}
}


