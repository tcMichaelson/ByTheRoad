
var map;
var service;
var infowindow;
var locHist = [];  //history of locations the user has been at
var currLoc;  //coordinates of the user's current position
var newLat = 45;
var newLng = -90;
var lastKnownLeg;
var lastKnownStep;
var selectedRoute;  //currently selected route.
var selectedPath;  //The full path of the currently selected route;
var routeDistances = []; //distances that correspond to path route Lines
var futureLoc;  //represents the location the user will be at in a given time frame.
var futurePath;  //represents the path taken to get to the future location

//Create Map and set the center as your current location.
//Also set the origin location as your current location.
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 18
            });
            currLoc = pos;
            setOriginTextBox(currLoc);

        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }

    var getRouteHandler = function () {
        findRouteAndDisplay();
    }

    //document.getElementById('input-btn').addEventListener('click', initTextSearch);
    document.getElementById('route-btn').addEventListener('click', getRouteHandler);

}
//  findSearchPositionAlongRoute("minutes", 30)
function findCurrentPosition() {
    var currPos = locHist[locHist.length - 1];
    var currLeg;
    var foundStep = false;
    //var direction = getDirection();
    if (selectedPath !== undefined) {
        var diffCheck = calculateDistance(currPos, selectedPath[0]);
        var result;
        var iLine = 1;
        while (!foundStep && iLine < selectedPath.length) {
            diffNext = calculateDistance(currPos, selectedPath[iLine]);
            var distTraveled = calculateDistance(selectedPath[iLine], selectedPath[iLine - 1]);
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
            return false;
        }

    } else {
        return false;
    }
}

function isBetween(a, b, x) {
    console.log("num 1: " + a, "num 2: " + b, "checking: " + x);
    console.log((x - a) * (x - b) <= 0);
    return (x - a) * (x - b) <= 0;
}


//  findGenericFuturePosition("minutes", 30)
function findGenericFuturePosition(unit, amount) {
    var meters;
    if (locHist.length === 1) {
        return { lat: locHist[0].lat, lng: locHist[0].lng };
    }
    var lastLoc = locHist[locHist.length - 1];
    if (unit === "miles") {
        meters = amount * 1609.344;
    } else {
        if (unit === "hours") {
            amount *= 3600;
        } else {
            amount *= 60;
        }
        meters = lastLoc.speed * amount;
    }
    console.log("meters:", meters);
    console.log("speed:", lastLoc.speed);
    console.log(meters);

    var futureLoc = calculatePointAlongBearing({ lat: lastLoc.lat, lng: lastLoc.lng }, lastLoc.bearing, meters);
    futurePath = new google.maps.Polyline({
        path: [{ lat: lastLoc.lat, lng: lastLoc.lng }, { lat: futureLoc.lat, lng: futureLoc.lng }],
        strokeWeight: 2,
        strokeColor: '#000000',
        map: map
    });
    futurePath.setMap(map);
    console.log(futureLoc);
    return futureLoc;
}

function findFuturePosition(spotOnRoute, unit, amount) {
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
        meters = currLoc.speed * amount;
    }

    console.log("selectedRoute:", selectedRoute);
    console.log(spotOnRoute);
    console.log(selectedRoute);
    var initLine = spotOnRoute.line;

    var distance = calculateDistance(currLoc, selectedPath[initLine]);
    var iLine = initLine;
    while(distance <= meters){
        iLine++
        distance += routeDistances[iLine];
    }
    if (iLine > selectedPath.length - 1) {
        console.log("The projected future position is not on the route.");
        return currLoc;
    }
    
    if (distance > amount){
        var bearing = calculateInitialBearing(selectedPath[iLine], currLoc);
        futureLoc = calculatePointAlongBearing(currLoc, bearing, distance - amount);
    } else{
        futureloc = selectedPath[iLine];
    }

    return futureLoc;
}

function findRouteAndDisplay() {
    var directionsService = new google.maps.DirectionsService;
    var start = document.getElementById('origin').value;
    var end = document.getElementById('destination').value;
    var request = {
        origin: start,
        destination: end,
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            console.log(response);
            renderLines(response);
        }
    });
}

