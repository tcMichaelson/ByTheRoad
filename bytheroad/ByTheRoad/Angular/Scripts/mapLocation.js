
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
        zoom:20
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            locHist.push({ lat: pos.lat, lng: pos.lng, time: Date.now() });
            console.log(pos.lat, pos.lng);
            var dir = getCurrDirection();

        }, function () {
            handleLocationError(true, null, map.getCenter());
        });
    } else {
        handleLocationError(false, null, map.getCenter());
    }

    directionsDisplay.setMap(map);
    console.log(locHist);

    /*
    var onChangeHandler = function () {
        calcRoute(directionsService, directionsDisplay);
    };
    window.setInterval(function () {
        if (moves < 5) {
            console.log(moves);
            executePan(map);
            moves++;
        }
    }, 1000);
    */



    document.getElementById('input-btn').addEventListener('click', executePan);

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




//// Places Library Functions
////Note that we need to load Powered by Google Logo in our view...Legal Requirement

////Nearby Search Function

    //function initNearbySearch() {

    //    var request = {
    //        location: { lat: locHist[0].lat, lng: locHist[0].lng },
    //        radius: '500',
    //        types: ['store']
    //        //types: [document.getElementById('search').value]
    //    };

    //    service = new google.maps.places.PlacesService(map);
    //    service.nearbySearch(request, callback);
    //}

    //function callback(results, status) {
    //    if (status == google.maps.places.PlacesServiceStatus.OK) {
    //        for (var i = 0; i < results.length; i++) {
    //            var place = results[i];
    //            createMarker(results[i]);
    //        }
    //    }
    //}

var infowindow;

function nearbySearch() {
    console.log(locHist);
    var pyrmont = { lat: locHist[0].lat, lng: locHist[0].lng };

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 5000,
        types: ['gas_station']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}




//// Text Search Request


    function initTextSearch() {
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


//// Place details function

//function placeDetails(id, place, status)
//{
//    var request = {
//        placeId: id
//    };

//    service = new google.maps.places.PlacesService(map);
//    service.getDetails(request, callback);

  
//}

//function callback(place, status) {
//        if (status == google.maps.places.PlacesServiceStatus.OK) {
//            createMarker(place);
//        }
//    }