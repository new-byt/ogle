function addFilm(film) {
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
  addTrailerImage(clone, film.photo);
  //Add to category
  console.log(film.genre.toLowerCase());
  console.log(document.querySelector("." + film.genre.toLowerCase()));
  document
    .querySelector("." + film.genre.toLowerCase())
    .querySelector(".films")
    .appendChild(clone);
}

//Add trailer function
function addTrailerImage(cloneOfTemplate, photo) {
  var trailerElement = cloneOfTemplate.querySelector(".filmPicture");
  var trailerRef = storageRef.child("poster/" + photo);
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
