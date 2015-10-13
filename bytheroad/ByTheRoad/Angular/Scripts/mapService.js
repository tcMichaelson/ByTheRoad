/// <reference path="homeController.js" />
(function () {
    angular.module('byTheRoad')
        .service('mapService', function ($resource, $http, locationService) {

            var infowindow;
            var self = this;
            self.places = [];
            self.distancesFound = 0;
            var placeIdArray = [];
            var searchCircle;
            var markers = [];
            self.results = [];          

            // Save POI
            self.favPOI = function (poi, chkState, addFav, deleteFav) {

                if (chkState) {

                    $http.post('/api/POI', {
                        Place_id: poi.place_id,
                        Name: poi.name,
                        Address: poi.formatted_address,
                        Vicinity: poi.vicinity,
                        PhoneNum: poi.formatted_phone_number,
                        Rating: poi.rating,

                    })
                    .success(function (result) {
                        console.log("success");
                        addFav(result)
                    })
                    .error(function () {
                        console.error('fail');
                    });
                }

                else {
                    var place_id = poi.place_id || poi.Place_id;
                    $http.delete('/api/POI/' + place_id
                    )
                    .success(function (result) {
                        console.log("success");
                        deleteFav(result);
                    })
                    .error(function () {
                        console.error('fail');
                    });
                }
            }

            // Retrieve POI
            self.listFavPOI = function (func) {
                $http.get('/api/POI')
                .success(function (result) {
                    func(result);

                })
                .error(function () {
                    console.error('fail');
                });
            }

            self.categorySearch = function (model, center, updateResultsFunc) {
                self.results = [];
                infowindow = new google.maps.InfoWindow();

                var request = {
                    location: center,
                    radius: 500,
                    types: model.selectedItem
                }

                setCircle(center);

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, self.callback);
            }

            //text search from  input box
            self.regTextSearch = function (model, center, updateResultsFunc) {
                self.results = [];

                infowindow = new google.maps.InfoWindow();

                var request = {
                    location: center,
                    radius: 500,
                    query: document.getElementById('searchInputBox').value
                };

                setCircle(center);

                var service = new google.maps.places.PlacesService(map);
                service.textSearch(request, self.callback);

            }

            function setCircle(center) {

                if (searchCircle) {
                    searchCircle.setMap(null);
                }

                //var currBounds = map.getBounds();

                //currBounds.extend(new google.maps.LatLng(center.lat, center.lng));
                //map.fitBounds(currBounds);

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
                
            }

            self.reCenter = function () {
                var i = 1;
                var center = searchCircle.getCenter();
                map.panTo(center);

                var transitionWindow = window.setInterval(function () {
                    switch (i) {

                        case 1:
                            map.setZoom(15);
                            break;

                        case 2:
                            clearInterval(transitionWindow);
                            break;

                    }
                    i++
                }, 1000);
            }

            self.reCenterCustom = function (pos, zoom) {
                map.panTo(pos);
                map.setZoom(zoom);
            }

            //grabbing the info for each place
            self.callback = function (places, status) {
                if (markers[0]) {
                    for (var i = 0; i < markers.length; i++) {

                        markers[i].setMap(null);
                    }
                }
                markers = [];
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    var resultIdx = 0;
                    for (var i = 0; i < places.length; i++) {
                        
                        var placeDist = locationService.calculateDistance(
                            { lat: places[i].geometry.location.lat(), lng: places[i].geometry.location.lng() },
                            { lat: searchCircle.getCenter().lat(), lng: searchCircle.getCenter().lng() });

                        if (placeDist <= 500) {
                            placeIdArray.push(places[i].place_id);

                            //places is the results from the google place search
                            self.results[resultIdx] = places[i];

                            //self.places is the current user's saved places...  From our database
                            //If self.places has a POI
                            if (self.places)
                            {
                                self.places.forEach(function (poi) {
                                    if (poi.Place_id === places[i].place_id)
                                    {
                                        self.results[resultIdx].saved = true;
                                    }                                   
                                
                               });
                            }
                            markers[resultIdx] = (createMarker(places[i]));
                            locationService.findRouteAndDisplay(places[i].geometry.location, resultIdx)
                                .then(function (response) {
                                    
                                    self.results[response.index].distance = response.response.routes[0].legs[0].distance.text;
                                    self.results[response.index].route = response.response;
                                    console.log("placeDist: ", placeDist);
                                    self.distancesFound++;
                                });
                            resultIdx++;
                        }

                    }
                    if (self.results.length === 0) {
                        self.results = ['none'];
                    }
                } else {
                    self.results = ['none'];
                }

                var infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(map);
                for (var i = 0; i < placeIdArray.length; i++) {

                    service.getDetails({
                        placeId: placeIdArray[i]
                    }, function (place, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {

                            self.results.forEach(function (result) {
                                if (result.place_id === place.place_id) {
                                    console.log("name: " + place.name + " typed: " + place.types[0] + ", " + place.types[1] + ", " + place.types[2]);
                                    result.website = place.website;
                                    result.formatted_phone_number = place.formatted_phone_number;
                                    result.formatted_address = place.formatted_address;
                                    result.vicinity = place.vicinity;
                                }

                            });
                        }
                    });

                }
                console.log("self-results", self.results);
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