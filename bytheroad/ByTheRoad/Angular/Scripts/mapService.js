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

     
            //self.regTextSearch = function () {
            //    self.results = [];
            //    var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

            //    infowindow = new google.maps.InfoWindow();

            //    var service = new google.maps.places.PlacesService(map);

            //    var request = {
            //        location: pyrmont,
            //        radius: 5000,
            //        query: document.getElementById('textsearch').value
            //    };

            //    service = new google.maps.places.PlacesService(map);
            //    service.textSearch(request, callback);
            //}

        
        function getPlaceId() {
            var placeId = [];

            for (var i = 0; i < self.results.length; i++) {
                placeId.push(self.results[i].placeId);
            }

        }

        function callback(results, status) {

            var placeIdArray = [];

            if (status === google.maps.places.PlacesServiceStatus.OK) {                

                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    placeIdArray.push(results[i].place_id);

                }
                self.results = results;
                console.log("placeIdArray[0] = " + placeIdArray[0]);
            } else {
                self.results = ['none'];
            }

            return placeIdArray;
        }

        

        //function callback(results, status) {
        //    if (status === google.maps.places.PlacesServiceStatus.OK) {
        //        for (var i = 0; i < results.length; i++) {
        //            createMarker(results[i]);
        //        }
        //        self.results = results;
        //        console.log("results = " + results);
        //    } else {
        //        self.results = ['none'];
        //    }
        //}

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