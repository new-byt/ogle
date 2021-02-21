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
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.assign("/");
    })
    .catch((error) => {
      console.log(error);
    });
}

var loginButton = document.querySelectorAll(".login");
var logoutButton = document.querySelectorAll(".logout");
var createAccountButton = document.querySelectorAll(".create");
var links = document.querySelector(".links");

const elementsArray = [[".login", ".create"], [".logout"]];
const valueArray = [["none"], ["block"]];

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user);
    elementsArray.forEach((className, index) => {
      className.forEach((item) => {
        console.log(item, index);
        var element = document.querySelectorAll(item);
        element.forEach((elem) => {
          elem.style.display = valueArray[index];
        });
      });
    });
  }
  document.body.style.visibility = "visible";
});
