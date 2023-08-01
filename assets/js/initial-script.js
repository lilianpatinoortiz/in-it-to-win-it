var searchFormEl = document.querySelector("#search-nav");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var keywordString = document.querySelector("#keyword-input").value;
  var locationString = document.querySelector("#city-input").value;

  if (!keywordString || !locationString) {
    Swal.fire({
      text: "Unknown keyword or location, please retry!",
      icon: "warning",
      background: "white",
      confirmButtonText: "Retry",
    });
    console.error("You need a search input value!");
    return;
  }

  var locQueryUrl =
    "./index.html?keyword=" + keywordString + "&location=" + locationString;
  document.location.href = locQueryUrl;
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
