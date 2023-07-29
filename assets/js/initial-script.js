var searchFormEl = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var keywordString = document.querySelector("#keyword-input").value;
  var locationString = document.querySelector("#city-input").value;

  if (!keywordString || !locationString) {
    console.error("You need a search input value!");
    return;
  }

  var locQueryUrl =
    "./index.html?keyword=" + keywordString + "&location=" + locationString;
  document.location.href = locQueryUrl;
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);