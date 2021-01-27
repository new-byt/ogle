const hamburgerButton = document.getElementsByClassName("hamburgerImage")[0];
const sidebar = document.getElementsByClassName("sidebar")[0];
const clickAway = document.getElementsByClassName("clickAway");

const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

var toggle = false;

//Open side navbar
hamburgerButton.addEventListener("click", function () {
  toggle = !toggle;
  if (toggle) {
    sidebar.style.right = "0px";
  } else {
    sidebar.style.right = "-70vw";
  }
});

//Click anywhere to close side navbar
Array.from(clickAway).forEach((element) => {
  element.addEventListener("click", function () {
    if (toggle) {
      hamburgerButton.click();
    }
  });
});

function pageLoaded() {
  document.body.style.visibility = "visible";
}
