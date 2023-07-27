var searchFormEl = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var keywordInput = document.querySelector("#keyword-input").value;
  var cityInput = document.querySelector("#city-input").value;
  var countryInput = document.querySelector("#country-input").value;

  if (!keywordInput || !cityInput || !countryInput) {
    console.error("You need a search input value!");
    return;
  }

  var locQueryUrl = "./index.html?q=" + searchInputVal;
  console.log(locQueryUrl);
  document.location.href = locQueryUrl;
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
