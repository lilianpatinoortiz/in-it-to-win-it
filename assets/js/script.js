
let weatherAPIKey = "6f71590911e8c3802b29fe6c49229551"; // feel free to put yours!
let jobsAPIKey = "991596ba1amsh552f7f85c7ca672p17b652jsn773224bb2532";  // old key 
// let jobsAPIKey = "cff46117admsh3bff66b81994c8ep12d733jsn4c20d3297f0a"; // new key is not working


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
    const result = await response.json();
    console.log("jobsApiCall --------");
    console.log(result);
    jobListInformation(result.data);
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
    jobsApiCall(cityState);
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

 // Wait for the DOM to be fully loaded before running the JavaScript code
document.addEventListener("DOMContentLoaded", function () {
  // Get a reference to the search form element
  const searchForm = document.getElementById("search-form");

  // Add an event listener to the search form
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the values entered in the keyword and location input fields
    var keyword = document.getElementById("keyword-input").value.trim();
    var location = document.getElementById("location-input").value.trim();

    // Check if either keyword or location is empty
    if (!keyword || !location) {
      console.error("You need a keyword and a location for the search!");
      return;
    }
      // Clear the previous job listings
  // jobLiEl.innerHTML = "";
    // Perform the job search with the entered keyword and location
    getParams(keyword, location);

  });
});

//searched job context
var jobLiEl = document.querySelector("#new-jobs");

function jobListInformation(result) {
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
getParams();
