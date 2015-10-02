(function () {
    angular.module('byTheRoad')
        .service('mapService', function () {

            var infowindow;
            var self = this;
            self.results = [];

            self.categorySearch = function (model) {
                self.results = [];
                var currentLocation = { lat: locHist[0].lat, lng: locHist[0].lng };

                infowindow = new google.maps.InfoWindow();

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: currentLocation,
                    radius: 5000,
                    types: [model.selectedItem]
                }, callback);
            }

     //text search from  input box
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
                service.textSearch(request, callback);
            }

        
        //grabbing the info for each place
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
                self.results = results;
            } else {
                self.results = ['none'];
            }
        }
// putting the markers on the map
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);//gives the name of marker marked
                infowindow.open(map, this);
            });
        }

    });

})();