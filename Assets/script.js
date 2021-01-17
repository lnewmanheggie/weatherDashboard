let currentDay = moment().format("l");

const cardBox = $("#card-box");
const sidebar = $("#sidebar");
const searchBar = $("#search");
const searchBtn = $("#search-btn");
const search_form = $("#search_form");

$(document).ready(function () {
    populatePage();
    search_form.on("submit", getCityName);
})

function populatePage() {
    const searchedCities = getCity();
    if (!searchedCities.length) return;

    getLatLon(searchedCities[0]);
    sidebar.empty()
    for (let i = 0; i < searchedCities.length; i++) {
        let citySidebar = $("<li>").attr("class", "list-group-item").text(searchedCities[i]);
        citySidebar.on("click", getSidebarData);
        sidebar.append(citySidebar);
    }
}

function getSidebarData() {
    let clicked = $(this).text();
    saveCity(clicked);
}

function getCityName(event) {
    event.preventDefault();
    const cityVal = searchBar.val();
    searchBar.val('')
    saveCity(cityVal);
}

function getLatLon(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=692bc0b6ed564788405b67294e6bce50";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        predictedDays(lat, lon, cityName);
    });
}

function predictedDays(lat, lon, cityName) {
    let queryURLDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely&appid=692bc0b6ed564788405b67294e6bce50"

    $.ajax({
        url: queryURLDay,
        method: "GET"
    }).then(function (response) {

        createCards();

        let arr = response.daily;

        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i].temp.day;
            let humidity = arr[i].humidity;
            let windSpeed = arr[i].wind_speed;
            let uvIndex = arr[i].uvi;
            let iconCode = arr[i].weather[0].icon;

            let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

            if (i === 0) {
                cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1); // convert first letter to uppercase
                $("#city-name").text(cityName + " (" + currentDay + ")");
                $("#temp").text(temp + "°F");
                $("#humidity").text(humidity + "%");
                $("#wind").text(windSpeed + "MPH");
                $("#uv").text(uvIndex);
                if (uvIndex >= 3 && uvIndex < 6) {
                    $("#uv").attr("class", "badge badge-warning")
                } else if (uvIndex < 3) {
                    $("#uv").attr("class", "badge badge-success")
                } else {
                    $("#uv").attr("class", "badge badge-danger")
                }
                let img = $("<img>").attr("src", iconUrl)
                img.attr("class", "big-icon");
                $("#icon").empty();
                $("#icon").append(img);
            }
            else {
                let card = $("#card-" + i);
                let img = $("<img>").attr("src", iconUrl)
                img.attr("style", "height: 4rem; width: 4rem")
                card.append($("<h5>").text(moment().add(i, 'days').format("l")))
                card.append(img);
                card.append($("<p>").text("Temp: " + temp + "°F"));
                card.append($("<p>").text("Humidity: " + humidity + "%"));
            }

        }
    });
}

function createCards() {
    cardBox.empty();
    for (let i = 1; i < 6; i++) {
        let card = $("<div>").attr("class", "weather-card").attr("id", "card-" + i);
        cardBox.append(card);
    }
}

function saveCity(cityVal) {
    let searchedCities = getCity();

    while (searchedCities.indexOf(cityVal) !== -1) {
        searchedCities.splice(searchedCities.indexOf(cityVal), 1)
    }

    searchedCities.unshift(cityVal);

    while (searchedCities.length > 6) {
        searchedCities.pop()
    }

    setCity(searchedCities);

    populatePage()
}

function getCity() {
    return JSON.parse(localStorage.getItem("searchedCities")) || []
}
function setCity(val) {
    localStorage.setItem("searchedCities", JSON.stringify(val))
}


