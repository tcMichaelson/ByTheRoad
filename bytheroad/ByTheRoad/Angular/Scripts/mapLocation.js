﻿
var map;
var service;
var infowindow;
var locHist = [];
var currLoc;
var newLat = 45;
var newLng = -90;
var selectedRoute;
var subRoute;
var routeLines = [];


//Create Map and set the center as your current location.
//Also set the origin location as your current location.
function initMap() {
    var geocoder = new google.maps.Geocoder;

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
            geocoder.geocode({ 'location': pos }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        document.getElementById('origin').value = results[0].formatted_address;
                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('GeoCoder has failed due to: ' + status);
                }
            });

            document.getElementById('origin').value = pos;
            locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now() });

        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }

    console.log(locHist);

    var getRouteHandler = function () {
        findRouteAndDisplay();
    }

    //document.getElementById('input-btn').addEventListener('click', initTextSearch);
    document.getElementById('route-btn').addEventListener('click', getRouteHandler);
}

function findSearchPostionAlongRoute(unitType, amount) {
    var currPos = locHist[locHist.length - 1];
    selectedRoute.legs.forEach(function(leg){
        leg.steps.forEach(function(step){
            
        })
    })


    if (end) {
    } else {
        return start
    }
}

function findSearchPostionAlongDirection(unitType, amount){
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
        selectedRoute = coords;
        routeLines[idx].setMap(map);
    });
    var sw = new google.maps.LatLng(minLat, minLng);
    var ne = new google.maps.LatLng(maxLat, maxLng);
    var bounds = new google.maps.LatLngBounds(sw, ne)
    map.fitBounds(bounds);
}

function 


function executePan(newCenter) {
    //var newLatLng = new google.maps.LatLng(newLat, newLng);
    map.panTo(newCenter);
    locHist.push({ lat: newCenter.lat, lng: newCenter.lng, time: Date.now() });
    getCurrDirection();
}

function getCurrDirection() {
    //locHist.forEach(function (item) {
    //    console.log("lat", item.lat, "lng", item.lng, "time", item.time);
    //});
}

function startRouting() {
    map.setZoom(15);
    var move = 0;
    map.setCenter(selectedRoute[0]);
    console.log(selectedRoute[0]);
    move++;
    var refreshInterval = window.setInterval(function () {
        if (move < selectedRoute.length - 1) {
            executePan(selectedRoute[move]);
            move++;
        } else {
            clearInterval(refreshInterval);
        }
    }, 50);
}


function setMarker(pos, dist, time) {
    var mrkr = new google.maps.InfoWindow({
        content: "dist: " + dist + "time: " + time,
        map: map,
        position: pos
        
    });
}

//// Places Library Functions
////Note that we need to load Powered by Google Logo in our view...Legal Requirement

////Nearby Search Function

//var infowindow;

//function nearbySearch(type, setResults) {

//    console.log(locHist);
//    var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

//    map = new google.maps.Map(document.getElementById('map'), {
//        center: pyrmont,
//        zoom: 15
//    });

//    infowindow = new google.maps.InfoWindow();

//    var service = new google.maps.places.PlacesService(map);
//    service.nearbySearch({
//        location: pyrmont,
//        radius: 5000,
//        types: [type]
//    }, callback);

//}

////// Text Search Request

//    function initTextSearch() {
//        console.log(locHist);
//        var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

//        map = new google.maps.Map(document.getElementById('map'), {
//            center: pyrmont,
//            zoom: 15
//        });

//        infowindow = new google.maps.InfoWindow();

//        var service = new google.maps.places.PlacesService(map);

//        var request = {
//            location: pyrmont,
//            radius: 5000,
//            query: document.getElementById('textsearch').value
//                    };

//        service = new google.maps.places.PlacesService(map);
//        service.textSearch(request, callback);
//    }


//// radar search





////// Place details function

////function placeDetails(id, place, status)
////{
////    var request = {
////        placeId: id
////    };

////    service = new google.maps.places.PlacesService(map);
////    service.getDetails(request, callback);


//    function callback(results, status) {
//        console.log(results);
//        if (status === google.maps.places.PlacesServiceStatus.OK) {
//            for (var i = 0; i < results.length; i++) {
//                createMarker(results[i]);
//            }
//        }

//    }

//    function createMarker(place) {
//        var placeLoc = place.geometry.location;
//        var marker = new google.maps.Marker({
//            map: map,
//            position: place.geometry.location
//        });

//        google.maps.event.addListener(marker, 'click', function () {
//            infowindow.setContent(place.name);
//            infowindow.open(map, this);
//        });
//    }


// autocomplete

