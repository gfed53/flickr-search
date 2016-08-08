angular.module('FlickrApp')

.factory('flInitMap', [flInitMap])
.factory('flSearchFlickr', ['$http', '$q', '$timeout', 'flTranslate', flSearchFlickr])
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
			// getTagList: getTagList,
			getResults: getResults,
			cTransAndResults: cTransAndResults
			// transSearch: transSearch
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

		function checkTrans(keyword, lang){
			var deferred = $q.defer();
			var string = '';
			if(lang){
				flTranslate.translate(keyword, lang)
				.then(function(response){
					var transKeyword = response.data.text[0];
					string += transKeyword+', ';
					flTranslate.translate('outdoor', lang)
					.then(function(second){
						var outdoor = second.data.text[0];
						string += outdoor;
						deferred.resolve(string);
					})
					
				});
			} else {
				deferred.resolve(keyword+', outdoor');
			}
			return deferred.promise;
		}

		function cTransAndResults(){
			var deferred = $q.defer();
			checkTrans(tag, lang).then(function(response){
				console.log(response);
				tagList = response;
				params.tags += response;
				getResults().then(function(response){
					deferred.resolve(response);
				})
			});

			return deferred.promise;
		}	
	};
}

function flTranslate($http, $q){
	// var tagList;
	var langs = [{
		label: 'English',
		value: ''
	}, {
		label: 'Spanish',
		value: 'es'
	}, {
		label: 'Russian',
		value: 'ru'
	}, {
		label: 'Japanese',
		value: 'ja'
	}];

	function translate(text, lang){
		console.log('running');
		var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate',
		request = {
			key: 'trnsl.1.1.20160728T161850Z.60e012cb689f9dfd.6f8cd99e32d858950d047eaffecf930701d73a38',
			text: text,
			lang: 'en-'+lang
				// callback: 'JSON_CALLBACK'
			};

			return $http({
				method: 'GET',
				url: url,
				params: request
			})
			.then(function(response){
				// console.log(response);
				// console.log(response.data.text[0]);
				return $q.when(response);
			}, function(){
				console.log('translate error');
				alert('Error retrieving translation. Did you select a language?')
			})
		}

	function translateAll(tag, list){
		var deferred = $q.defer();
		var tagList = tag;
		var langArray = [];
		console.log(tagList);
		console.log(list);
		// var deferred = $q.defer();
		for(lang in list){
			if(list[lang] != 'en' && list[lang]){
				langArray.push(list[lang]);
				// console.log(list[lang]);
				// translate(tag, list[lang]).then(function(response){
				// 	console.log(response.data.text[0]);
				// 	tagList += ', '+response.data.text[0]+', ';
				// 	console.log(tagList);
				// });
			}
		}

		console.log(langArray);
		var counter = langArray.length;
		console.log(counter);

		if(langArray.length === 0){
			deferred.reject("No translations were necessary.");
		}

		for(var i = 0; i<langArray.length; i++){
			translate(tag, langArray[i]).then(function(response){
				console.log(response.data.text[0]);
				tagList += ', '+response.data.text[0]+', ';
				console.log(tagList);
				counter--;
				console.log(counter);
					if(counter <= 0){
						console.log('should return: '+tagList);
						deferred.resolve(tagList);
					}
				});
		}

		return deferred.promise;
	}

	this.langs = langs;
	this.translate = translate;
	this.translateAll = translateAll;
	// this.getTagList = getTagList;
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



