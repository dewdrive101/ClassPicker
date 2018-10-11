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
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (message.greeting == "isClass") {
    //message from scrapeCourses.js
    console.log(firebase.database().ref('classes/' + message.number));
    if (firebase.database().ref('classes/' + message.number)) {
      sendResponse({ farewell: true });
    } else {
      sendResponse({ farewell: false });
    }
  } else {
    //message from scrapeCams.js
    writeClassData(message);
    sendResponse({ farewell: "Saved: " + message.courseNumber });
  }
});

function writeClassData(message) {
  number = message.courseNumber;
  var ref = firebase.database().ref('classes')
  console.log(ref.child(number));
  if (ref.child(number) == null) {
    ref.child(number).set({
      name: message.courseName,
      credits: message.courseCredits
    });
  }
  //saves each individual session
  ref.child(number).child(message.sessionNumber).set({
    days: message.days,
    start: message.startTime,
    end: messane.endTime,
    seats: message.seats,
    estart: message.extraStart,
    eend: message.eEnd,
    edays: message.eDays
  });
}


window.onload = function () {
  initApp();
};