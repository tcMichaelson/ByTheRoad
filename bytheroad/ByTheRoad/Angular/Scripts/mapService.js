﻿/// <reference path="homeController.js" />
(function () {
    angular.module('byTheRoad')
        .service('mapService', function ($resource, $http) {

            var infowindow;
            var self = this;
            self.places = [];
            var placeIdArray = [];
            var searchCircle;
            var markers = [];
      
            self.results = [];
            // Save POI
            self.favPOI = function (poi) {
                console.log(poi);
                $http.post('/api/POI', {
                    Place_id: poi.place_id,
                    Name: poi.name,
                    Address: poi.formatted_address,
                    PhoneNum: poi.formatted_phone_number,
                    Rating: poi.rating
                })
                .success(function (result) {
                    console.log("success");
                })
                .error(function () {
                    console.error('fail');
                });
            }

            // Retrieve POI
            self.listFavPOI = function () {
                $http.get('/api/POI')
                .success(function (result) {
                    self.places = result;


                })
                .error(function () {
                    console.error('fail');
                });
            }

            self.categorySearch = function (model, center) {
                self.results = [];
                infowindow = new google.maps.InfoWindow();

                var request = {
                    location: center,
                    radius: 500,
                    types: model.selectedItem
                }

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, self.callback);

                reCenter(center);

            }

     //text search from  input box
            self.regTextSearch = function (model, center) {
                self.results = [];

                infowindow = new google.maps.InfoWindow();

                var request = {
                    location: center,
                    radius: 500,
                    query: document.getElementById('textsearch').value
                };


                var service = new google.maps.places.PlacesService(map);
                service.textSearch(request, self.callback);

                reCenter(center);

            }

            function reCenter(center) {
                var i = 1;
                var currBounds = map.getBounds();
                var tempCircle;

                var transitionWindow = window.setInterval(function () {
                    switch (i) {

                        case 1:
                            currBounds.extend(new google.maps.LatLng(center.lat, center.lng));
                            map.fitBounds(currBounds);
                            if (searchCircle) {
                                searchCircle.setMap(null);
                            }
                            tempCircle = new google.maps.Circle({
                                strokeColor: '#FF0000',
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0,
                                map: map,
                                center: center,
                                radius: (30 - map.getZoom()) * 10 ^ (30 - map.getZoom()) / 3,
                                zIndex: 3
                            })
                            console.log("far zoom radius: ", tempCircle.radius);
                            break;

                        case 2:
                            map.panTo(center);
                            break;

                        case 3:
                            tempCircle.setMap(null);
                            searchCircle = new google.maps.Circle({
                                strokeColor: '#FF0000',
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: '#FF0000',
                                fillOpacity: 0,
                                map: map,
                                center: center,
                                radius: 500
                            });
                            map.setZoom(15);
                            break;

                        case 4:
                            clearInterval(transitionWindow);
                            break;

                    }
                    i++
                }, 1000);
            }


        //grabbing the info for each place
            self.callback = function (results, status) {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                if (status === google.maps.places.PlacesServiceStatus.OK) {

                    for (var i = 0; i < results.length; i++) {
                        // creating markers below.
                        // createMarker(results[i]);
                        placeIdArray.push(results[i].place_id);
                    }
                    self.results = results;
                } else {
                    self.results = ['none'];
                }

                var infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(map);
                for (var i = 0; i < placeIdArray.length; i++)
                {
                    
                    service.getDetails({
                        placeId: placeIdArray[i]
                    }, function (place, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {

                            markers.push(createMarker(place));
                            
                            self.results.forEach(function (result) {
                                if (result.place_id === place.place_id) {
                                    console.log("name: " + place.name + " typed: " + place.types[0] + ", " + place.types[1] + ", " + place.types[2]);
                                    result.website = place.website;
                                    result.formatted_phone_number = place.formatted_phone_number;
                                    result.formatted_address = place.formatted_address;
                                }

                            });
                        }
                    });

                }
                console.log("self-results" + self.results);
            }

            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(place.name + place.formatted_phone_number);//gives the name of marker marked
                    infowindow.open(map, this);
                });
                return marker;
            }

        });

})();