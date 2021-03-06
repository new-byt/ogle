const main = document.querySelector(".genres");
const template = document.querySelector("#genreTemplate");
const categoryName = document.querySelector(".categoryName");
const url = new URLSearchParams(window.location.search);
const search = url.get("search");
const elementArray = [
  [".genreName", "innerText"],
  [".genrePic", "src"],
];

//Set search bar value
searchBar.value = search;
if (search) {
  categoryName.innerText = "Results for: " + search;
}
//Gets films
(async function () {
  var genreArray = [];
  await db
    .collection("movies")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        film = doc.data();
        if (film.title !== "none") {
          newGenre = true;
          for (i = 0; i < genreArray.length; i++) {
            if (genreArray[i][0] == film.genre) {
              console.log("Duplicate");
              genreArray[i].push([film]);
              newGenre = false;
              break;
            }
          }
          if (newGenre) {
            genreArray.push([film.genre, [film]]);
          }
        }
      });
    });
  console.log(genreArray);
  createCategoryBox(genreArray); //Read query when page loaded
  if (window.location.search.length > 1) {
    if (url.get("genre")) {
      let loadGenre = url.get("genre");
      let genreToLoad = document.querySelector("." + loadGenre);
      genreToLoad.click();
    } else if (search) {
      loadSearchResults(genreArray);
    }
  }
  console.log(window.location.search);
})();

//load search results
function loadSearchResults(genreArray) {
  document.querySelector(".genres").style.display = "none";
  let films = document.getElementsByClassName("filmInfo");
  genreArray.forEach((genreFilms) => {
    genreFilms[1].forEach((film) => {
      addFilm(film);
    });
  });
  for (i = 0; i < films.length; i++) {
    let filmName = films[i].querySelector(".filmName");
    title = filmName.textContent || filmName.innerText;
    if (title.toUpperCase().indexOf(search.toUpperCase()) > -1) {
      console.log(title.toUpperCase());
      films[i].style.display = "";
    } else {
      films[i].style.display = "none";
    }
  }
  addRedirects();
}
//Split duplicate genres and send them to a neww function
function createCategoryBox(genreArray) {
  genreArray = [...new Set(genreArray)]; //Remove duplicate genres
  //console.log(genreArray);
  genreArray.forEach((genre) => {
    createBox(genre);
  });
}

//Create box for genre
async function createBox(genre) {
  var templateClone = template.content.cloneNode(true);
  //Category bar name
  let genreBox = templateClone.querySelector(".genreBox");
  let strippedGenre = genre[0]
    .toLowerCase()
    .replace("'", "")
    .split(" ")
    .join("");
  genreBox.classList.add(strippedGenre);
  //Name
  var name = templateClone.querySelector(".genreName");
  name.innerText = genre[0];
  //Picture
  addPicture(genre[1][0].photo, templateClone);
  eventListenerFunc(
    templateClone.querySelector(".genreBox"),
    genre,
    strippedGenre
  );
  main.appendChild(templateClone);
}

//addEventListener function
function eventListenerFunc(box, genre, strippedGenre) {
  box.addEventListener("click", function () {
    let categoryName = document.querySelector(".categoryName");
    categoryName.innerText = genre[0];
    let filmGenre = document.querySelector(".filmGenre");
    filmGenre.classList.add(strippedGenre);
    hideOtherGenres(genre);
  });
}

//add picture
function addPicture(pictureUrl, templateClone) {
  var picture = templateClone.querySelector(".genrePic");
  pictureRef = storageRef.child("poster/" + pictureUrl);
  pictureRef
    .getDownloadURL()
    .then(function (url) {
      picture.src = url;
    })
    .catch(function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          console.log(error.code);
          break;
        case "storage/unauthorized":
          console.log(error.code);
          break;
        case "storage/canceled":
          console.log(error.code);
          break;
        case "storage/unknown":
          console.log(error.code);
          break;
      }
    });
}

//Hide other genres when clicking the one you want
function hideOtherGenres(genre) {
  var allBoxes = document.querySelectorAll(".genreBox");
  allBoxes.forEach((box) => {
    box.style.display = "none";
  });
  showFilmsOfGenre(genre);
}

//Click to view films of genre clicked
function showFilmsOfGenre(genre) {
  genre[1].forEach((film) => {
    addFilm(film);
    addFilm(film);
    addFilm(film);
    addFilm(film);
  });
  addRedirects();
}
