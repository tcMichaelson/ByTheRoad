


function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45, lng: -90 },
        zoom: 9
    });

    directionsDisplay.setMap(map);

    var onChangeHandler = function () {
        calcRoute(directionsService, directionsDisplay);
    };
    document.getElementById('button').addEventListener('click', onChangeHandler);

    window.setInterval(function () {
        executePan(map);
    }, 5000)
}

function executePan(map) {
    var pos = {
        lat: map.center.L += .025,
        lng: map.center.H += .025
    };
    map.panTo(pos);
}

function ReCenter(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: map.center.L += .025,
                lng: map.center.H += .025
            };
            map.panTo(new google.maps.LatLng(lat, lng));
        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }
}