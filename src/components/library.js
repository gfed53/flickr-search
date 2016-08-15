angular.module('FlickrApp')

.factory('flInitMap', [flInitMap])
.factory('flSearchFlickr', ['$http', '$q', '$timeout', 'flTranslate', flSearchFlickr])
.factory('flScrollTo', ['$location', '$anchorScroll', flScrollTo])
.service('flTranslate', ['$http', '$q', flTranslate])
.service('flFilters', [flFilters])

function flInitMap(){
	return function(callback){
		var map = new google.maps.Map(document.getElementById('map'), {
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
		rectangle.addListener('bounds_changed', function(){
			callback();
		});

		var mapObj = {
			map: map,
			rectangle: rectangle
		};

		return mapObj;
	};
}

function flSearchFlickr($http, $q, $timeout, flTranslate){
	return function(tag, points){
		var tagList = tag;
		
		var url = 'https://api.flickr.com/services/rest',
		params = {
			method: 'flickr.photos.search',
			api_key: 'a35c104c1a7f9762e0f6cdf064f39657',
			tags: '-people, -portrait, '+tagList,
			tag_mode: 'all',
			bbox: points.west+', '+points.south+', '+points.east+', '+points.north,
			safe_search: 1,
			format: 'json',
			nojsoncallback: 1
		};

		var services = {
			getResults: getResults
		};
		
		return services;

		function getResults(){
			return $http({
				method: 'GET',
				url: url,
				params: params
			})
			.then(function(response){
				return $q.when(response);
			},
			function(response){
				alert('Sorry, an error occurred.');
			});
		}	
	};
}

function flTranslate($http, $q){
	var langs = [{
		label: 'English',
		value: ''
	}, {
		label: 'Arabic',
		value: 'ar'
	}, {
		label: 'Chinese',
		value: 'zh'
	}, {
		label: 'French',
		value: 'fr'
	}, {
		label: 'Hindi',
		value: 'hi'
	}, {
		label: 'Italian',
		value: 'it'
	}, {
		label: 'Japanese',
		value: 'ja'
	}, {
		label: 'Russian',
		value: 'ru'
	}, {
		label: 'Spanish',
		value: 'es'
	}];

	function translate(text, lang){
		var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate',
		request = {
			key: 'trnsl.1.1.20160728T161850Z.60e012cb689f9dfd.6f8cd99e32d858950d047eaffecf930701d73a38',
			text: text,
			lang: 'en-'+lang
			};

			return $http({
				method: 'GET',
				url: url,
				params: request
			})
			.then(function(response){
				return $q.when(response);
			}, function(){
				alert('Error retrieving translation. Did you select a language?')
			})
		}

	this.langs = langs;
	this.translate = translate;
}

function flFilters(){
	function checkOutdoor(tag, bool){
		if(bool){
			return tag+=', outdoor';
		} else {
			return tag;
		}
	}

	this.checkOutdoor = checkOutdoor;
}

function flScrollTo($location, $anchorScroll){
	return function(){
		var services = {
			scrollToElement: scrollToElement,
			checkScrollBtnStatus: checkScrollBtnStatus
		}

		return services;

		function scrollToElement(scrollId){
			$anchorScroll.yOffset = 45;
			var element = document.getElementById(scrollId);
			if(element){
				$location.hash(scrollId);
				$anchorScroll();
			} else {
				window.scroll(0, 0);
			}
		}

		function checkScrollBtnStatus(){
			if(window.scrollY > 100){
				return true;
			} else {
				return false;
			}
		}	
	}
}


