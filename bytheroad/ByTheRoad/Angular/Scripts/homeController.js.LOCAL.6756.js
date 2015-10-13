(function () {
    angular
        .module('byTheRoad')
        .controller('homeController', function ($scope, $route, $location, $http, mapService, roadService, locationService,authUserService, $window) {
            var self = this;
            var searchBox;
            var queryLimit = 1;

            self.displayName = "";
            self.hasError = false;
            self.errorMessage = '';
            self.registering = false;
            self.loggingin = false;
            self.start = false;
            self.star = false;
            self.results = [];
            self.mobileSearch = false;
            self.showFav = false;
            self.foundRoute = false;

            self.viewingPlaces = false;
            self.animationResults = "animated slideInLeft";
            self.animationSaved = "animated slideOutLeft";

            self.getResults = function () {
                self.results = mapService.results;
            }

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
            self.editUser = false;

           

            self.findRoute = function () {
                locationService.findRouteAndDisplay(self.directions.destination, 0, function (response) {
                    locationService.renderLines(response);
                    self.foundRoute = true;
                    $scope.$apply();
                })
            }

            self.startRouting = function(){
                locationService.startRouting();
            }

            self.login = function () {
                $http.post('/token', "grant_type=password&username=" + self.login.Email + "&password=" + self.login.Password,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .success(function (data) {
                    token = data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
                    $window.sessionStorage.setItem("token", data.access_token);
                   
                    self.data=null;
                    authUserService.getData(function(dataResponse){
                        self.data = dataResponse;
                        self.displayName = self.data.FirstName;
                        
                    });

                    self.loggingin = false;
                    self.logoutbtn = true;
                    self.login.Email = null;
                    self.login.Password = null;
                    
                    var myFunction = function (userPOI) {
                        self.places = userPOI;
                        console.log("User POIs: ", userPOI);
                    }

                    mapService.listFavPOI(myFunction);


                })
                .error(function () {
                    console.error('Error loggin in.');
                    self.hasError = true;
                    self.errorMessage = "Error logging in";
                    self.login.Email = null;
                    self.login.Password = null;
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
                    self.hasError = true;

               });
            };

            self.register = function () {


                roadService.register(self.registerUser, function (token) {

                    $window.sessionStorage.setItem("token", token);

                    self.data=null;
                    authUserService.getData(function(dataResponse){
                        self.data = dataResponse;
                        
                    });

                    self.registering = false;
                    self.loggingin = false;
                    self.logoutbtn = true;
                    self.registerUser.Email = null;
                    self.registerUser.Password = null;
                    self.registerUser.ConfirmPassword = null;
                    self.registeringUser.FirstName = null;
                    self.registeringUser.LastName = null;

                }, function (error) {
                    console.error('Registration Error' );
                    self.hasError = true;
                    self.errorMessage = "Registration Error";
                self.register.FirstName = null;
                self.register.LastName = null;

                });
            }

            self.updateProfile=function(data){

                authUserService.update(data,function(){
                  
                },function(error){
                    console.error('Registration Error' );
                    self.hasError = true;
                    self.errorMessage = "Registration Error";
                })
            }

            var successAction = function () {
                self.data.FirstName = null;
                self.data.LastName = null;
                self.data.Email = null;
            }

            self.deleteProfile = function () {
                authUserService.delete(self.data.Id, successAction, function(error){
                    console.error('Registration Error' );
                    self.hasError = true;
                    self.errorMessage = "Registration Error";
                })
           
            }


            self.nearbySearch = function () {
                self.runSearch(mapService.categorySearch, 0);//self.runSearch(func);
            };

            self.textSearch = function () {
                self.runSearch(mapService.regTextSearch, 0);
            }

            self.startInterval = function (func, searchPos) {
                var checkResults = window.setInterval(function () {
                    if (self.results[0] === 'none' && queryLimit < 10) {
                        self.runSearch(func, queryLimit);
                        if (queryLimit > 0){
                            queryLimit *= -1;
                        }
                        else
                        {
                            queryLimit = (queryLimit * -1) + 1;
                        }
                    } else if (self.results.length === 0 && self.results[0] !== 'none') {
                        self.getResults();
                        $scope.$apply();
                    } else {
                        self.showResultsBox();
                        queryLimit = 1;
                        console.log(self.results);
                        clearInterval(checkResults);
                    }
                }, 500);
            }

            self.runSearch = function (func, offset) {
                var info = self.getUnitAndAmount();
                self.results = [];
                mapService.results = [];
                var spotOnRoute = locationService.findCurrentPosition();
                console.log("spot on route:", spotOnRoute);
                console.log("selectedRoute: ", locationService.selectedRoute);

                if (spotOnRoute) {
                    var searchPos = locationService.findFuturePosition(spotOnRoute, info.unit, info.amount, offset);
                } else {
                    var searchPos = locationService.findGenericFuturePosition(info.unit, info.amount, offset);
                }
                mapService.places = self.places;
                func(self, searchPos);//Invoked func
                self.startInterval(func, searchPos);
            }

            var input = document.getElementById('searchInputBox');

            var getSearchBox = window.setInterval(function () {
                if (!(google.maps.places === undefined)) {
                    searchBox = new google.maps.places.SearchBox(input);
                    //setInitialSearchBoxBounds(searchBox);
                    self.setupListeners();
                    clearInterval(getSearchBox);
                }
            }, 500);


            self.setupListeners = function () {

                // [START region_getplaces]
                // Listen for the event fired when the user selects a prediction and retrieve
                // more details for that place.
                searchBox.addListener('places_changed', function () {
                    var places = searchBox.getPlaces();

                    if (places.length === 0 || places[0].place_id === undefined) {
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

            self.getUnitAndAmount = function () {
                if (self.minutesUnit)
                    return { unit: "minutes", amount: self.minutesUnit };
                if (self.hoursUnit)
                    return { unit: "hours", amount: self.hoursUnit };
                if (self.milesUnit)
                    return { unit: "miles", amount: self.milesUnit };
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
                mapService.favPOI(self.poiToSave, self.chkState, function (item) {
                    self.places.push(item);
                }, function (item) {
                    self.places = self.places.filter(function (compareItem) {
                        return item.Place_id !== compareItem.Place_id;
                    });
                });

            }

            self.showLeftBox = function () {
                document.getElementById('leftBox').style.left = '0';
                document.getElementById('rightBox').style.left = '100%';
            }

            self.showRightBox = function () {
                document.getElementById('leftBox').style.left = '-100%';
                document.getElementById('rightBox').style.left = '0';
            }
        });

    angular
        .module('byTheRoad')
        .directive('validNumber',function(){

            return {
                require: '?ngModel',
                link: function(scope, element, attrs, ngModelCtrl) {
                    if(!ngModelCtrl) {
                        return; 
                    }
      
                    ngModelCtrl.$parsers.push(function(val) {
                        var clean = val.replace( /[^0-9]+/g, '');
                        if (val !== clean) {
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }
                        return clean;
                    });
      
                    element.bind('keypress', function(event) {
                        if(event.keyCode === 32) {
                            event.preventDefault();
                        }
                    });
                }
            };
        });


  

})();
