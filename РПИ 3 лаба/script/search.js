import {appConfig} from "./control.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("search-button");

searchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        appConfig.city = searchInput.value;
    }
});

searchButton.addEventListener("click", (e) => {
    console.log(e);
    appConfig.city = searchInput.value;
});