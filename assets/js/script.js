let weatherAPIKey = "6f71590911e8c3802b29fe6c49229551"; // feel free to put yours!
let jobsAPIKey = "d7fcf0a6a7msha1676c0d9f63b5ap104558jsn4347a1655b29"; // new key is not working

var searchForm = document.querySelector("#search-form");
var searchButtonElement = document.querySelector(".button");

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
    jobsApiCall(keyword, location);
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
