(function () {
    angular.module('byTheRoad')
        .service('mapService', function () {

            var infowindow;
            var self = this;
            self.results = [];
            var placeIdArray = [];

            self.categorySearch = function (model) {
                self.results = [];
                var currentLocation = { lat: locHist[0].lat, lng: locHist[0].lng };

                infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: currentLocation,
                    radius: 5000,
                    types: [model.selectedItem]
                }, self.callback);
            }

            self.regTextSearch = function () {
                self.results = [];
                var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

                infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(map);

                var request = {
                    location: pyrmont,
                    radius: 5000,
                    query: document.getElementById('textsearch').value
                };

                service = new google.maps.places.PlacesService(map);
                service.textSearch(request, self.callback);


            }


            self.callback = function(results, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {

                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
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
                    console.log("placeIdArray[" + i + "] = " + placeIdArray[i]);               

                    service.getDetails({
                        placeId: placeIdArray[i]
                    }, function (place, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            var marker = new google.maps.Marker({
                                map: map,
                                position: place.geometry.location
                            });
                            google.maps.event.addListener(marker, 'click', function () {
                                infowindow.setContent(place.name + place.formatted_phone_number);
                                infowindow.open(map, this);
                            });
                        }
                        self.results.forEach(function (result) {
                            console.log("result place_id: " + result.place_id);
                            console.log("place place_id: " + place.place_id);
                            if (result.place_id === place.place_id) {
                                result.website = place.website;
                                result.formatted_phone_number = place.formatted_phone_number;
                                result.formatted_address = place.formatted_address;
                            }
                        });
                    });

                }

            }


            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
            }

        });

})();