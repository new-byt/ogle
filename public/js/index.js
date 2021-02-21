const main = document.querySelector(".main");
var genreArray = [];

//Device resolution width
var baseNumber = 0;
if (vw <= 768) {
  baseNumber = 1;
  if (vw <= 600) {
    baseNumber = 2;
  }
}

//Gets films
// REAL DATA
(async function () {
  await db
    .collection("movies")
    .get()
    .then(function (querySnapshot) {
      console.log(querySnapshot);
      querySnapshot.forEach(function (doc) {
        film = doc.data();
        if (doc.id !== "none") {
          createGenres(film);
          createGenres(film);
          createGenres(film);
          createGenres(film);
          createGenres(film);
        }
      });
    });
  createFilmElements(genreArray);
})();

function createGenres(film) {
  newGenre = true;
  if (genreArray.length != 0) {
    for (i = 0; i < genreArray.length; i++) {
      if (genreArray[i].genre === film.genre) {
        console.log(genreArray[i][0] + "Duplicate");
        genreArray[i].films.push([film]);
        newGenre = false;
      }
    }
  }
  if (newGenre) {
    createGenre(film.genre);
    genreArray.push({
      genre: film.genre,
      films: [[film]],
    });
  }
}
function createGenre(genre) {
  var template = document.querySelector("#genre");
  var clone = template.content.cloneNode(true);
  let filteredGenre = genre.toLowerCase().replace("'", "").split(" ").join("");
  clone.querySelector(".arrow").addEventListener("click", function () {
    window.location.replace("viewfilms?genre=" + filteredGenre);
  });
  clone.querySelector(".category").classList.add(filteredGenre);
  clone.querySelector(".categoryText").innerText = genre;
  main.appendChild(clone);
}

//Adds film into to the template
function createFilmElements(filmArray) {
  filmArray.forEach((films) => {
    var i = baseNumber;
    films.films.forEach((film) => {
      if (i < 4) {
        film = film[0];
        addFilm(film);
        i++;
      }
    });
  });
  addRedirects();
}
