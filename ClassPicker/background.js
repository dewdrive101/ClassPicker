chrome.browserAction.onClicked.addListener(function () {
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
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid);
    }
  });
  console.assert(port.name == "classList");
  port.onMessage.addListener(function (message) {
    var ref = firebase.database().ref('users');
    ref.child(userid + '/classes').once('value', function (snapshot) {
      port.postMessage({ classList: snapshot.val() });
    });
  });
});

window.onload = function () {
  initApp();
};