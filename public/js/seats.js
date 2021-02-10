//.orderBy("number", "desc");
const seats = db.collection("movies").doc(film).collection("Rooms");
const roomSelect = document.querySelector("#room");
const timeSelect = document.querySelector("#time");
var rooms = [];
(async function () {
  await seats
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        if (doc.data().times.length > 0) {
          rooms.push({ room: doc.id, times: doc.data().times });
        }
      });
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  console.log(rooms);
  addDropdowns(rooms);
})();

function addDropdowns(rooms) {
  rooms.forEach((room) => {
    console.log(room.room, room.times);
    createOption(room.room, "#room");
    room.times.forEach((time) => {
      console.log(time);
      createOption(time, "#time", room.room);
    });
  });
}

function createOption(value, querySelectorPlace, room) {
  let dropdown = document.querySelector(querySelectorPlace);
  let dropdownItem = document.createElement("option");
  dropdownItem.value = value;
  dropdownItem.innerText = value;
  if (room) {
    dropdownItem.classList.add(room, "dropdownTime");
  }
  dropdown.appendChild(dropdownItem);
}

//event listener for room when changed show different times
roomSelect.addEventListener("change", function () {
  console.log(this.value);
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
