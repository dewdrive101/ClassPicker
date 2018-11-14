// Initialize Firebase
var config = {
    apiKey: "AIzaSyCXUZDgzBdjdVPmuLV74aNbIu4KkfAJOZM",
    databaseURL: "https://class-picker-f30b8.firebaseio.com",
    storageBucket: "class-picker.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();
function initApp() {
    document.getElementById("content")[0].style.visibility = "hidden";
    console.log("Initializing credentials page");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedIn(user);
        } else {
            document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
            document.getElementsByClassName("quickstart-user-details-container")[0].style.visibility = "hidden";
        }
        document.getElementById('quickstart-button').disabled = false;
    });
    document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
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
    document.getElementById('quickstart-button').disabled = true;
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        startAuth(true);
    }
}

function loggedIn(user) {
    document.getElementsByClassName("quickstart-user-details-container")[0].style.visibility = "visible";
    var classes = ['Introduction to Stem', 'Introduction to Networking'];
    document.getElementById('quickstart-button').textContent = 'Sign out';
    loadUserData(user.uid);
    document.getElementById('majorList').addEventListener("change", function(){
        updateMajor();
    });
    //added
    document.getElementById('Submit').addEventListener("click", function(){
        updateCourses();
    });
}

function loadUserData(userId) {
    var ref = firebase.database().ref('users/' + userId);
    ref.on('value', function (snapshot) {
        if (snapshot.val() != null) {
            document.getElementById('majorList').value = (snapshot.val().major);
        } else {
            console.log("Snapshot null");
        }
    });
}

function updateMajor() {
    //make the majors class visible so the user can pick the classes they've completed
    console.log("Saving information");
    var user = firebase.auth().currentUser;
    database.ref('users/' + user.uid).set({
        major: document.getElementById('majorList').value
    });
    console.log("Changing visibility");
    document.getElementById("computer_science_catalog").style.visibility = "visible";
}


function updateCourses(){
    var count = 0;
    var inputElements = document.getElementsByTagName("input");
    consol.log("saving user data")
    var user = firebase.auth().currentUser;
    
    for(var i = 0; i<inputElements; i++){
        if(inputElements[i].type === "checkbox"){
            count++;
        }
    }

    for(var i = 0; i < count; i++){
        database.ref('users/' + user.uid + "Classes").set({
            Classes: document.querySelectorAll("input[type='checkbox']")[i].value
        });
    }
}


window.onload = function () {
    initApp();
};