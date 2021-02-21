//Search bar
let searchBar = document.querySelector(".search");
searchBar.addEventListener("keydown", function (keypress) {
  if (keypress.key === "Enter") {
    window.location.assign(
      "/viewfilms?search=" + searchBar.value.toLowerCase()
    );
  }
});
