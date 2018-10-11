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

chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    writeClassData(message);
    sendResponse({ farewell: "Saved" });
  });

function writeClassData(message) {
  number = message.courseNumber;
  name = message.courseName;
  session = message.sessionNumber;
  credits = message.courseCredits;
  days = message.days;
  start = message.startTime;
  end = message.endTime;
  seats = message.seats;
  estart = message.extraStart;
  eend = message.extraEnd;
  edays = message.extraDays;
  console.log(number, name, session, credits, days, start, end, seats, estart, eend, edays);

  //can change this to check if the class already exists, then don't have to save over the same information
  firebase.database().ref('classes/' + number).set({
    name: name,
    credits: credits
  });
  //saves each individual session
  firebase.database().ref('classes/' + number + '/' + session).set({
    days: days,
    start: start,
    end: end,
    seats: seats,
    estart: estart,
    eend: eend,
    edays: edays
  });
}


window.onload = function () {
  initApp();
};