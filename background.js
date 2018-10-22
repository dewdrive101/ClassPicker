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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (message.greeting == "isClass") {
    //message from scrapeCourses.js, check if the class exists
    var ref = firebase.database().ref('classes');
    ref.child(message.number).once('value', function (snapshot) {
      console.log(message.number + " exists? " + snapshot.exists());
      //this commented out code doesn't work, sends undefined message for some reason
      //sendResponse({ farewell: snapshot.exists() });
      if (snapshot.exists()) {
        console.log("Sending Message: True");
        sendResponse({ farewell: ("Saved: " + message.number) });
      }
      else {
        console.log("Sending Message: False");
        sendResponse({ farewell: ("Saved: " + message.number) });
      }
    });
  } else {
    //message from scrapeCams.js
    writeClassData(message);
    sendResponse({ farewell: ("Saved: " + message.courseNumber) });
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


window.onload = function () {
  initApp();
};