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
chrome.runtime.onMessage.addListener(function (message, sendResponse) {
  if (message.greeting == "appendClass") {
    //message from scrapeCourses.js
    appendClassData(message);
    console.log("Sending response");
    sendResponse({ farewell: ("Append: " + message.number) });
  } else {
    //message from scrapeCams.js
    writeClassData(message);
    sendResponse({ farewell: ("Saved: " + message.courseNumber) });
  }
});

//message from scrapeCourses.js, check if the class exists
//open a continuos connection because answer is important and
//required for code to continue
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "isClass");
  port.onMessage.addListener(function (message) {
    console.log(message);
    var ref = firebase.database().ref('classes');
    ref.child(message.number).once('value', function (snapshot) {
      console.log(message.number + " exists? " + snapshot.exists());
      port.postMessage({ answer: (snapshot.exists()) });
    });
  });
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
    name: message.Name,
    credits: message.Credits,
    prerequisites: message.Prerequisites,
    corequisiteOrPrerequisite: message.CorequisiteOrPrerequisite,
    corequisite: message.Corequisite
  });
}

window.onload = function () {
  initApp();
};

/* TODO:
scrapeCams.js add different class for labs, labs currently overwrite normal classes
scrapeCourses.js, bunch of differently formatted requisites need
                  to be systematically made the same
*/