function renderLines(response) {
    var minLat, maxLat, minLng, maxLng;

    response.routes.forEach(function (route, idx) {
        console.log(route);
        var coords = [];
        minLat = maxLat = route.legs[0].start_location.H;
        minLng = maxLng = route.legs[0].start_location.L;
        route.legs.forEach(function (leg, i) {
            leg.steps.forEach(function (step) {
                //setMarker(new google.maps.LatLng(step.end_point.H, step.end_point.L), step.distance.value, step.duration.value);
                step.path.forEach(function (line) {
                    coords.push({ lat: line.H, lng: line.L });

                    if (coords.length === 1)
                        routeDistances[0] = 0;
                    else
                        routeDistances.push(calculateDistance(coords[coords.length - 1], coords[coords.length - 2]));

                    minLat = minLat < line.H ? minLat : line.H;
                    maxLat = maxLat > line.H ? maxLat : line.H;
                    minLng = minLng < line.L ? minLng : line.L;
                    maxLng = maxLng > line.L ? maxLng : line.L;
                });
            });
        });
        console.log(routeDistances);
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
        var routeLines1 = new google.maps.Polyline({
            path: coords,
            strokeColor: "#000000",
            strokeWeight: 6,
            map: map
        });

        var routeLines2 = new google.maps.Polyline({
            path: coords,
            strokeColor: colHex,
            strokeWeight: 4,
            map: map
        });

        console.log("min dist: " + coords.map(function (a, idy, coords) {
            if (idy < coords.length - 1) { return calculateDistance(a, coords[idy + 1]); } else { return 999; }
        }).reduce(function (a, b) { return 0 < a && a < b ? a : b; }));

        console.log("max dist: " + coords.map(function (a, idy, coords) {
            if (idy < coords.length - 1) { return calculateDistance(a, coords[idy + 1]); } else { return 0; }
        }).reduce(function (a, b) { return a > b ? a : b; }));

        selectedPath = coords;
        selectedRoute = response.routes[idx];
        lastKnownLeg = 0;
        lastKnownStep = 0;
    });
    var sw = new google.maps.LatLng(minLat, minLng);
    var ne = new google.maps.LatLng(maxLat, maxLng);
    var bounds = new google.maps.LatLngBounds(sw, ne)
    map.fitBounds(bounds);
}

function setOriginTextBox(pos) {
    //var geocoder = new google.maps.Geocoder;
    //geocoder.geocode({ 'location': pos }, function (results, status) {
    //    if (status === google.maps.GeocoderStatus.OK) {
    //        if (results[0]) {
    //            document.getElementById('origin').value = results[0].formatted_address;
    //        } else {
    //            alert('No results found');
    //        }
    //    } else {
    //        alert('GeoCoder has failed due to: ' + status);
    //    }
    //});
    while (locHist.length >= 5) {
        locHist.shift();
    }
    if (locHist.length === 0) {
        firstLoc = pos;
        locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now(), bearing: 0, speed: 0 });
    } else {
        var prevLoc = locHist[locHist.length - 1];
        if (prevLoc.lat !== pos.lat || prevLoc.lng !== pos.lng) {
            var firstLoc = locHist[0];
            var currentLoc = pos;
            var brng = calculateInitialBearing(firstLoc, currentLoc);
            var dist = calculateDistance(firstLoc, currentLoc);  //distance in meters
            var time = (Date.now() - firstLoc.time) / 1000;  //convert milliseconds to seconds
            var spd = dist / time;  //meters per second
            locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now(), bearing: brng, speed: spd });
        }
    }
}

function calculateDistance(pos1, pos2) {
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

function calculateInitialBearing(pos1, pos2) {
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

function calculatePointAlongBearing(pos, brng, dist) {
    var lat1 = toRadians(pos.lat);
    var lng1 = toRadians(pos.lng);
    var bearing = 0 - toRadians(brng);  //reversing bearing.  should be clockwise from north
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

function executePan(newCenter) {
    //var newLatLng = new google.maps.LatLng(newLat, newLng);
    map.panTo(newCenter);
    setOriginTextBox(newCenter);
    //locHist.push({ lat: newCenter.lat, lng: newCenter.lng, time: Date.now() });
}

function startRouting() {
    map.setZoom(15);
    var move = 0;
    locHist = [];
    map.setCenter(selectedPath[0]);

    console.log(selectedRoute);
    move++;
    var refreshInterval = window.setInterval(function () {
        if (move < 60) {
            executePan(selectedPath[move]);
            move++;
        } else {
            clearInterval(refreshInterval);
        }
    }, 1000);
}


function setMarker(pos, dist, time) {
    var mrkr = new google.maps.InfoWindow({
        content: "dist: " + dist + "time: " + time,
        map: map,
        position: pos

    });
}
