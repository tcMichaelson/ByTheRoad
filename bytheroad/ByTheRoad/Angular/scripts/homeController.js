(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($scope, $route, $location, $http, mapService) {
            var self = this;
            var searchBox;

            self.registering = false;
            self.loggingin = false;
            self.start = false;
            self.results = [];
            console.log(self.results);
            self.viewingPlaces = false;
            self.animation = "animated slideInLeft";


            self.getResults = function () {
                self.results = mapService.results;
            }

            self.mainbtn = false;
            self.value1 = false;
            self.value2 = false;
            self.value3 = false;
            self.minutebtn = false;
            self.hourbtn = false;
            self.milebtn = false;
            self.selected = false;
            self.clear = false;
            self.login = function () {
                $http.post('/token', "grant_type=password&username=" + self.username + "&password=" + self.password,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                })
                .error(function () {
                    console.error('Error loggin in.');
                });
            };



            self.register = function () {
                roadService.register(self);
            };

            self.nearbySearch = function () {
                self.results = [];
                var posToCheck = findSearchPostionAlongRoute(self.something);
                mapService.categorySearch(self, posToCheck);
                self.startInterval();
            };

            self.textSearch = function () {
                self.results = [];
                mapService.regTextSearch();
                self.startInterval();
                if (!self.animation === "animated slideInLeft") {
                    self.animation = "animated slideInLeft";
                }
            }

            self.startInterval = function () {
                var checkResults = window.setInterval(function () {
                    if (self.results.length === 0 && self.results[0] !== 'none') {
                        self.getResults();
                        $scope.$apply();
                    } else {
                        console.log(self.results);
                        clearInterval(checkResults);
                    }
                }, 500);
            }

            var input = document.getElementById('textsearch');

            var getSearchBox = window.setInterval(function () {
                if (!(google.maps.places === undefined)) {
                    searchBox = new google.maps.places.SearchBox(input);
                    self.setupListeners();
                    clearInterval(getSearchBox);
                }
            }, 500);


            self.setupListeners = function () {

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
                    var bounds = map.getBounds();
                    places.forEach(function (place) {
                        //var icon = {
                        //    url: place.icon,
                        //    size: new google.maps.Size(71, 71),
                        //    origin: new google.maps.Point(29.5529732, -95.392946),
                        //    anchor: new google.maps.Point(37.8084987, -122.2535366),
                        //    scaledSize: new google.maps.Size(25, 25)
                        //};

                        // Create a marker for each place.
                        markers.push(new google.maps.Marker({
                            map: map,
                            //icon: icon,
                            //title: place.name,
                            position: place.geometry.location
                        }));

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            console.log("No viewport found");
                        }
                    });
                    map.fitBounds(bounds);
                    if (self.animation !== "animated slideInLeft") {
                        self.animation = "animated slideInLeft";
                    }
                });
            }


        });


})();