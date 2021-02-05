const storageRef = storage.ref();
const main = document.querySelector(".main");
var genreArray = [];
//width of page
var baseNumber = 1;
if (vw <= 768) {
  if (vw <= 600) {
    baseNumber = 2;
  }
}

//Gets films
(async function () {
  await db
    .collection("movies")
    .get()
    .then(function (querySnapshot) {
      console.log(querySnapshot);
      querySnapshot.forEach(function (doc) {
        film = doc.data();
        if (doc.id !== "none") {
          console.log(film);
          createGenres(film);
        }
      });
    });
  console.log(genreArray);
  createFilmElements(genreArray);
})();

function createGenres(film) {
  newGenre = true;
  console.log(genreArray.length);
  if (genreArray.length != 0) {
    for (i = 0; i < genreArray.length; i++) {
      if (genreArray[i][0] == film.genre) {
        console.log(genreArray[i][0] + "Duplicate");
        genreArray[i][1].push([film]);
        newGenre = false;
        //console.log(film.genre);
      }
    }
  }
  //console.log(newGenre);
  if (newGenre) {
    createGenre(film.genre);
    genreArray.push([
      film.genre,
      [[film], [film], [film], [film], [film]], // Test
    ]);
  }
}

function createGenre(genre) {
  var template = document.querySelector("#genre");
  var clone = template.content.cloneNode(true);
  clone.querySelector(".category").classList.add(genre.toLowerCase());
  clone.querySelector(".categoryText").innerText = genre;
  main.appendChild(clone);
}

//Adds film into to the template
function createFilmElements(filmArray) {
  filmArray.forEach((films) => {
    var i = baseNumber;
    //console.log(films[0]);
    films[1].forEach((film) => {
      if (i < 4) {
        film = film[0];
        addFilm(film);
        i++;
      }
    });
  });
}
