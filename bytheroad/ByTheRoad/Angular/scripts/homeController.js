(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($scope, $route, $location, $http, mapService, roadService, $window) {
            var self = this;
            var searchBox;
           
            self.registering = false;
            self.loggingin = false;
            self.start = false;
            self.star = false;
            self.results = [];
            console.log(self.results);
            self.viewingPlaces = false;
            self.animationResults = "animated slideInLeft";
            self.animationSaved = "animated slideOutLeft";
            self.getResults = function () {
                self.results = mapService.results;
            }


            self.init = function () {
                if ($window.sessionStorage.token) {

                }
            }

            self.init();
            self.logoutbtn = false;
            self.mainbtn = false;
            self.value1 = false;
            self.value2 = false;
            self.value3 = false;
            self.minutebtn = false;
            self.hourbtn = false;
            self.milebtn = false;
            self.selected = false;
            self.clear = false;

            self.findRoute = function () {
                findRouteAndDisplay();
            }

            self.login = function () {
                $http.post('/token', "grant_type=password&username=" + self.login.email + "&password=" + self.login.password,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                    $window.sessionStorage.setItem("token", data.access_token);
                    self.loggingin = false;
                    self.logoutbtn = true;
                    self.login.email = null;
                    self.login.password = null;
                   

                })
                .error(function () {
                    self.hasError = true;
                    self.errorMessage = "Error loggin in";
                });
            };

            self.logout = function () {
                $http.post('api/Account/Logout')

               .success(function (data) {

                    self.logoutbtn = false;
                    console.log('success')
                })
                .error(function () {
                   console.error('Error loggin in.');

               });
            };

            self.register = function () {
                roadService.register(self.register, function (error) {

                    self.hasError = true;
                    self.errorMessage = "Registration Error";
                });
                self.register.email = null;
                self.register.password = null;
                self.register.Confirmpassword = null;
                self.register.firstName = null;
                self.register.lastName = null;
               
            };


            self.nearbySearch = function () {
                self.runSearch(mapService.categorySearch);
            };

            self.textSearch = function () {
                self.runSearch(mapService.regTextSearch);
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

            self.runSearch = function (func) {
                var info = self.getUnitAndAmount();
                self.results = [];
                mapService.results = [];
                var spotOnRoute = findCurrentPosition();
                console.log("spot on route:", spotOnRoute);
                if (spotOnRoute) {
                    var searchPos = findFuturePosition(spotOnRoute, info.unit, info.amount);
                } else {
                    var searchPos = findGenericFuturePosition(info.unit, info.amount);
                }
                func(self, searchPos);
                self.startInterval();
                self.showResultsBox();
            }

            var input = document.getElementById('textsearch');

            var getSearchBox = window.setInterval(function () {
                console.log(google.maps.places);
                if (!(google.maps.places === undefined)) {
                    searchBox = new google.maps.places.SearchBox(input);
                    setInitialSearchBoxBounds(searchBox);
                    self.setupListeners();
                    clearInterval(getSearchBox);
                    console.log(searchBox.getBounds());
                }
            }, 500);


            self.setupListeners = function () {

                // [START region_getplaces]
                // Listen for the event fired when the user selects a prediction and retrieve
                // more details for that place.
                searchBox.addListener('places_changed', function () {
                    var places = searchBox.getPlaces();

                    if (places.length === 0 || places[0].place_id === undefined){
                        console.log(places[0].place_id)
                        return;
                    }
                    mapService.callback(places, google.maps.places.PlacesServiceStatus.OK);
                    self.startInterval();
                    self.showResultsBox();

                });
            };

            self.showResultsBox = function () {
                self.animationResults = "animated slideInLeft";
                self.animationSaved = "animated slideOutLeft";
            }

            self.getUnitAndAmount = function(){
                if (self.minutesUnit)
                    return {unit: "minutes", amount: self.minutesUnit};
                if (self.hoursUnit)
                    return {unit: "hours", amount: self.hoursUnit};
                if (self.milesUnit)
                    return {unit: "miles", amount: self.milesUnit};
            }
            self.toggleSavedBox = function () {
                if (self.animationSaved === 'animated slideInLeft') {
                    self.animationSaved = 'animated slideOutLeft';
                    self.animationResults = 'animated slideInLeft';
                } else {
                    self.animationSaved = 'animated slideInLeft';
                    self.animationResults = 'animated slideOutLeft';
                }
            }

            self.favPOI = function () {
                mapService.favPOI(self.poiToSave);
            }

            self.places = function () {
                mapService.listFavPOI();
                self.toggleSavedBox();
            }

        });


})();