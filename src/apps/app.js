angular.module('FlickrApp', ['ngAnimate'])

.controller('FlickrCtrl', ['$scope', '$timeout', 'flInitMap', 'flSearchFlickr', 'flTranslate', FlickrCtrl]);


function FlickrCtrl ($scope, $timeout, flInitMap, flSearchFlickr, flTranslate){
	var vm = this;
	// vm.tag = flTranslate.getTagList();
	vm.initMap = initMap;
	vm.searchFlickr = searchFlickr;
	vm.translate = translate;
	// vm.lang = {
	// 	english: 'en'
	// };

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
			console.log(response);
			console.log(response.data.text[0]);
			vm.tag = response.data.text[0];
		}, function(error){
			
		});
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
	}
}


