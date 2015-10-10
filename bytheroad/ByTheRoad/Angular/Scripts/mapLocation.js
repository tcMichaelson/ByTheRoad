function initMap() {
    if (google) {
        return true;
    }

    //window.setInterval(function (data) {
    //    getCurrentLocation();
    //}, 5000)
}



//  findGenericFuturePosition("minutes", 30)

function startRouting() {
    map.setZoom(15);
    var move = 0;
    locHist = [];
    map.setCenter(selectedPath[0]);
    var carIcon = {
        url: "../../Content/Cars/sportCar0.png",
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 20)
    };
    if (car) {
        car.setMap(null);
    }
    car = new google.maps.Marker({
        position: selectedPath[0],
        map: map,
        icon: carIcon
    });

    console.log(selectedRoute);
    move++;
    var refreshInterval = window.setInterval(function () {
        if (move < 1500) {
            updateLocHist(selectedPath[move]);
            moveCar(selectedPath[move]);
            move++;
        } else {
            clearInterval(refreshInterval);
        }
    }, 1000);
}


