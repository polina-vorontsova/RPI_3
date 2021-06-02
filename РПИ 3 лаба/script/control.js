import {setByCoordinates, setWeather} from "./weather.js";
import {updateMap} from "./map.js";

const localeStrings = {
    "ru" : {
        "feels-like" : "ощущается",
        "wind" : "ветер",
        "humidity" : "влажность",
        "search": "поиск",
        "latitude": "широта",
        "longitude": "долгота"
    }, 
    "en" : {
        "feels-like" : "feels like",
        "wind" : "wind",
        "humidity" : "humidity",
        "search": "search",
        "latitude": "latitude",
        "longitude": "longitude"
    }
}

class AppConfig {

    constructor() {
        let storageLocale = localStorage.getItem("locale");
        let storageScale = localStorage.getItem("scale");
        let storageCity = localStorage.getItem("city");
        if (storageLocale == null) {
            this._locale = "ru";
        } else {
            this._locale = storageLocale;
        }

        if (storageScale == null) {
            this._scale = "celcius";
        } else {
            this._scale = storageScale;
            if (this._scale == "farenheit") {
                animateSlider();
            }
        }

        if (storageCity == null) {
            this._city = "Minsk";
        } else {
            this._city = storageCity;
        }
    }

    _coordinates = [];
    _timezoneOffset = 0;

    set locale(value) {
        this._locale = value;

        let activeChoice = document.getElementById("active-option");
        activeChoice.innerText = this._locale.toUpperCase();

        const feelsLikeLabel = document.getElementById("feels-like-label");
        const windLabel = document.getElementById("wind-label");
        const humidityLabel = document.getElementById("humidity-label");
        const searchButton = document.getElementById("search-button");
        const longitudeLabel = document.getElementById("longitude-label");
        const latitudeLabel = document.getElementById("latitude-label");

        feelsLikeLabel.innerHTML = localeStrings[value]["feels-like"];
        windLabel.innerHTML = localeStrings[value]["wind"];
        humidityLabel.innerHTML = localeStrings[value]["humidity"];
        searchButton.innerHTML = "<h4>" + localeStrings[value]["search"] + "</h4>";
        longitudeLabel.innerHTML = localeStrings[value]["longitude"];
        latitudeLabel.innerHTML = localeStrings[value]["latitude"];
        
        setWeather();
        localStorage.setItem("locale", this._locale);
    }
    get locale() {
        return this._locale;
    }
    set coordinates(value) {
        this._coordinates = value;
        setByCoordinates(value);
        updateMap(value);
    }
    
    get coordinates() {
        return this._coordinates;
    }

    set city(value) {
        this._city = value;
        setWeather();
        localStorage.setItem("city", this._city);
    }

    get city() {
        return this._city;
    }
    set scale(value) {
        this._scale = value;
        if (this._scale == "celcius") {
            convertToCelcius(document.getElementById('temperature-value'));
            convertToCelcius(document.getElementById('feels-like-value'));
            convertToCelcius(document.getElementsByClassName('future-temperature')[0]);
            convertToCelcius(document.getElementsByClassName('future-temperature')[1]);
            convertToCelcius(document.getElementsByClassName('future-temperature')[2]);
        } else if (this._scale == "farenheit") {
            convertToFarenheit(document.getElementById('temperature-value'));
            convertToFarenheit(document.getElementById('feels-like-value'));
            convertToFarenheit(document.getElementsByClassName('future-temperature')[0]);
            convertToFarenheit(document.getElementsByClassName('future-temperature')[1]);
            convertToFarenheit(document.getElementsByClassName('future-temperature')[2]);
        }
        localStorage.setItem("scale", this._scale);
    }
    get scale() {
        return this._scale;
    }
};

export let appConfig = new AppConfig();
appConfig.city = appConfig.city;
appConfig.locale = appConfig.locale;
appConfig.scale = appConfig.scale;


var x = 0;
var position = 0;
let temperatureChoice = document.getElementById("temperature-choice");
temperatureChoice.addEventListener("click", animateSlider);
temperatureChoice.addEventListener("click", () => {
    if (appConfig.scale == 'celcius') {
        appConfig.scale = 'farenheit';
    } else {
        appConfig.scale = 'celcius';
    }
});

function animateSlider(e) {
    position = position == 0 ? 1 : 0;
    let temperatureChoiceSlider = document.getElementById("temperature-choice-slider");
    if (x == 0) {
        temperatureChoiceSlider.animate([
            {transform: `translate3D(${x}px, 0, 0)`},
            {transform: 'translate3D(44px, 0, 0)'},
        ], {
            duration: 200,
            iterations: 1, 
            fill: 'forwards'
        });
        x += 44;
    } else  {
        temperatureChoiceSlider.animate([
            {transform: `translate3D(${x}px, 0, 0)`},
            {transform: 'translate3D(0px, 0, 0)'},
        ], {
            duration: 200,
            iterations: 1, 
            fill: 'forwards'
        });
        x -= 44;
    }
};

if (appConfig.scale == "farenheit") {
    animateSlider();
}

function convertToCelcius(domElement) {
    let currentValue = parseInt(domElement.innerHTML.substring(0, domElement.innerHTML.length));
    let newValue = Math.floor((currentValue - 32) * 5 / 9);
    domElement.innerHTML = `${newValue}°`;
}

function convertToFarenheit(domElement) {
    let currentValue = parseInt(domElement.innerHTML.substring(0, domElement.innerHTML.length));
    let newValue = Math.ceil((currentValue * 9 / 5) + 32);
    domElement.innerHTML = `${newValue}°`;
}

const languageChoice = document.getElementById("language-choice");

languageChoice.onclick = () => {
    if (appConfig.locale == "ru") {
        appConfig.locale = "en";
    } else {
        appConfig.locale = "ru";
    }
}