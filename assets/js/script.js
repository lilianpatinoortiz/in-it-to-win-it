let weatherAPIKey = "6f71590911e8c3802b29fe6c49229551";
let jobsAPIKey = "d7fcf0a6a7msha1676c0d9f63b5ap104558jsn4347a1655b29";
let currentYear = dayjs().year();
let endDateNotFormatted = new Date(currentYear, 0, 1);
let endDate = endDateNotFormatted.toISOString().split("T")[0];
let startDate = subtractYears(endDateNotFormatted, 1)
  .toISOString()
  .split("T")[0];
let firstDayOfSpring = 80;
let lastDayOfSpring = 173;
let firstDayOfSummer = 174;
let lastDayOfSummer = 267;
let firstDayOfFall = 268;
let lastDayOfFall = 357;
let firstDayOfWinter = 358;
let lastDayOfWinter = 365;
let firstDayOfWinterOfYear = 0;
let lastDayOfWinterOfYear = 79;

var searchForm = document.querySelector("#search-form");
var searchButtonElement = document.querySelector(".button");

function subtractYears(date, years) {
  const dateCopy = new Date(date);
  dateCopy.setFullYear(date.getFullYear() - years);
  return dateCopy;
}

async function cityApiCall(location) {
  // 1. API call to get lat & lon from the city selected
  var url =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&limit=10&appid=" +
    weatherAPIKey;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("cityApiCall --------");
    console.log(data);
    return data[0];
  } catch (error) {
    console.error(error);
  }
}

async function weatherApiCall(cityLat, cityLon) {
  // 2. API call to get the weather of the year from the city selected
  var url =
    "https://archive-api.open-meteo.com/v1/archive?latitude=" +
    cityLat +
    "&longitude=" +
    cityLon +
    "&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max&temperature_unit=fahrenheit&windspeed_unit=ms&timezone=America%2FLos_Angeles" +
    "&start_date=" +
    startDate +
    "&end_date=" +
    endDate;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
      var allData = data.daily;
      var ourData = {};
      var springData = {};
      var summerData = {};
      var fallData = {};
      var winterData = {};

      function average(array) {
        // get average in array of numbers
        return array.reduce((x, y) => x + y) / array.length;
      }

      for (var key in allData) {
        if (key != "sunrise" && key != "sunset") {
          if (key != "temperature_2m_max") {
            springData[key] = Math.max.apply(
              Math,
              allData[key].slice(firstDayOfSpring, lastDayOfSpring)
            ); // spring lasts 93 days - we take the average for rain, snow, temp and wind
            summerData[key] = Math.max.apply(
              Math,
              allData[key].slice(firstDayOfSummer, lastDayOfSummer)
            ); // summer lasts 93 days - we take the average rain, snow, temp and wind
            fallData[key] = Math.max.apply(
              Math,
              allData[key].slice(firstDayOfFall, lastDayOfFall)
            ); // fall lasts 90 days - we take the average rain, snow, temp and wind
            var winterArray = allData[key]
              .slice(firstDayOfWinter, lastDayOfWinter)
              .concat(
                allData[key].slice(
                  firstDayOfWinterOfYear,
                  lastDayOfWinterOfYear
                )
              );
            winterData[key] = Math.max.apply(Math, winterArray);
            // winter lasts 88 days - we take the average rain, snow, temp and wind
          } else {
            springData[key] = average(
              allData[key].slice(firstDayOfSpring, lastDayOfSpring)
            ); // spring lasts 93 days - we take the average for rain, snow, temp and wind
            summerData[key] = average(
              allData[key].slice(firstDayOfSummer, lastDayOfSummer)
            ); // summer lasts 93 days - we take the average rain, snow, temp and wind
            fallData[key] = average(
              allData[key].slice(firstDayOfFall, lastDayOfFall)
            ); // fall lasts 90 days - we take the average rain, snow, temp and wind
            var winterArray = allData[key]
              .slice(firstDayOfWinter, lastDayOfWinter)
              .concat(
                allData[key].slice(
                  firstDayOfWinterOfYear,
                  lastDayOfWinterOfYear
                )
              );
            winterData[key] = average(winterArray); // winter lasts 88 days - we take the average rain, snow, temp and wind
          }
        } else {
          springData[key] = allData[key]
            .slice(firstDayOfSpring, lastDayOfSpring)[38]
            .split("T")[1]; // spring lasts 93 days - we take the middle value
          summerData[key] = allData[key]
            .slice(firstDayOfSummer, lastDayOfSummer)[38]
            .split("T")[1]; // summer lasts 93 days - we take the middle value
          fallData[key] = allData[key]
            .slice(firstDayOfFall, lastDayOfFall)[38]
            .split("T")[1]; // fall lasts 90 days - we take the middle value
          var winterArray = allData[key]
            .slice(firstDayOfWinter, lastDayOfWinter)
            .concat(
              allData[key].slice(firstDayOfWinterOfYear, lastDayOfWinterOfYear)
            );
          winterData[key] = winterArray[38].split("T")[1]; // winter lasts 88 days - we take the middle value
        }
      }
      ourData.spring = springData;
      ourData.summer = summerData;
      ourData.fall = fallData;
      ourData.winter = winterData;
      displayWeatherinUI(ourData);
    } else {
      console.log("Unable to get the weather");
    }
  } catch (error) {
    console.error(error);
  }
}

