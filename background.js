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
  credits = message.courseCredits;
  days = message.days;
  start = message.startTime;
  end = message.endTime;
  seats = message.seats;
  console.log(number, name, credits, days, start, end, seats);
  firebase.database().ref('classes/' + number).set({
    name: name,
    credits: credits,
    days: days,
    start: start,
    end: end,
    seats: seats
  });
}

window.onload = function () {
  initApp();
};