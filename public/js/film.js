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
  let titleBar = document.querySelector(".filmName");
  titleBar.innerText = film.title;
}