async function jobsApiCall(keyword, cityState) {
  // 3. Api call to get jobs in the given location

  jobLiEl.innerHTML = ""; // Clear the previous job listings
  const url =
    "https://jsearch.p.rapidapi.com/search?query=" +
    keyword +
    "%20in%20" +
    cityState +
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
    const result = await response.json();
    console.log("jobsApiCall --------");
    console.log(result);
    displayJobListInformation(result.data);
  } catch (error) {
    console.error(error);
  }
}

async function doApiCalls() {
  // Get the values entered in the keyword and location input fields
  var keyword = document.getElementById("keyword-input").value.trim();
  var location = document.getElementById("location-input").value.trim();

  console.log("keyword: " + keyword);
  console.log("location: " + location);

  // Check if either keyword or location is empty
  if (!keyword || !location) {
    console.error("You need a keyword and a location for the search!");
    return;
  }
  try {
    // Get the latitude, longitude, and state of the location
    const cityData = await cityApiCall(location);

    // Call the weatherApiCall function with the location data
    weatherApiCall(cityData.lat, cityData.lon);

    // Perform the job search with the entered keyword and location
    //jobsApiCall(keyword, location);
  } catch (error) {
    console.error(error);
  }
}

//searched job context
var jobLiEl = document.querySelector("#new-jobs");

function displayJobListInformation(result) {
  for (i = 0; i < result.length; i++) {
    const newJobs = document.createElement("div");
    const compName = document.createElement("h3");
    const jobTitle = document.createElement("li");
    const salary = document.createElement("li");
    const type = document.createElement("li");

    if (result[i].employer_name === null) {
      compName.textContent = "N/A";
    } else {
      compName.textContent = result[i].employer_name;
    }

    if (result[i].job_title === null) {
      jobTitle.textContent = "Unknown";
    } else {
      jobTitle.textContent = "Title: " + result[i].job_title;
    }

    if (result[i].job_min_salary === null) {
      salary.textContent = "Salary: Negotiable";
    } else {
      salary.textContent = "Salary: " + result[i].job_min_salary;
    }

    if (result[i].job_employment_type === null) {
      type.textContent = "N/A";
    } else {
      type.textContent = "Type: " + result[i].job_employment_type;
    }

    newJobs.className = "tile is-child job-summary";
    compName.className = "is-underlined";

    jobLiEl.appendChild(newJobs);
    newJobs.appendChild(compName);
    newJobs.appendChild(jobTitle);
    newJobs.appendChild(salary);
    newJobs.appendChild(type);
  }
}

function displayWeatherinUI(result) {
  console.log(result);
  for (var key in result) {
    // temperature
    var seasonDiv = document.querySelector("#weather-" + key);
    seasonDiv.querySelector("#temperature").textContent =
      result[key].temperature_2m_max.toFixed(2) + " ℉";
    // wmo (weather) - TO BE DONE
    seasonDiv.querySelector("#wmo-code").textContent =
      wmo[result[key].weathercode.toFixed()];

    // rain
    seasonDiv.querySelector("#rain").textContent =
      result[key].rain_sum.toFixed() + " mm - " + "rain warning";
    // snow
    seasonDiv.querySelector("#snow").textContent =
      result[key].snowfall_sum.toFixed(1) + " cm - " + "snow warning";
    // wind
    seasonDiv.querySelector("#wind").textContent =
      result[key].windspeed_10m_max.toFixed(2) + " m/s - " + "wind warning";

    // sunrise and sunset
    const xValues = [sunrise, sunset];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get a reference to the element where job listings will be displayed
  const jobLiEl = document.querySelector("#new-jobs");

  // Add an event listener to the search form
  searchForm.addEventListener("submit", async function (event) {
    console.log("****** search button clicked");
    event.preventDefault();
    doApiCalls();
  });
});

async function getParams() {
  console.log("****** redirected from initial page");
  const urlParams = new URLSearchParams(window.location.search);
  const keywordString = urlParams.get("keyword");
  const locationString = urlParams.get("location");
  document.getElementById("keyword-input").value = keywordString;
  document.getElementById("location-input").value = locationString;
  doApiCalls();
}

