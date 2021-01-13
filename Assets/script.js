let cityNew = "Minneapolis";
var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityNew + "&appid=692bc0b6ed564788405b67294e6bce50";

// api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}

// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key} 692bc0b6ed564788405b67294e6bce50

// We then created an AJAX call
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
//   let city = response.name;
//   let wind = response.wind.speed;
//   let humidity = response.main.humidity;
//   let k = response.main.temp
//   let f = (k - 273.15) * 1.80 + 32;
//   f = f.toFixed(1);
});

const cardBox = $("#card-box");
const sidebar = $("#sidebar");
const searchBar = $("#search");
const searchBtn = $("#search-btn");

let cityVal;


$(document).ready(function() {
    searchBtn.on("click", getData);
})


function getData(event) {
    event.preventDefault();
    cityVal = searchBar.val();
    saveCity();

}


function createCards() {
    for (let i = 0; i < 6; i++) {
        let card = $("<div>").addClass("col-md-2 weather-card").attr("id", "card-" + i);
        cardBox.append(card);
    }
}

function createList() {
    let listItem = $("<li>").addClass("list-group-item");
    sidebar.append(listItem);
}

function saveCity() {
    let searchedCities = getCity();
    
    searchedCities.push(cityVal);
    
    setCity(searchedCities);
}

function getCity() {
    return JSON.parse(localStorage.getItem("searchedCities")) || []
}
function setCity(val) {
    localStorage.setItem("searchedCities", JSON.stringify(val))
}


