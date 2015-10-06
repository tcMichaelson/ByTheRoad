(function () {
    angular.module('byTheRoad')
        .service('mapService', function () {

            var infowindow;
            var self = this;
            self.results = [];
            var placeIdArray = [];
            var markers = [];

            self.categorySearch = function (model) {
                self.results = [];
                var pos = { lat: locHist[0].lat, lng: locHist[0].lng };

                infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: pos,
                    radius: 5000,
                    types: model.selectedItem
                }, self.callback);
            }

     //text search from  input box
            self.regTextSearch = function () {
                self.results = [];
                var pos = { lat: locHist[0].lat, lng: locHist[0].lng };

                infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(map);

                var request = {
                    location: pos,
                    radius: 5000,
                    query: document.getElementById('textsearch').value
                };

                service = new google.maps.places.PlacesService(map);
                service.textSearch(request, self.callback);

            }


        //grabbing the info for each place
            self.callback = function (results, status) {
                markers.forEach(function (marker) {
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
                    //console.log("placeIdArray[" + i + "] = " + placeIdArray[i]);               

                    service.getDetails({
                        placeId: placeIdArray[i]
                    }, function (place, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {

                            markers.push(createMarker(place));
                            // using a separate function to get markers
                            //var marker = new google.maps.Marker({
                            //    map: map,
                            //    position: place.geometry.location
                            //});
                            //google.maps.event.addListener(marker, 'click', function () {
                            //    infowindow.setContent(place.name + place.formatted_phone_number);
                            //    infowindow.open(map, this);
                            //});
                        
                            self.results.forEach(function (result) {
                                //console.log("result place_id: " + result.place_id);
                                //console.log("place place_id: " + place.place_id);
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