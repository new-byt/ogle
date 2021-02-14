//.orderBy("number", "desc");
const filmRooms = db.collection("movies").doc(film).collection("Rooms");
const roomSelect = document.querySelector("#room");
const timeSelect = document.querySelector("#time");
const seats = document.querySelector(".seats");
var rooms = [];
(async function () {
  await filmRooms
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        if (doc.data().times.length > 0) {
          rooms.push({
            room: doc.id,
            times: doc.data().times,
            timeInWords: doc.data().timesx,
          });
        }
      });
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  console.log(rooms);
  console.log("-------------");
  addDropdowns(rooms);
})();

function addDropdowns(rooms) {
  rooms.forEach((room) => {
    console.log(room.room, room.times);
    createOption(room.room, "#room");
    var counter = 0;
    room.times.forEach((time) => {
      console.log(time);
      createOption(time, "#time", room.room, room.timeInWords[counter]);
      counter++;
    });
  });
}

function createOption(value, querySelectorPlace, room, timeInWords) {
  let dropdown = document.querySelector(querySelectorPlace);
  let dropdownItem = document.createElement("option");
  dropdownItem.value = value;
  dropdownItem.innerText = value;
  if (room) {
    dropdownItem.classList.add(room, "dropdownTime");
    dropdownItem.value = timeInWords;
  }
  dropdown.appendChild(dropdownItem);
}

//event listener for room when changed show different times
roomSelect.addEventListener("change", function () {
  console.log(this.value);
  seats.innerHTML = "";
  let dropdowns = document.querySelectorAll(".dropdownTime");
  timeSelect.selectedIndex = 0;
  dropdowns.forEach((dropdown) => {
    if (dropdown.classList.contains(this.value)) {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  });
});

//times event listener
timeSelect.addEventListener("change", function () {
  getSeats(roomSelect.value, this.value);
});

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
        createSeats(querySnapshot.docs.length);
        db.collection(room)
          .doc(doc.id)
          .collection("txmes")
          .doc(time)
          .get()
          .then((doc) => {
            console.log("Document data:" + counter, doc.data());
            updateSeat(counter, doc.data().status);
            counter++;
          });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
//updates seat
function updateSeat(seat, status) {
  let currentSeat = document.getElementsByClassName("seat")[seat];
  if (status == "booked") {
    currentSeat.src = "assets/blue person.png";
  } else {
    currentSeat.src = "assets/navy person.png";
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
}
