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

var i;

//simple listener, response is not important and not "needed"
chrome.runtime.onMessage.addListener(function (message) {
  console.log(message);
  if (message.greeting == "appendClass") {
    //message from scrapeCourses.js
    appendClassData(message);
    console.log("Sending response");
  }
  else {
    //message from scrapeCams.js
    writeClassData(message);
  }
});

//message from scrapeCourses.js, check if the class exists
//open a continuos connection because answer is important and
//required for code to continue
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "isClass");
  port.onMessage.addListener(function (message) {
    console.log(message);
    i = message.i;
    var ref = firebase.database().ref('classes');
    ref.child(message.courseNumber).once('value', function (snapshot) {
      console.log(message.courseNumber + " common exists? " + snapshot.child("common").exists());
      console.log(message.courseNumber + " session exists? " + snapshot.child(message.sessionNumber).exists());
      var common = snapshot.child("common").exists();
      var session = snapshot.child(message.sessionNumber).exists();
      port.postMessage({ common: common, session: session });
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
    name: message.name,
    credits: message.credits,
    prerequisites: message.prereq,
    corequisite: message.coreq
  });
  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "continue", i }, function (response) {
    });
  });
}

window.onload = function () {
  initApp();
};

/* TODO:
//make it only run on button click, currently can't do anything without setting it off
scrapeCams.js

coursePopup.js

*/