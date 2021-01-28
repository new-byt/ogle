firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

const loginBox = document.querySelector(".loginBox");
const submitButton = loginBox.querySelector(".submitButton");
const form = document.forms[0].elements;
const errorOutput = loginBox.querySelector(".errorOutput");

//submit button clicked
submitButton.addEventListener("click", function () {
  if (submitButton.classList[1] === "loginButton") {
    signIn(readFormValue("email"), readFormValue("password"));
  } else {
    if (readFormValue("password") === readFormValue("confirmPassword")) {
      createAccount(readFormValue("email"), readFormValue("password"));
      console.log("Account created.");
    } else {
      return errorOutputFunc(1);
    }
  }
});

//error message output function
function errorOutputFunc(error) {
  if (Number.isInteger(error)) {
    switch (error) {
      case 1:
        error = "Passwords don't match.";
        break;
      case 2:
        error = "Email is not valid";
        break;
      default:
        error = "Error try again.";
        break;
    }
  }
  errorOutput.innerHTML = error;
}
//get form element value
function readFormValue(value) {
  return form.namedItem(value).value;
}

//create account function
function createAccount(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return errorOutputFunc(error.message);
    });
}

//sign in function
function signIn(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      return user
        .getIdToken()
        .then((idToken) => {
          return post(idToken);
        })
        .catch((error) => {
          console.log(error.code, error.message);
          return errorOutputFunc(error.message);
        });
    })
    .catch((error) => {
      return errorOutputFunc(error.message);
    });
}

function post(idToken) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      idToken: idToken,
    })
  );
}
