
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