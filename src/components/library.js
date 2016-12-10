(function(){
	angular.module('FlickrApp')

	.factory('flInitMap', [flInitMap])
	.factory('flSearchFlickr', ['$http', '$q', '$timeout', 'flTranslate', 'flModalGenerator', flSearchFlickr])
	.factory('flScrollTo', ['$location', '$anchorScroll', flScrollTo])
	.factory('flModalGenerator', ['$q', '$uibModal', flModalGenerator])
	.service('flTranslate', ['$http', '$q', flTranslate])
	.service('flFilters', [flFilters])

	//Initializes our map
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

	//Searches the Flickr API for photos based on tag
	function flSearchFlickr($http, $q, $timeout, flTranslate, flModalGenerator){
		return function(tag, points){

			var tagList;
			console.log(tag);
			if(typeof tag === undefined){
				tagList = '';
			} else {
				tagList = tag;
			}

			var url = 'https://api.flickr.com/services/rest',
			params = {
				method: 'flickr.photos.search',
				api_key: 'a35c104c1a7f9762e0f6cdf064f39657',
				tags: '-people, -portrait, '+tagList,
				tag_mode: 'all', //Results will have ALL tags user selects in search (not ANY tags) This is to keep it nature-based.
				bbox: points.west+', '+points.south+', '+points.east+', '+points.north,
				safe_search: 1,
				format: 'json',
				nojsoncallback: 1
			},
			emptyModalObj = flModalGenerator().getEmptyFieldTemplate();

			var services = {
				getResults: getResults,
				execute: execute
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

			function execute(){
				var deferred = $q.defer();
				if(!tagList){
					flModalGenerator().openModal(emptyModalObj)
					.then(function(){
						getResults()
						.then(function(results){
							deferred.resolve(results);
						})
					}, function(){
						deferred.reject();
					})
				} else {
					getResults()
					.then(function(results){
						deferred.resolve(results);
					})
				}

				return deferred.promise;
			}	
		};
	}

	//Translate service which allows user to translate the query before searching. This can used when searching in a non-English speaking area of the world. There may be pictures tagged in different languages that the user wouldn't otherwise be able to retrieve.
	function flTranslate($http, $q){
		var langs = [{
			label: 'English',
			value: ''
		}, {
			label: 'Albanian',
			value: 'sq'
		}, {
			label: 'Arabic',
			value: 'ar'
		}, {
			label: 'Bulgarian',
			value: 'bg'
		}, {
			label: 'Chinese',
			value: 'zh'
		}, {
			label: 'French',
			value: 'fr'
		}, {
			label: 'German',
			value: 'de'
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
			label: 'Korean',
			value: 'ko'
		}, {
			label: 'Russian',
			value: 'ru'
		}, {
			label: 'Slovakian',
			value: 'sf'
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

	//Allows user to choose whether they want their search to automatically include the 'outdoor' tag. This option is given even though it's a nature/outdoor-based search engine because, when the user makes a non-English search, having 'outdoor' still attached to the query defeats the whole purpose of a translated search.  
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

	//Upon search, page automatically scrolls to results
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

	function flModalGenerator($q, $uibModal){
		return function(){
			var services = {
				openModal: openModal,
				getEmptyFieldTemplate: getEmptyFieldTemplate
			};

			//Use this format
			var emptyFieldTemplate = {
				templateUrl: './modals/empty-field-modal.html',
				controller: 'emptyFieldModalController',
				controllerAs: 'emptyFieldModal'
			}

			function openModal(modalObj){
				var deferred = $q.defer();
				var modalInstance = $uibModal.open({
					templateUrl: modalObj.templateUrl,
					controller: modalObj.controller,
					controllerAs: modalObj.controllerAs
				});

				modalInstance.result.then(function(result){
						deferred.resolve(result);
					}, function(error){
						deferred.reject(error);
					});

					return deferred.promise;
				}

			function getEmptyFieldTemplate(){
				return emptyFieldTemplate;
			}

			return services;
		}
	}
})();

