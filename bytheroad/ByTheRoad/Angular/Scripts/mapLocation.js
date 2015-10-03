
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
var routeLines = [];  //path coordinates of the selected route
var projectedPosition;

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
function findSearchPositionAlongRoute(unitType, amount) {
    var currPos = locHist[locHist.length - 1];
    var currLeg;
    var foundStep = false;
    //var direction = getDirection();
    if (selectedRoute !== undefined) {
        for(var iLeg = lastKnownLeg; iLeg < selectedRoute.legs.length; iLeg++) {
            currLeg = selectedRoute.legs[iLeg];
            for (var iStep = lastKnownStep; iStep < currLeg.steps.length; iStep++) {
                currStep = currLeg.steps[iStep];
                console.log(iLeg + iStep);
                var diffCheck = calculateDistance(currPos, { lat: currStep.path[0].H, lng: currStep.path[0].L });
                var iLine = 1
                while(!foundStep && iLine < currStep.path.length){
                    diffNext = calculateDistance(currPos, { lat: currStep.path[iLine].H, lng: currStep.path[iLine].L });
                    if (diffNext > diffCheck) {
                        console.log("leg: " + iLeg, "step: " + iStep);
                        lastKnownLeg = iLeg;
                        lastKnownStep = iStep;
                        foundStep = true;
                    } else {
                        diffCheck = diffNext;
                        iLine++;
                    }
                }
                if (foundStep = true) {
                    setMarker(currStep.path[iLine - 1]);
                    return currStep.path[iLine - 1]
                }
            }
        }
        if (foundStep = false) { return false; }
    } else {
        findSearchPositionAlongDirection(unittype, amount);
    }
}

function isBetween(a, b, x) {
    console.log("num 1: " + a, "num 2: " + b, "checking: " + x);
    console.log((x - a) * (x - b) <= 0);
    return (x - a) * (x - b) <= 0;
}



function findSearchPostionAlongDirection(unitType, amount) {
    //if not on a route and a desination is selected, then calculate a new route.
    //otherwise, we will have to guess about the expected end point, assuming a straight road in the current direction.
}

function findRouteAndDisplay() {
    var directionsService = new google.maps.DirectionsService;
    var start = document.getElementById('origin').value;
    var end = document.getElementById('destination').value;
    var request = {
        origin: start,
        destination: end,
        provideRouteAlternatives: true,
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
        route.legs.forEach(function (leg) {
            leg.steps.forEach(function (step) {
                //setMarker(new google.maps.LatLng(step.end_point.H, step.end_point.L), step.distance.value, step.duration.value);
                step.path.forEach(function (line) {
                    coords.push({ lat: line.H, lng: line.L });
                    minLat = minLat < line.H ? minLat : line.H;
                    maxLat = maxLat > line.H ? maxLat : line.H;
                    minLng = minLng < line.L ? minLng : line.L;
                    maxLng = maxLng > line.L ? maxLng : line.L;
                });
            });
        });
        var colHex = "";
        switch (idx % 3) {
            case 0:
                colHex = "#ff0000";
                break;
            case 1:
                colHex = "#00ff00"
                break;
            case 2:
                colHex = "#0000ff"
                break;
        }

        if (routeLines[idx]) {
            routeLines[idx].setMap(null);
        }
        routeLines[idx] = new google.maps.Polyline({
            path: coords,
            strokeColor: colHex,
            strokeWeight: 2
        });
        selectedPath = coords;
        selectedRoute = response.routes[idx];
        lastKnownLeg = 0;
        lastKnownStep = 0;
        routeLines[idx].setMap(map);
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
    while (locHist.length >= 30) {
        locHist.shift();
    }
    if (locHist.length === 0) {
        firstLoc = pos;
        locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now(), trajectory: 0, speed: 0 });
    } else {
        var prevLoc = locHist[locHist.length - 1];
        if (prevLoc.lat !== pos.lat || prevLoc.lng !== pos.lng) {
            var firstLoc = locHist[0];
            var currentLoc = pos;
            var traj = (currentLoc.lat - firstLoc.lat) / (currentLoc.lng - firstLoc.lng);
            var dist = calculateDistance(currentLoc, firstLoc);  //distance in meters
            console.log("dist: " + dist);
            var time = (Date.now() - firstLoc.time) / 1000;  //convert milliseconds to seconds
            console.log("time: " + time);
            var spd = dist / time;  //meters per second
            locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now(), trajectory: traj, speed: spd });
        }
    }

    console.log(locHist[locHist.length - 1]);

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

function toRadians(deg) {
    return deg * Math.PI / 180;
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
    map.setCenter(selectedPath[0]);

    console.log(selectedRoute);
    move++;
    var refreshInterval = window.setInterval(function () {
        if (move < 30) {
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
