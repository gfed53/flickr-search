# Flickr 'round the World

## Live Demo

Here is a [live demo version](http://flickr-search-96860.herokuapp.com/) that you can jump right into and use. If you want to create your own build and/or learn more about the process, continue reading.

## About

Flickr 'round the World retrieves search results from Flickr's API using GET requests via AngularJS's $http service. Previously known as just plain old Flickr Searcher, this app was reformatted and redesigned to incorporate the Google Maps API. It allows the user to select a portion of the world and search for nature-based photos specifically taken from that area.

## Build Instructions

1. Make sure npm is installed, then in the terminal, run `npm i` to install all dependencies.

2. Before you start using the app, you will need to supply the app with API keys.

  * Navigate to config.js.

  * You should find the places where the API keys are needed: a Flickr key (flickrKey), a Google Key with the Maps API enabled for use (mapsKey), and a Yandex Translate Key (translateKey). Note that the translate key is not mandatory - you can still search normally, just without the ability to translate the tag.

  	* [Flickr API](https://www.flickr.com/services/api/)
  	* [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/)
  	* [Yandex Translate API](https://tech.yandex.com/translate/)

3. Once all dependencies are installed and everything is in place, you can run `gulp build` in the command line to create a build version.

4. You can serve the app locally by running `npm start`. The app listens at port 8080.

## The Process

Developing this app helped me learn more about API hacking using the AngularJS framework, as well as exploring the use of notifications throughout the search process which, utilizing scope, can be rendered and displayed within the view.

A very important thing I learned while developing this app is that developers have to keep track of any changes in the APIs they use. Unbeknownst to me, some of the property names in the Flickr API had been changed, completely breaking the functionality of my app. It was an easy fix, simply updating the changed names, but it just goes to show that developers always have to keep track of any updates within their dependencies. (Edit: this happened more than once!)

