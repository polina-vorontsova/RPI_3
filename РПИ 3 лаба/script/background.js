import {appConfig} from './control.js';

let unsplashApiKey = 'gXNjWMR-9RKHQXujy39K5ApV5XFK36Q0Cqg91p0PlgI';

async function getPhoto() {

    let nowTimestamp = Date.now();
    let currentOffset = new Date().getTimezoneOffset() * 60 * 1000;
    let newOffset = appConfig._timezoneOffset * 1000;
    let date = new Date( nowTimestamp + currentOffset + newOffset);

    let dateOptions = {month : 'numeric'};
    let month = (parseInt(date.toLocaleString("en", dateOptions)) + 1) % 12;//возвращает строку с языкозависимым предст. числа

    let season = month <= 3 ? "winter" : month <= 6 ? "spring" : month <= 9 ? "summer" : "autumn";
    let hour = date.getHours();
    let daytime =  hour <= 6 ? "night" : hour <= 12 ? "morning" : hour <= 18 ? "day" : "evening";  
    let queryString = `https://api.unsplash.com/photos/random?query=nature&query=animals&client_id=${unsplashApiKey}&query=${season}&query=${daytime}&query=${appConfig.city}`;
    console.log(queryString);
    fetch(queryString).then(
        data => {
            let json = data.json();
            console.log(json);
            return json;
        }
    ).then(
        data => {
            let image = new Image();
            image.onload = () => document.body.style.backgroundImage = `url('${image.src}'`;
            image.src = data.urls.regular;
        }
    );
}

const refreshButton = document.getElementById("refresh");
refreshButton.addEventListener('click', getPhoto);

getPhoto();