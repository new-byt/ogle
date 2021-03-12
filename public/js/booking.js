let bookingButton = document.querySelector(".bookingButton");
bookingButton.addEventListener("click", async function () {
  console.log(bookingSeatsArray);
  if (!firebase.auth().currentUser && timeSelect.value) {
    window.location.assign("/login");
  }
  for (i = 0; i < bookingSeatsArray.length; i++) {
    await db
      .collection(roomSelect.value)
      .where("number", "==", bookingSeatsArray[i] + 1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          db.collection(roomSelect.value)
            .doc(doc.id)
            .collection("txmes")
            .doc(timeSelect.value)
            .set({
              status: "booked",
              email: firebase.auth().currentUser.email,
            });
        });
      });
  }
});
