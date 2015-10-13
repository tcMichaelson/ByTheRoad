var map;
(function () {
    angular.module('byTheRoad')
        .service('locationService', function ($q) {
            var self = this;

            var locHist = [];  //history of locations the user has been at
            var lastKnownLeg;
            var lastKnownStep;
            var selectedRoute;  //currently selected route.
            var selectedPath;  //The full path of the currently selected route;
            var routeDistances = []; //distances that correspond to path route Lines
            //var futureLoc;  //represents the location the user will be at in a given time frame.
            var routeLines1;
            var routeLines2;
            var futurePath;  //represents the path taken to get to the future location
            var car;


            var waitForMap = window.setInterval(function () {
                try {
                    new google.maps.Map(document.getElementById('map'), {
                        center: {lat: 25, lng: -95},
                        zoom: 15
                    });
                    getInitialLocation();
                    clearInterval(waitForMap);
                    //window.setInterval(function (data) {
                    //    getCurrentLocation();
                    //}, 5000);
                } catch(e) {
                    console.log("no dice");
                }
            }, 750);



            function getInitialLocation () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {

                        var currLoc = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        map = new google.maps.Map(document.getElementById('map'), {
                            center: currLoc,
                            zoom: 15
                        });

                        var carIcon = {
                            url: "../../Content/Cars/sportCar0.png",
                            scaledSize: new google.maps.Size(40, 40),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(20, 20)
                        };

                        if (car) {
                            car.setMap(null);
                        }

                        car = new google.maps.Marker({
                            position: currLoc,
                            map: map,
                            icon: carIcon
                        });

                        updateLocHist(currLoc);


                    }, function () {
                        handleLocationError(true, null, map.getCenter());
                        return { lat: locHist[locHist.length - 1].lat, lng: locHist[locHist.length - 1].lng } || { lat: 41.8369, lng: -87.6847 };
                    });
                } else {
                    handleLocationError(false, null, map.getCenter());
                    return { lat: locHist[locHist.length - 1].lat, lng: locHist[locHist.length - 1].lng } || { lat: 41.8369, lng: -87.6847 };
                }
            }

            function getCurrentLocation () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {

                        var currLoc = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        console.log(currLoc);
                        console.log(locHist);
                        updateLocHist(currLoc);
                        moveCar(currLoc);

                    }, function () {
                        alert("You do not appear to be connected to the internet, or you do not have location services turned on.  Please connect to the internet, enable this site to access your location, and click 'OK'.");
                        return { lat: locHist[locHist.length - 1].lat, lng: locHist[locHist.length - 1].lng };
                    });
                } else {
                    return { lat: locHist[locHist.length - 1].lat, lng: locHist[locHist.length - 1].lng };
                }
            }

            self.findCurrentPosition = function () {
                var currPos = locHist[locHist.length - 1];
                var currLeg;
                var foundStep = false;
                //var direction = getDirection();
                if (selectedPath !== undefined) {
                    var diffCheck = self.calculateDistance(currPos, selectedPath[0]);
                    var result;
                    var iLine = 1;
                    while (!foundStep && iLine < selectedPath.length) {
                        diffNext = self.calculateDistance(currPos, selectedPath[iLine]);
                        var distTraveled = self.calculateDistance(selectedPath[iLine], selectedPath[iLine - 1]);
                        if (distTraveled >= diffNext && distTraveled >= diffCheck) {
                            foundStep = true;
                            result = { route: selectedRoute }
                            if (diffNext < diffCheck) {
                                result.line = iLine;
                            } else {
                                result.line = iLine - 1;
                            }
                        } else {
                            diffCheck = diffNext;
                            iLine++;
                        }
                    }
                    if (foundStep) {
                        return result;
                    } else {
                        return { route: selectedRoute, line: 0 };
                    }

                } else {
                    return false;
                }
            }

            self.findGenericFuturePosition = function (unit, amount, offset) {
                var meters;
                if (locHist.length === 1) {
                    return { lat: locHist[0].lat, lng: locHist[0].lng };
                }
                var lastLoc = locHist[locHist.length - 1];
                if (unit === "miles") {
                    meters = amount * 1609.344
                } else {
                    if (unit === "hours") {
                        amount *= 3600;
                    } else {
                        amount *= 60;
                    }
                    meters = lastLoc.speed * amount;
                }

                meters = meters + (offset * 200);

                if (meters < 0)
                {
                    meters = 0;
                }

                console.log("meters:", meters);
                console.log("speed:", lastLoc.speed);
                console.log(meters);

                var futureLoc = calculatePointAlongBearing({ lat: lastLoc.lat, lng: lastLoc.lng }, lastLoc.bearing, meters);

                //var futureSearchRadius = new google.maps.Circle({
                //    strokeColor: '#FF0000',
                //    strokeOpacity: 1,
                //    strokeWeight: 2,
                //    fillColor: '#FF0000',
                //    fillOpacity: 0,
                //    map: map,
                //    center: futureLoc,
                //    radius: 500
                //});

                //if (futurePath) {
                //    futurePath.setMap(null);
                //}

                //futurePath = new google.maps.Polyline({
                //    path: [{ lat: lastLoc.lat, lng: lastLoc.lng }, { lat: futureLoc.lat, lng: futureLoc.lng }],
                //    strokeWeight: 2,
                //    strokeColor: '#7f7f7f',
                //    map: map
                //});
                console.log(futureLoc);
                return futureLoc;
            }

            self.findFuturePosition = function (spotOnRoute, unit, amount, offset) {
                var meters;
                var futureLoc;
                var currLoc = locHist[locHist.length - 1];
                if (unit === "miles") {
                    meters = amount * 1609.344;
                } else {
                    if (unit === "hours") {
                        amount *= 3600;
                    } else {
                        amount *= 60;
                    }
                    meters = currLoc.speed * amount
                }

                meters = meters + (offset * 200);

                if (meters < 0)
                    meters = 0;

                console.log("selectedRoute:", selectedRoute);
                console.log(spotOnRoute);
                console.log(selectedRoute);
                var initLine = spotOnRoute.line;

                var distance = self.calculateDistance(currLoc, selectedPath[initLine]);
                var iLine = initLine;
                while (distance <= meters) {
                    iLine++
                    distance += routeDistances[iLine];
                }
                if (iLine > selectedPath.length - 1) {
                    console.log("The projected future position is not on the route.");
                    return currLoc;
                }

                /**Error in the bearing formula**/
                //if (distance > meters) {
                //    var bearing = calculateInitialBearing(selectedPath[iLine], selectedPath[iLine - 1]);
                //    console.log("adjusted bearing: ", bearing);
                //    futureLoc = calculatePointAlongBearing(selectedPath[iLine], bearing, distance - meters);
                //} else {

                futureLoc = selectedPath[iLine];

                //}

                if (futurePath) {
                    futurePath.setMap(null);
                }

                futurePath = new google.maps.Polyline({
                    strokeWeight: 2,
                    strokeColor: "#7f7f7f",
                    path: [currLoc, futureLoc],
                    map: map
                })

                return futureLoc;
            }

            self.findRouteAndDisplay = function (destination, index/*, func*/) {
                var deferred = $q.defer();
                var directionsService = new google.maps.DirectionsService;
                console.log(locHist);
                var start = locHist[locHist.length - 1];
                var end = destination;
                var request = {
                    origin: start,
                    destination: end,
                    provideRouteAlternatives: false,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log(response);
                        
                        deferred.resolve({ response: response, index: index });
                        //func(response, index);

                    }
                });

                return deferred.promise;
                
            }

            self.renderLines = function (response) {
                var minLat, maxLat, minLng, maxLng;

                response.routes.forEach(function (route, idx) {
                    console.log(route);
                    var coords = [];
                    minLat = maxLat = route.legs[0].start_location.lat();
                    minLng = maxLng = route.legs[0].start_location.lng();
                    route.legs.forEach(function (leg, i) {
                        leg.steps.forEach(function (step) {
                            //setMarker(new google.maps.LatLng(step.end_point.J, step.end_point.M), step.distance.value, step.duration.value);
                            step.path.forEach(function (line) {
                                coords.push({ lat: line.lat(), lng: line.lng() });

                                if (coords.length === 1)
                                    routeDistances[0] = 0;
                                else
                                    routeDistances.push(self.calculateDistance(coords[coords.length - 1], coords[coords.length - 2]));

                                minLat = minLat < line.lat() ? minLat : line.lat();
                                maxLat = maxLat > line.lat() ? maxLat : line.lat();
                                minLng = minLng < line.lng() ? minLng : line.lng();
                                maxLng = maxLng > line.lng() ? maxLng : line.lng();
                            });
                        });
                    });
                    console.log("routeDistances: ", routeDistances);
                    var colHex = "";
                    switch (idx % 3) {
                        case 0:
                            colHex = "#3087B4";
                            break;
                        case 1:
                            colHex = "#00ff00"
                            break;
                        case 2:
                            colHex = "#0000ff"
                            break;
                    }

                    if (routeLines1) {
                        routeLines1.setMap(null);
                        routeLines2.setMap(null);
                    }
                    routeLines1 = new google.maps.Polyline({
                        path: coords,
                        strokeColor: "#000000",
                        strokeWeight: 6,
                        map: map,
                        zIndex: 0
                    });

                    routeLines2 = new google.maps.Polyline({
                        path: coords,
                        strokeColor: colHex,
                        strokeWeight: 4,
                        map: map,
                        zIndex: 1
                    });

                    selectedPath = coords;
                    console.log("selectedPath: ", selectedPath);
                    selectedRoute = response.routes[idx];
                    lastKnownLeg = 0;
                    lastKnownStep = 0;
                });
                var sw = new google.maps.LatLng(minLat, minLng);
                var ne = new google.maps.LatLng(maxLat, maxLng);
                var bounds = new google.maps.LatLngBounds(sw, ne)
                map.fitBounds(bounds);
            }

            function updateLocHist(pos) {
                while (locHist.length > 5) {
                    locHist.shift();
                }
                if (locHist.length === 0) {
                    firstLoc = pos;
                    locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now(), bearing: 0, speed: 0 });
                } else {
                    var prevLoc = locHist[locHist.length - 1];
                    var firstLoc = locHist[0];
                    var currentLoc = pos;
                    var dist = self.calculateDistance(firstLoc, currentLoc);  //distance in meters
                    if (dist > 1) {
                        var brng = calculateInitialBearing(firstLoc, currentLoc);
                        var time = (Date.now() - firstLoc.time) / 1000;  //convert milliseconds to seconds
                        var spd = dist / time;  //meters per second
                        locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now(), bearing: brng, speed: spd });
                    }
                }
            }

            self.calculateDistance = function (pos1, pos2) {
                var earthRadius = 6371000;
                var lat1 = toRadians(pos1.lat);
                var lat2 = toRadians(pos2.lat);
                var diffLat = toRadians(pos2.lat - pos1.lat);
                var diffLng = toRadians(pos2.lng - pos1.lng);

                //Haversine Formula
                var a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
                        Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(diffLng / 2) * Math.sin(diffLng / 2);

                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


                return earthRadius * c;
            }


            ///
            ///Returns a bearing counter-clockwise from north
            ///
            function calculateInitialBearing (pos1, pos2) {
                var lat1 = pos1.lat;
                var lng1 = pos1.lng;
                var lat2 = pos2.lat;
                var lng2 = pos2.lng;

                var y = Math.sin(lng2 - lng1) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) -
                        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
                var bearing = toDegrees(Math.atan2(y, x));
                return bearing;
            }

            function calculatePointAlongBearing (pos, brng, dist) {
                var lat1 = toRadians(pos.lat);  
                var lng1 = toRadians(pos.lng);
                var bearing = -1 * (toRadians(brng));  //reversing bearing.  should be clockwise from north
                var R = 6371000;
                console.log("lat1:", lat1, "lng1:", lng1, "bearing:", bearing, "dist:", dist);
                var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist / R) +
                                Math.cos(lat1) * Math.sin(dist / R) * Math.cos(bearing));
                var lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(dist / R) * Math.cos(lat1),
                                         Math.cos(dist / R) - Math.sin(lat1) * Math.sin(lat2));
                return { lat: toDegrees(lat2), lng: toDegrees(lng2) }
            }

            function toRadians(deg) {
                return deg * Math.PI / 180;
            }

            function toDegrees(rad) {
                return rad / Math.PI * 180;
            }

            function moveCar(newCenter) {
                var bearing = -1 * (locHist[locHist.length - 1].bearing);
                if (bearing < 0) {
                    brng = 360 + bearing;
                } else {
                    brng = bearing;
                }
                brng = Math.round(brng / 5.0) * 5;
                car.icon.url = "../../Content/Cars/sportCar" + brng + ".png";
                car.setPosition(newCenter);
            }

            function setMarker(pos, dist, time) {
                var mrkr = new google.maps.InfoWindow({
                    content: "dist: " + dist + "time: " + time,
                    map: map,
                    position: pos

                });
            }

            function setInitialSearchBoxBounds (searchBox) {
                setSearchBoxBounds(searchBox, locHist[locHist.length - 1]);
            }

            function setSearchBoxBounds (searchBox, position) {
                var sw = calculatePointAlongBearing(position, 225, 500);
                var ne = calculatePointAlongBearing(position, 45, 500);
                searchBox.setBounds(new google.maps.LatLngBounds(sw, ne));
            }

            self.startRouting = function() {
                map.setZoom(15);
                var move = 0;
                locHist = [];
                map.setCenter(selectedPath[0]);
                var carIcon = {
                    url: "../../Content/Cars/sportCar0.png",
                    scaledSize: new google.maps.Size(40, 40),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(20, 20)
                };
                if (car) {
                    car.setMap(null);
                }
                car = new google.maps.Marker({
                    position: selectedPath[0],
                    map: map,
                    icon: carIcon
                });

                console.log(selectedRoute);
                move++;
                var refreshInterval = window.setInterval(function () {
                    if (selectedPath[move]) {
                        updateLocHist(selectedPath[move]);
                        moveCar(selectedPath[move]);
                        move++;
                    } else {
                        clearInterval(refreshInterval);
                    }
                }, 1000);
            }

        });
})();
