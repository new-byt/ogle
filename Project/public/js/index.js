var storageRef = storage.ref();

//width of page
var i = 0;
if (vw <= 768) {
  if (vw >= 600) {
    i = 1;
  } else {
    i = 2;
  }
} else {
  i = 0;
}

//Gets films
let test = async function () {
  await db
    .collection("movies")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        i++;
        if (i <= 4) {
          createFilmElements(doc.data());
        }
      });
    });
};
test();

//Adds film into to the template
function createFilmElements(data) {
  var filmInfo = [
    ["filmName", data.title],
    ["filmDescription", data.description],
    ["filmRating", data.age],
  ];
  var filmTemplate = document.querySelector("#filmTemplate");
  var clone = filmTemplate.content.cloneNode(true);
  filmInfo.forEach((item) => {
    console.log(item);
    var filmData = clone.querySelector("." + item[0]);
    filmData.textContent = item[1];
  });
  //Add trailor image
  console.log(data.trailer);
  addTrailorImage(clone, data.trailer);
  //Add to category
  var category = document.querySelector(".category");
  category.querySelector(".films").appendChild(clone);
}

//Add trailer function
function addTrailorImage(cloneOfTemplate, trailer) {
  var trailerElement = cloneOfTemplate.querySelector(".filmPicture");
  var trailerRef = storageRef.child("trailers/" + trailer);
  trailerRef
    .getDownloadURL()
    .then(function (url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function (event) {
        var blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();
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
