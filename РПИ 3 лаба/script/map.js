import {appConfig} from './control.js';

var myMap;
export function updateMap(coords) {
    if (myMap != undefined) {
        setLongitudeAndLatitude(coords);
        myMap.setCenter(coords, myMap.getZoom(), {duration : 500}); 
        let myGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: coords
            }
        });
        myMap.geoObjects.removeAll();
        myMap.geoObjects.add(myGeoObject);
    }
}
//yandex map api key: 1e754afd-3073-488f-bc7c-0fdc6e1cf099
ymaps.ready(init);
function setLongitudeAndLatitude(coords) {
    let latitude = document.getElementById("latitude-value");
    let convertedLatitude = convertCoordinates(coords[0]);
    latitude.innerHTML = `${convertedLatitude.deg}°${convertedLatitude.minutes}'${convertedLatitude.seconds}`;
    let longitude = document.getElementById("longitude-value");
    let convertedLongitude = convertCoordinates(coords[1]);
    longitude.innerHTML = `${convertedLongitude.deg}°${convertedLongitude.minutes}'${convertedLongitude.seconds}`;
}

function convertCoordinates(coord) {
    let sign = coord >= 0;
    coord = Math.abs(coord);
    let grads = Math.floor(coord);
    coord -= grads;
    coord *= 100;
    let mins = Math.floor(coord / 100 * 60);
    coord -= Math.floor(coord);
    coord *= 100;
    let sec = Math.floor(coord / 100 * 60);
    return {
        deg : sign ? grads : -grads,
        minutes : mins,
        seconds : sec
    }
}

function init() {
    myMap = new ymaps.Map("map", {
        center: appConfig.coordinates,
        zoom: 7 //уровень масштабірования
    });
    
//удаление элементов управления
    myMap.controls.remove("fullscreenControl");
    myMap.controls.remove("routeEditor");
    myMap.controls.remove("rulerControl");
    myMap.controls.remove("searchControl");
    myMap.controls.remove("trafficControl");
    myMap.controls.remove("typeSelector");
    myMap.controls.remove("routeButtonControl");
    myMap.controls.remove("routePanelControl");

    setLongitudeAndLatitude(myMap.getCenter());

    let mark = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: myMap.getCenter()
        }
    });
    myMap.geoObjects.add(mark);

    myMap.events.add('click', function (e) {
        // Получение координат щелчка
        let coords = e.get('coords');
        console.log(coords);
        appConfig.coordinates = coords;
    });
}
