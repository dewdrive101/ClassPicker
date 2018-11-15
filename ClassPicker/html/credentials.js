// Initialize Firebase
var config = {
    apiKey: "AIzaSyCXUZDgzBdjdVPmuLV74aNbIu4KkfAJOZM",
    databaseURL: "https://class-picker-f30b8.firebaseio.com",
    storageBucket: "class-picker.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();
function initApp() {
    //document.getElementById("majorSelection").style.visibility = "hidden";
    console.log("Initializing mainpage");
    firebase.auth().onAuthStateChanged(function (user) {
        document.getElementById("None").style.visibility = "hidden";
        document.getElementById("Computer Science").style.visibility = "hidden";
        document.getElementById("Engineer").style.visibility = "hidden";
        if (user) {
            loggedIn(user);
        } else {
            document.getElementById('sign-in-button').textContent = 'Sign-in with Google';
            //document.getElementsByClassName("logIn").style.visibility = "hidden";
        }
        document.getElementById('sign-in-button').disabled = false;
    });
    document.getElementById('sign-in-button').addEventListener('click', startSignIn, false);
}

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

function startSignIn() {
    console.log("Starting sign in");
    document.getElementById('sign-in-button').disabled = true;
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        startAuth(true);
    }
}

function loggedIn(user) {
    document.getElementById('sign-in-button').textContent = 'Sign out';
    loadUserData(user.uid);
    document.getElementById('majorList').addEventListener("change", function () {
        updateMajor();
    });
    document.getElementById('submit').addEventListener("click", function () {
        updateCourses();
    });
}

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

function updateMajor() {
    var major = document.getElementById('majorList').value;
    document.getElementById("None").style.visibility = "hidden";
    document.getElementById("Computer Science").style.visibility = "hidden";
    document.getElementById("Engineer").style.visibility = "hidden";
    showCourses(major);
    console.log("Saving information");
    var user = firebase.auth().currentUser;
    database.ref('users/' + user.uid).set({
        major: major
    });
}

function updateCourses() {
    console.log("saving user data");
    var i = 1, j = 0;
    var classArray = [];
    var major = document.getElementById('majorList').value;
    var groups = document.getElementById(major).children;
    var length = groups.length - 1;
    while (i < length) {
        var numOfClasses = groups[i].children.length;
        while (j < numOfClasses) {
            var classes = document.getElementById(major).children[i].children[j];
            if (classes.checked)
                classArray.push(classes.value);
            j += 2;
        }
        i += 2;
    }
    var user = firebase.auth().currentUser;
    database.ref('users/' + user.uid).set({
        classes: classArray,
        major: major
    });
}

/*
function updateCourses(){
    var count = 0;
    var inputElements = document.getElementsByTagName("input");
    console.log("saving user data");
    var user = firebase.auth().currentUser;
    
    for(var i = 0; i<inputElements; i++){
        if(inputElements[i].type === "checkbox"){
            count++;
        }
    }

    for(var i = 0; i < count; i++){
        console.log(document.querySelectorAll("input[type='checkbox']")[i].value);
        database.ref('users/' + user.uid + "Classes").set({
            Classes: document.querySelectorAll("input[type='checkbox']")[i].value
        });
    }
}*/

function showCourses(major) {
    console.log("Changing visibility of " + major);
    document.getElementById(major).style.visibility = "visible";
}
function checkClasses(classList, major) {
    var i = 1, j = 0, k = 0;
    var lengthClass = classList.length;
    var groups = document.getElementById(major).children;
    var length = groups.length - 1;
    while (i < length) {
        var numOfClasses = groups[i].children.length;
        while (j < numOfClasses) {
            var classes = document.getElementById(major).children[i].children[j];
            console.log(classList[k]);
            if (classes.value == classList[k]) {
                classes.checked = "true";
                k++;
            }
            j += 2;
        }
        i += 2;
    }
}


window.onload = function () {
    initApp();
};