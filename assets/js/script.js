let APIKey = "6f71590911e8c3802b29fe6c49229551";
var cityName = "Texas";

async function weatherApiCall(cityLat, cityLon) {
  // API call to get the weather of the year from the city selected
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
  } catch (error) {
    console.error(error);
  }
}

async function cityApiCall() {
  // API call to get lat & lon from the city selected
  var url =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=" +
    APIKey;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("cityApiCall --------");
    console.log(data);
    var cityLat = data[0].lat;
    var cityLon = data[0].lon;
    weatherApiCall(cityLat, cityLon);
  } catch (error) {
    console.error(error);
  }
}

cityApiCall();
