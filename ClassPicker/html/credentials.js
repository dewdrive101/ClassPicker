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
    //document.getElementsByClassName("quickstart-user-details-container")[0].style.visibility = "visible";
    document.getElementById('sign-in-button').textContent = 'Sign out';
    loadUserData(user.uid);
    document.getElementById('majorList').addEventListener("change", function(){
        updateMajor();
    });
    //added
    //document.getElementById('Submit').addEventListener("click", function(){
    //    updateCourses();
    //});
}

function loadUserData(userId) {
    console.log("User: " + userId + " is signed in");
    var ref = firebase.database().ref('users/' + userId);
    ref.on('value', function (snapshot) {
        if (snapshot.val() != null) {
            document.getElementById('majorList').value = (snapshot.val().major);
            showCourses(snapshot.val().major);
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

function showCourses(major){
    console.log("Changing visibility");
    document.getElementById(major).style.visibility = "visible";
}


window.onload = function () {
    initApp();
};