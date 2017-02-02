(function(){

	angular.module('FlickrApp', ['ngAnimate', 'ui.bootstrap'])

	.run(['$timeout', '$rootScope', 'flInitAPIs', function($timeout, $rootScope, flInitAPIs){
		flInitAPIs.check()
		.then(() => {
			//Do Nothing
		})
	}])

	.controller('FlickrCtrl', ['$scope', '$timeout', '$location', 'flInitMap', 'flSearchFlickr', 'flTranslate', 'flFilters', 'flScrollTo', 'flInitAPIs', FlickrCtrl]);


	function FlickrCtrl ($scope, $timeout, $location, flInitMap, flSearchFlickr, flTranslate, flFilters, flScrollTo, flInitAPIs){
		var vm = this;
		vm.initMap = initMap;
		vm.searchFlickr = searchFlickr;
		vm.translate = translate;
		vm.langs = flTranslate.langs;
		vm.lang = vm.langs[0];
		vm.outdoor = true;
		vm.scrollTo = scrollTo;

		$location.url('/');

		vm.userName = flInitAPIs.apisObj.id;
		vm.updateAPIs = flInitAPIs.update;

		$timeout(()=>{
			vm.initMap();
		}, 1200);
		
		function initMap() {
			var mapObj = flInitMap().init(update);
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
			vm.tagToSearch = (tag || '');
			var tagList = flFilters.checkOutdoor(vm.tagToSearch, vm.outdoor);
			vm.notifyResults = false;
			vm.error = false;
			vm.notifySearch = true;

			flSearchFlickr(tagList, points).execute()
			.then(function(response){
				vm.notifySearch = false;
				vm.notifyResults = true;
				vm.results = response.data.photos.photo;	
			},
			function(response){
				vm.error = true;
			})
			.then(function(){
				vm.tag = '';
				$timeout(function(){
					vm.scrollTo('results-section');
				}, 1000);	
			});
		}

		function scrollTo(scrollId){
			flScrollTo().scrollToElement(scrollId);
		}
	}
})();