getParams();

/* wmo code - source: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM*/
var wmo = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  4: "Visibility reduced by smoke",
  5: "Haze",
  6: "Widespread dust in suspension in the air",
  7: "Dust or sand raised by wind",
  8: "Well developed dust whirl(s) or sand whirl(s)",
  9: "Duststorm or sandstorm within sight",
  10: "Mist",
  11: "Patches, shallow fog or ice fog",
  12: "More or less continuous shallow fog",
  13: "Lightning visible, no thunder heard",
  14: "Precipitation within sight, not reaching the ground or the surface of the sea",
  15: "Precipitation within sight, reaching the ground or the surface of the sea, but distant",
  16: "Precipitation within sight, reaching the ground or the surface of the sea, near to, but not at the station",
  17: "Thunderstorm, but no precipitation",
  18: "Squalls, at or within sight of the station",
  19: "Funnel cloud(s)",
  20: "Drizzle (not freezing) or snow grains",
  21: "Rain (not freezing)",
  22: "Snow",
  23: "Rain and snow or ice pellets",
  24: "Freezing drizzle or freezing rain",
  25: "Shower(s) of rain",
  26: "Shower(s) of snow, or of rain and snow",
  27: "Shower(s) of hail, or of rain and hail",
  28: "Fog or ice fog",
  29: "Thunderstorm (with or without precipitation)",
  30: "Slight or moderate duststorm or sandstorm",
  31: "Slight or moderate duststorm or sandstorm",
  32: "Slight or moderate duststorm or sandstorm",
  33: "Severe duststorm or sandstorm",
  34: "Severe duststorm or sandstorm",
  35: "Severe duststorm or sandstorm",
  36: "Slight or moderate blowing snow",
  37: "Heavy drifting snow",
  38: "Slight or moderate blowing snow",
  39: "Heavy drifting snow",
  40: "Fog or ice fog at a distance",
  41: "Fog or ice fog in patches",
  42: "Fog or ice fog, sky visible",
  43: "Fog or ice fog, sky visible",
  44: "Fog or ice fog, sky visible",
  45: "Fog or ice fog, sky visible",
  46: "Fog or ice fog, sky visible",
  47: "Fog or ice fog, sky visible",
  48: "Fog, depositing rime, sky visible",
  49: "Fog, depositing rime, sky invisible",
  50: "Drizzle, not freezing, intermittent",
  51: "Drizzle: Light",
  52: "Drizzle, not freezing, intermittent",
  53: "Drizzle: moderate",
  54: "Drizzle, not freezing, intermittent",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  58: "Drizzle and rain, slight",
  59: "Drizzle and rain, moderate or heavy",
  60: "Slight rain, not freezing, intermittent",
  61: "Slight rain",
  62: "Moderate rain, not freezing, intermittent",
  63: "Moderate rain",
  64: "Moderate rain",
  65: "High rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  68: "Rain or drizzle and snow, slight",
  69: "Rain or drizzle and snow, moderate or heavy",
  70: "Intermittent fall of snowflakes",
  71: "Slight snow",
  72: "Intermittent fall of snowflakes",
  73: "Moderate snow",
  74: "Intermittent fall of snowflakes",
  75: "Heavy snow",
  76: "Diamond dust (with or without fog)",
  77: "Snow grains",
  78: "Isolated star-like snow crystals (with or without fog)",
  79: "Ice pellets",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  83: "Shower(s) of rain and snow mixed, slight",
  84: "Shower(s) of rain and snow mixed, moderate or heavy",
  85: "Snow showers slight and heavy",
  86: "Snow showers slight and heavy",
  87: "Shower(s) of snow pellets or small hail, with or without rain or rain and snow mixed",
  88: "Shower(s) of snow pellets or small hail, with or without rain or rain and snow mixed",
  89: "Shower(s) of hail, with or without rain or rain and snow mixed, not associated with thunder",
  90: "Shower(s) of hail, with or without rain or rain and snow mixed, not associated with thunder",
  91: "Slight rain at time of observation",
  92: "Moderate or heavy rain ",
  93: "Slight snow, or rain and snow mixed or hail",
  94: "Moderate or heavy snow, or rain and snow mixed or hail",
  95: "Thunderstorm: Slight or moderate",
  96: "Thunderstorm with slight and heavy hail",
  97: "Thunderstorm, heavy, without hail** but with rain and/or snow at time of observation",
  98: "Thunderstorm combined with duststorm or sandstorm at time of observation",
  99: "Thunderstorm with slight and heavy hail",
};
