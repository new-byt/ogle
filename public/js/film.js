const url = new URLSearchParams(window.location.search);
const film = decodeURI(url.get("film"));
const filmRef = db.collection("movies").doc(film);
filmRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      changeHeader(doc.data());
    } else {
      console.log("Not a film");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });

function changeHeader(film) {
  let filmInfoArray = [
    [".filmName", film.title],
    [".filmLength", film.length],
    [".filmRating", film.age],
    [".filmDesc", film.description],
  ];
  filmInfoArray.forEach((element) => {
    let currentElement = document.querySelector(element[0]);
    currentElement.innerText = element[1];
  });
  addTrailer(film.trailer);
}

function addTrailer(trailer) {
  var trailerElement = document.querySelector(".filmTrailer");
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
