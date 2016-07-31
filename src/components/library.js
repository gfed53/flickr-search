angular.module('FlickrApp')

.factory('flInitMap', [flInitMap])
.factory('flSearchFlickr', ['$http', '$q', '$timeout', 'flTranslate', flSearchFlickr])
.service('flTranslate', ['$http', '$q', flTranslate])

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
			tags: 'outdoor, -people, -portrait, '+ tagList,
			tag_mode: 'all',
			bbox: points.west+', '+points.south+', '+points.east+', '+points.north,
			safe_search: 1,
			format: 'json',
			nojsoncallback: 1
		};

		var services = {
			// getTagList: getTagList,
			getResults: getResults,
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

		// function transSearch(){
		// 	var promises = [];
		// 	for(lang in langObj){
		// 		if(langObj[lang] != 'en' && langObj[lang]){
		// 			// console.log(langObj[lang]);
		// 			var promise = flTranslate().translate(tag, langObj[lang]);
		// 			promises.push(promise);
		// 			// flTranslate().translate(tag, langObj[lang]).then(function(response){
		// 			// 	console.log(response.data.text[0]);
		// 			// 	tagList += ', '+response.data.text[0]+', ';
		// 			// });
		// 			// tagList += ', outdoor, '
		// 		}
		// 	}

		// 	$q.all(promises).then(function(response){
		// 		console.log(response.data.text[0]);
		// 		tagList += ', '+response.data.text[0]+', ';
		// 		console.log(tagList);
		// 		return getResults();
		// 	});

		// 	return getResults();


		// }	
	};
}

function flTranslate($http, $q){
	// var tagList;

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

	function getTagList(){
		// return tagList;
	}

	this.translate = translate;
	this.translateAll = translateAll;
	this.getTagList = getTagList;
}





