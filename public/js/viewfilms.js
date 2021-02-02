const storageRef = storage.ref();
const main = document.querySelector(".main");
const template = document.querySelector(".genreTemplate");
const elementArray = [
  [".genreName", "innerText"],
  [".genrePic", "src"],
];
//Gets films
let test = async function () {
  var genreArray = [];
  await db
    .collection("movies")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        film = doc.data();
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
      });
    });
  console.log(genreArray);
  createCategoryBox(genreArray);
};
test();

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
  //Name
  var name = templateClone.querySelector(".genreName");
  name.innerText = genre[0];
  //Picture
  addPicture(genre[1][0].trailer, templateClone);
  eventListenerFunc(templateClone.querySelector(".genreBox"), genre);
  main.appendChild(templateClone);
}

//addEventListener function
function eventListenerFunc(box, genre) {
  box.classList.add(genre[0].toLowerCase());
  box.addEventListener("click", function () {
    hideOtherGenres(genre[0]);
  });
}

//add picture
function addPicture(pictureUrl, templateClone) {
  var picture = templateClone.querySelector(".genrePic");
  pictureRef = storageRef.child("trailers/" + pictureUrl);
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
    if (!box.classList.contains(genre.toLowerCase())) {
      box.style.display = "none";
    }
  });
}
