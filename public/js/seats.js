var bookingSeatsArray = [];

//Get seats then get time of seats

//Get seats
async function getSeats(room, time) {
  console.log(room, time);
  let counter = 0;
  await db
    .collection(room)
    .orderBy("number")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        createSeats(querySnapshot.docs.length);
        db.collection(room)
          .doc(doc.id)
          .collection("txmes")
          .doc(time)
          .get()
          .then((doc) => {
            console.log("Document data:" + counter, doc.data());
            email = doc.data().email;
            updateSeat(counter, doc.data().status, email);
            counter++;
          });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
//updates seat
function updateSeat(seat, status, email) {
  let currentSeat = document.getElementsByClassName("seat")[seat];
  currentSeat.classList.add(status);
  let user = firebase.auth().currentUser;
  if (user && email == user.email) {
    currentSeat.src = "assets/pink person.png";
  } else {
    if (status == "booked") {
      currentSeat.src = "assets/blue person.png";
    } else {
      currentSeat.src = "assets/navy person.png";
    }
  }
}
//Creates seats
function createSeats(numberOfSeats) {
  seats.innerHTML = "";
  for (i = 0; i < numberOfSeats; i++) {
    let currentElement = document.createElement("img");
    currentElement.classList.add("seat");
    seats.appendChild(currentElement);
  }
  seatsClicked();
}
//Click seat
function seatsClicked() {
  for (i = 0; i < seats.children.length; i++) {
    child = seats.children[i];
    child.addEventListener("click", function () {
      if (this.classList.contains("unbooked")) {
        seatNumber = Array.from(this.parentNode.children).indexOf(this);
        console.log(seatNumber);
        if (!this.classList.contains("selected")) {
          person = "assets/pink person.png";
          this.classList.add("selected");
          bookingSeatsArray.push(seatNumber);
        } else {
          person = "assets/navy person.png";
          this.classList.remove("selected");
          let index = bookingSeatsArray.indexOf(seatNumber);
          bookingSeatsArray.splice(index, 1);
        }
        this.src = person;
      }
    });
  }
}
