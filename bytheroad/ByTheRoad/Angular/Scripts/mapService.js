(function () {
    angular.module('byTheRoad')
        .service('mapService', function () {

            var infowindow;
            var self = this;
            self.results = [];
            var placeIdArray = [];
            self.markers = [];

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

                displayCircle(center);

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

                displayCircle(center);

            }

            function displayCircle(center){
                var futureSearchRadius = new google.maps.Circle({
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


        //grabbing the info for each place
            self.callback = function (results, status) {
                self.markers.forEach(function (marker) {
                    marker.setMap(null);
                })
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

                            self.markers.push(createMarker(place));
                        
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