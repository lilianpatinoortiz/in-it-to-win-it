let weatherAPIKey = "6f71590911e8c3802b29fe6c49229551"; // feel free to put yours!
let jobsAPIKey = "bcb287f285mshb6ac2f0478c16f0p127325jsn154ee8e2efdc"; // feel free to put yours!
var searchButtonElement = document.querySelector(".button");
var keywordElement = document.querySelector("#keyword-input");
var locationElement = document.querySelector("#location-input");

var keywordValue;
var locationValue;

async function jobsApiCall(cityState) {
  // 3. Api call to get jobs in the given location
  const url =
    "https://jsearch.p.rapidapi.com/search?query=" +
    keywordValue +
    "in%20" +
    locationValue +
    "&page=1&num_pages=1";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": jobsAPIKey,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log("jobsApiCall --------");
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function weatherApiCall(cityLat, cityLon, cityState) {
  // 2. API call to get the weather of the year from the city selected
  var url =
    "https://archive-api.open-meteo.com/v1/archive?latitude=" +
    cityLat +
    "&longitude=" +
    cityLon +
    "&start_date=2022-07-20&end_date=2023-07-20&daily=rain_sum,snowfall_sum&timezone=America%2FLos_Angeles";
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("weatherApiCall --------");
    console.log(data);
    //jobsApiCall(cityState);
  } catch (error) {
    console.error(error);
  }
}

async function cityApiCall() {
  // 1. API call to get lat & lon from the city selected
  var url =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    locationValue +
    "&limit=10&appid=" +
    weatherAPIKey;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("cityApiCall --------");
    console.log(data);
    var cityLat = data[0].lat;
    var cityLon = data[0].lon;
    var cityState = data[0].state;
    weatherApiCall(cityLat, cityLon, cityState);
  } catch (error) {
    console.error(error);
  }
}
function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const keywordString = urlParams.get("keyword");
  const locationString = urlParams.get("location");
  console.log(keywordString);
  console.log(locationString);
  keywordElement.value = keywordString;
  keywordValue = keywordString;
  locationElement.value = locationString;
  locationValue = locationString;
  cityApiCall();
}

var searchFormEl = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  event.preventDefault();
  keywordValue = document.querySelector("#keyword-input").value;
  locationValue = document.querySelector("#location-input").value;
  if (!keywordValue || !locationValue) {
    console.error("You need a search input value!");
    return;
  }
  var locQueryUrl =
    "./index.html?keyword=" + keywordValue + "&location=" + locationValue;
  document.location.href = locQueryUrl;
}

searchButtonElement.addEventListener("submit", handleSearchFormSubmit);

getParams();
