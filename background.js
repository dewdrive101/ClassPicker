chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("credentials.html") });
});
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCXUZDgzBdjdVPmuLV74aNbIu4KkfAJOZM",
  databaseURL: "https://class-picker-f30b8.firebaseio.com",
  storageBucket: "class-picker.appspot.com",
};
firebase.initializeApp(config);
function initApp() {
  firebase.auth().onAuthStateChanged(function (user) {
    console.log('Logged in/out:', user);
  });
}

//simple listener, response is not important and not "needed"
chrome.runtime.onMessage.addListener(function (message) {
  console.log(message);
  if (message.greeting == "appendClass") {
    //message from scrapeCourses.js
    appendClassData(message);
    console.log("Sending response");
  } else {
    //message from scrapeCams.js
    writeClassData(message);
  }
});

function writeClassData(message) {
  var ref = firebase.database().ref('classes')
  ref.child(message.courseNumber).child(message.sessionNumber).set({
    days: message.days,
    start: message.startTime,
    end: message.endTime,
    seats: message.seats,
    estart: message.extraStart,
    eend: message.extraEnd,
    edays: message.extraDays
  });
}

function appendClassData(message) {
  var ref = firebase.database().ref('classes')
  ref.child(message.number).child("common").set({
    name: message.name,
    credits: message.credits,
    prerequisites: message.prereq,
    corequisite: message.coreq
  });
}

window.onload = function () {
  initApp();
};

/* TODO:
scrapeCams.js

coursePopup.js
  only read the window and close it when scraping, otherwise leave it alone
*/