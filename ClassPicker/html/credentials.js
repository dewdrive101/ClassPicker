//This javascript is the javascript for mainpage.html
//it controls logging in, saving class information, and helpful links


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCXUZDgzBdjdVPmuLV74aNbIu4KkfAJOZM",
    databaseURL: "https://class-picker-f30b8.firebaseio.com",
    storageBucket: "class-picker.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();
//initiliazes the page, figures out if the user is new, logs in for previous users, adds listeners to buttons
function initApp() {
    console.log("Initializing mainpage");
    firebase.auth().onAuthStateChanged(function (user) {
        hideEverything();
        if (user) {
            loggedIn(user);
        } else {
            document.getElementById('sign-in-button').textContent = 'Sign-in with Google';
        }
        document.getElementById('sign-in-button').disabled = false;
    });
    document.getElementById('sign-in-button').addEventListener('click', startSignIn, false);
}
/*
gets authentication tokens and signs in user
input: boolean
output: signed in
*/
function startAuth(interactive) {
    chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
        if (token) {
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({ token: token }, function () {
                        startAuth(interactive);
                    });
                }
            });
        }
    });
}

//signs in or out based on current status
function startSignIn() {
    console.log("Starting sign in");
    document.getElementById('sign-in-button').disabled = true;
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        startAuth(true);
    }
}

/*
adds listeners to the rest of the buttons on the page, loads user info
input: user
output: null
*/
function loggedIn(user) {
    document.getElementById('sign-in-button').textContent = 'Sign out';
    loadUserData(user.uid);
    document.getElementById('majorList').addEventListener("change", function () {
        updateMajor();
    });
    document.getElementById('submit').addEventListener("click", function () {
        updateCourses();
    });
    document.getElementById("TheWiz").addEventListener("click", function () {
        loadThewiz();
    });
}

/*
loads information from firebase; major and previously selected classes
input: user id
output: null
*/
function loadUserData(userId) {
    console.log("User: " + userId + " is signed in");
    var ref = firebase.database().ref('users/' + userId);
    ref.on('value', function (snapshot) {
        if (snapshot.val() != null) {
            document.getElementById('majorList').value = (snapshot.val().major);
            showCourses(snapshot.val().major);
            if (snapshot.val().classes != null)
                checkClasses(snapshot.val().classes, snapshot.val().major);
        } else {
            console.log("Snapshot null");
        }
    });
}

//updates when the major selection is changed, calls showCourses next, saves major to firebase
function updateMajor() {
    var major = document.getElementById('majorList').value;
    hideEverything();
    showCourses(major);
    console.log("Saving information");
    var user = firebase.auth().currentUser;
    database.ref('users/' + user.uid).set({
        major: major
    });
}

/*
called when submit button is clicked
gathers all of the unchecked classes and saves them to firebase in that order
*/
function updateCourses() {
    console.log("saving user data");
    var i = 2, j = 0;
    var classArray = [];
    var major = document.getElementById('majorList').value;
    var groups = document.getElementById(major).children;
    var length = groups.length - 1;
    while (i < length) {
        var numOfClasses = groups[i].children.length;
        j = 0;
        while (j < numOfClasses) {
            var classes = document.getElementById(major).children[i].children[j];
            if (!classes.checked)
                classArray.push(classes.value);
            j += 2;
        }
        i += 2;
    }
    var user = firebase.auth().currentUser;
    console.log(user.uid + "firebase ID");
    database.ref('users/' + user.uid).set({
        classes: classArray,
        major: major
    });
    document.getElementById("submit_confirm").style.visibility = "visible";
    document.getElementById("TheWiz").style.visibility = "visible";
}

/*
shows courses for selected major
input: major
output: visible div
*/
function showCourses(major) {
    console.log("Changing visibility of " + major);
    document.getElementById(major).style.visibility = "visible";
}

/*
on login, checks firebase for saved information and checks every class not on firebase
input: list of classes from firebase, major saved in firebase
output: correctly checked boxes
*/
function checkClasses(classList, major) {
    var i = 2, j = 0, k = 0;
    var groups = document.getElementById(major).children;
    var length = groups.length - 1;
    while (i < length) {
        var numOfClasses = groups[i].children.length;
        j = 0;
        while (j < numOfClasses) {
            var classes = document.getElementById(major).children[i].children[j];
            if (classes.value == classList[k]) {
                k++;
            } else {
                classes.checked = "true";
            }
            j += 2;
        }
        i += 2;
    }
}

//hides the various divs
function hideEverything(){
    document.getElementById("None").style.visibility = "hidden";
    document.getElementById("Computer Science").style.visibility = "hidden";
    document.getElementById("Engineer").style.visibility = "hidden";
}

function loadThewiz() {
    window.open('https://floridapoly.collegescheduler.com/accessible/courses/add', '_blank');
}

window.onload = function () {
    initApp();
};