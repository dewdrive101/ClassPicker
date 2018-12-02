//when the browser icon is clicked, open mainpage.html
chrome.browserAction.onClicked.addListener(function () {
  console.log("Opening mainpage.html");
  chrome.tabs.create({ url: chrome.runtime.getURL("html/mainpage.html") });
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCXUZDgzBdjdVPmuLV74aNbIu4KkfAJOZM",
  databaseURL: "https://class-picker-f30b8.firebaseio.com",
  storageBucket: "class-picker.appspot.com",
};

var userid;
firebase.initializeApp(config);
function initApp() {
  firebase.auth().onAuthStateChanged(function (user) {
    userid = user.uid;
    console.log("Logged in: " + userid);
  });
}

/*
a port for listening from mainpage.js,
input: user uid
output: user classes to be taken
*/
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "classList");
  port.onMessage.addListener(function (message) {
    console.log("Loading from firebase classes for: " + userid);
    var ref = firebase.database().ref('users');
    ref.child(userid + '/classes').once('value', function (snapshot) {
      console.log("Classes to be taken for: " + userid + ": " + snapshot.val());
      port.postMessage({ classList: snapshot.val() });
    });
  });
});

window.onload = function () {
  console.log("Initializing page");
  initApp();
};