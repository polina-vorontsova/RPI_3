import { appConfig } from "./control.js";

const weatherApiKey = '904d9115373ba6faa8fdaf1c4e85c05d';

export async function setWeather() {
    let data = await getWeatherJSON(appConfig.city);
    if (data.cod == 200) {
        let currentWeather = data.list[0];
        setMainWeather(
            currentWeather.weather[0].description, 
            Math.round(currentWeather.main.temp), 
            Math.round(currentWeather.main.feels_like),
            currentWeather.wind.speed,
            currentWeather.main.humidity,
            currentWeather.weather[0].icon);
        let smallWeatherArray = document.getElementsByClassName("small-forecast");
        setSmallWeather(smallWeatherArray[0], data.list[8]);
        setSmallWeather(smallWeatherArray[1], data.list[16]);
        setSmallWeather(smallWeatherArray[2], data.list[24]);
        setCity(data.city.name, data.city.country);

        appConfig._timezoneOffset = data.city.timezone;
        setTime();
        appConfig.coordinates = [data.city.coord.lat, data.city.coord.lon];
    } else {
        alert("ГОРОД НЕ НАЙДЕН!");
        console.log(data);
    }
}

export async function setByCoordinates(coordinates) {
    let data = await getWeatherJSON(undefined, coordinates);
    if (data.cod == 200) {
        let currentWeather = data.list[0];
        setMainWeather(
            currentWeather.weather[0].description, 
            Math.round(currentWeather.main.temp), 
            Math.round(currentWeather.main.feels_like),
            currentWeather.wind.speed,
            currentWeather.main.humidity,
            currentWeather.weather[0].icon);
        let smallWeatherArray = document.getElementsByClassName("small-forecast");
        setSmallWeather(smallWeatherArray[0], data.list[8]);
        setSmallWeather(smallWeatherArray[1], data.list[16]);
        setSmallWeather(smallWeatherArray[2], data.list[24]);
        setCity(data.city.name, data.city.country);
        appConfig._timezoneOffset = data.city.timezone;
        if (appConfig.scale == "farenheit") {
            appConfig.scale = "farenheit";
        }
        setTime();
        appConfig._coordinates = [data.city.coord.lat, data.city.coord.lon];
    } else {
        alert("ГОРОД НЕ НАЙДЕН!");
        console.log(data);
    }
}

function setTime() {
    let nowTimestamp = Date.now();
    let currentOffset = new Date().getTimezoneOffset() * 60 * 1000;
    let newOffset = appConfig._timezoneOffset * 1000;
    let date = new Date( nowTimestamp + currentOffset + newOffset);

    let options = {weekday : 'long', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit"};
    const dateTimeElement = document.getElementById("date-time");

    dateTimeElement.innerHTML = date.toLocaleString(appConfig.locale, options);
    setTimeout(setTime, 1000);
}

async function getWeatherJSON(city, coords) 
{
    let link;
    if (city != undefined) {
        link = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric&lang=${appConfig.locale}`;
    } else {
        link = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${weatherApiKey}&units=metric&lang=${appConfig.locale}`;
    }
    let response = await fetch(link);
    return await response.json();
}

function setCity(city, region) {
    const countryCityElement = document.getElementById("country-city");
    appConfig._city = city;
    localStorage.setItem("city", city);
    //объект обеспечивает согласованный перевод отображаемых имен языков, регионов и сценариев
    let regionFull = new Intl.DisplayNames([appConfig.locale], {type: 'region'}).of(region); 
    countryCityElement.innerHTML = `${city}, ${regionFull}`;
}

function setMainWeather(description, temperature, feelsLike, wind, humidity, iconCode) {
    const temperatureElement = document.getElementById("temperature-value");
    const descriptionElement = document.getElementById("description");
    const feelsLikeElement = document.getElementById("feels-like-value");
    const windElement = document.getElementById("wind-value");
    const humidityElement = document.getElementById("humidity-value");
    const mainIconElement = document.getElementById("main-weather-image").getElementsByTagName("img")[0];

    descriptionElement.innerHTML = description;
    temperatureElement.innerHTML = temperature + '°';
    feelsLikeElement.innerHTML = feelsLike;
    windElement.innerHTML = wind;
    humidityElement.innerHTML = humidity;
    let iconLink = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    mainIconElement.setAttribute("src", iconLink);
}

function setSmallWeather(domElement, jsonData) {
    let temperature = jsonData.main.temp;
    let iconCode = jsonData.weather[0].icon;
    let date = new Date(jsonData.dt * 1000);
    let weekDay = date.toLocaleDateString(appConfig.locale, { weekday: 'long' });;

    let weekDayElement = domElement.getElementsByClassName("week-day")[0];
    let temperatureElement = domElement.getElementsByClassName("future-temperature")[0];
    weekDayElement.innerHTML = weekDay;
    temperatureElement.innerHTML = `${Math.floor(temperature)}°`;
    let iconLink = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    let iconElement = domElement.getElementsByClassName("small-weather-icon")[0].getElementsByTagName("img")[0];
    iconElement.setAttribute("src", iconLink);
}

