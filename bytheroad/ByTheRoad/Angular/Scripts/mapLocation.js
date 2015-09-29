
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
        zoom:20
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
                    console.log(results);
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
        findRouteAndDisplay(directionsDisplay, directionsService);
    }

    document.getElementById('input-btn').addEventListener('click', executePan);
    document.getElementById('route-btn').addEventListener('click', getRouteHandler);
}

function findRouteAndDisplay(directionsDisplay, directionsService) {
    var start = document.getElementById('origin').value;
    var end = document.getElementById('destination').value;
    var request = {
        origin: start,
        destination: end,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    console.log(directionsService.route(request, function (response, status) {
        console.log(response);
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            console.log(response);
        }
    }));
    mainRoute = response;
    directionsDisplay.setMap(map);

}

function displaySubRoute (){

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
        console.log("lat",item.lat, "lng", item.lng,"time", item.time);
    });
}




// Places Library Functions
//Note that we need to load Powered by Google Logo in our view...Legal Requirement

//Nearby Search Function
function nearby(long, lat, radius, id, type)
{
    function initialize(long, lat, radius, id, type) {
        var pyrmont = new google.maps.LatLng(long, lat);

        map = new google.maps.Map(document.getElementById(id), {
            center: pyrmont,
            zoom: 15
        });

        var request = {
            location: pyrmont,
            radius: radius,
            types: [type]
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(results[i]);
            }
        }
    }

}

// Text Search Request

function textSearch(long, lat, id, radius, userQuery)
{
    function initialize() {
        var pyrmont = new google.maps.LatLng(long, lat, id, radius, userQuery);

        map = new google.maps.Map(document.getElementById(id), {
            center: pyrmont,
            zoom: 15
        });

        var request = {
            location: pyrmont,
            radius: radius,
            query: userQuery
                    };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(results[i]);
            }
        }
    }
}

// Place details function

function placeDetails(id, place, status)
{
    var request = {
        placeId: id
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);

    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMarker(place);
        }
    }
}