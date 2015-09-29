
var map;
var locHist = [];
var service;
var infowindow;
var moves = 0;
var newLat = 45;
var newLng = -90;

function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: newLat, lng: newLng },
        zoom:12
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now() });
            console.log(locHist);
            console.log('in map init');
            var dir = getCurrDirection();
            console.log(map);
            console.log(map.gm_bindings_);

        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }

    directionsDisplay.setMap(map);

    /*
    var onChangeHandler = function () {
        calcRoute(directionsService, directionsDisplay);
    };
    */
    window.setInterval(function () {
        if (moves < 5) {
            console.log(moves);
            executePan(map);
            moves++;
        }
    }, 1000);
    
    
    document.getElementById('input-btn').addEventListener('click', executePan);
}

function executePan() {
    newLat = newLat - .025;
    newLng = newLng - .025;
    console.log(newLat, newLng);
    var newLatLng = new google.maps.LatLng(newLat, newLng);
    map.panTo(newLatLng);
}

function getCurrDirection() {
    locHist.forEach(function (item) {
        console.log('in get directions.');
        console.log(item.lat, item.lng, item.time);
    });
    return "west";
}



function ReCenter(map) {
    
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