(function () {
    angular.module('byTheRoad').service('mapService', function () {

        var infowindow;

        this.categorySearch = function (type, setResults) {
            console.log(locHist);         
            var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 15
            });

            infowindow = new google.maps.InfoWindow();

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: pyrmont,
                radius: 5000,
                types: [type]
            }, callback);
        }

        this.initTextSearch = function () {
            console.log(locHist);
            var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 15
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

        this.callback = function (results, status) {
            console.log(results);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }

        }

        this.createMarker = function (place) {
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

})



