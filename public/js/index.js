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
let test = async function () {
  await db
    .collection("movies")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        film = doc.data();
        createGenres(film);
      });
    });
  console.log(genreArray);
  createFilmElements(genreArray);
};
test();

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
    genreArray.push([film.genre, [[film], [film], [film], [film], [film]]]);
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
        var filmInfo = [
          ["filmName", film.title],
          ["filmDescription", film.description],
          ["filmRating", film.age],
        ];
        var filmTemplate = document.querySelector("#filmTemplate");
        var clone = filmTemplate.content.cloneNode(true);
        filmInfo.forEach((item) => {
          //console.log(item);
          var filmData = clone.querySelector("." + item[0]);
          filmData.textContent = item[1];
        });

        //Add trailer image
        console.log(film.trailer);
        addTrailerImage(clone, film.trailer);
        //Add to category
        document
          .querySelector("." + film.genre.toLowerCase())
          .querySelector(".films")
          .appendChild(clone);
        i++;
      }
    });
  });
}

//Add trailer function
function addTrailerImage(cloneOfTemplate, trailer) {
  var trailerElement = cloneOfTemplate.querySelector(".filmPicture");
  var trailerRef = storageRef.child("trailers/" + trailer);
  trailerRef
    .getDownloadURL()
    .then(function (url) {
      trailerElement.src = url;
    })
    .catch(function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          console.log("File not found.");
          break;

        case "storage/unauthorized":
          console.log("Unauthorized");
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
    });
}
