
var map;
var locHist = [];
var service;
var infowindow;

function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45, lng: -90 },
        zoom: 9
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
        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }

    directionsDisplay.setMap(map);
    var dir = getCurrDirection();

    /*
    var onChangeHandler = function () {
        calcRoute(directionsService, directionsDisplay);
    };
    document.getElementById('button').addEventListener('click', onChangeHandler);

    window.setInterval(function () {
        executePan(map);
    }, 5000)
    */
}

function getCurrDirection() {
    locHist.forEach(function (item) {
        console.log('in get directions.');
        console.log(item.lat, item.lng, item.time);
    });
    return "west";
}

function executePan(map) {
    var pos = {
        lat: map.center.L += .025,
        lng: map.center.H += .025
    };
    map.panTo(pos);
}

function ReCenter(map) {
    
}


// Places Library Functions
//Note that we need to load Powered by Google Logo in our view...Legal Requirement

//Nearby Search Function
function nearby(long, lat)
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

function textSearch(long, lat)
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

function placeDetails(id)
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