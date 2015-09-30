
var map;
var locHist = [];
var service;
var infowindow;
var moves = 0;
var newLat = 45;
var newLng = -90;
var mainRoute;

function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var geocoder = new google.maps.Geocoder;
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: newLat, lng: newLng },
        zoom: 18
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
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
            var dir = getCurrDirection();

        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }

    console.log(locHist);
    /*

    window.setInterval(function () {
        if (moves < 5) {
            console.log(moves);
            executePan(map);
            moves++;
        }
    }, 1000);
    */

    var getRouteHandler = function () {
        findRouteAndDisplay(directionsService);
    }

    document.getElementById('input-btn').addEventListener('click', initTextSearch);
    document.getElementById('route-btn').addEventListener('click', getRouteHandler);
}

function findRouteAndDisplay(directionsService) {
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
            mainRoute = response;
        }
    });
}

function renderLines(response) {
    var routeLines = null;
    routeLines = [];
    var minLat = maxLat = map.center.H;
    var minLng = maxLng = map.center.L;
    response.routes.forEach(function (route, idx) {
        var coords = [];
        route.legs.forEach(function (leg) {
            leg.steps.forEach(function (step) {
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
        switch (idx % 4) {
            case 0:
                colHex = "#ff7f50";
                break;
            case 1:
                colHex = "#00ff00"
                break;
            case 2:
                colHex = "#0000ff"
                break;
            case 3:
                colHex = "#000000";
                break;
        }

        routeLines[idx] = new google.maps.Polyline({
            path: coords,
            strokeColor: colHex,
            strokeWeight: 2
        });
        routeLines[idx].setMap(null);
        routeLines[idx].setMap(map);
    });
    var sw = new google.maps.LatLng(minLat, minLng);
    var ne = new google.maps.LatLng(maxLat, maxLng);
    var bounds = new google.maps.LatLngBounds(sw, ne)
    map.fitBounds(bounds);
    map.panToBounds(bounds);
}

function displaySubRoute() {

}

function executePan() {
    newLat = newLat - .025;
    newLng = newLng - .025;
    var newLatLng = new google.maps.LatLng(newLat, newLng);
    map.panTo(newLatLng);
    locHist.push({ lat: newLat, lng: newLng, time: Date.now() });
    getCurrDirection();
}

function getCurrDirection() {
    locHist.forEach(function (item) {
        console.log("lat", item.lat, "lng", item.lng, "time", item.time);
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

