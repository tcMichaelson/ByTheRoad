(function () {
    angular.module('byTheRoad').service('mapService', function () {

        var infowindow;
        var self = this;

        self.categorySearch = function (type) {
            console.log(locHist);
            var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 13
            });

            infowindow = new google.maps.InfoWindow();

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: pyrmont,
                radius: 5000,
                types: [type]
            }, callback);
        }

        self.initTextSearch = function () {
            console.log(locHist);
            var currentLoc = { lat: locHist[0].lat, lng: locHist[0].lng };

            map = new google.maps.Map(document.getElementById('map'), {
                center: currentLoc,
                zoom: 13
            });

            // Create the search box and link it to the UI element.
            var input = document.getElementById('textsearch');
            var searchBox = new google.maps.places.SearchBox(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function () {
                searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // [START region_getplaces]
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function (place) {
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                        map: map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location
                    }));

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        regTextSearch();
                    }
                });
                map.fitBounds(bounds);
            });
            // [END region_getplaces]
        }


        function regTextSearch() {
            console.log(locHist);
            var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 13
            });

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

        function callback(results, status) {
            console.log(results);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
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