// Below is the updated content script for the schedule wizard text only page

var button = document.createElement("button");
button.value = "Add Multiple Courses";
button.id = "gather-classes";
document.getElementsByClassName("page-header")[0].appendChild(button);
document.getElementById('gather-classes').addEventListener('click', addClasses, false);

function addClasses() {
    var port = chrome.runtime.connect({ name: "classList" });
    port.postMessage({ greeting: "classList" });
    port.onMessage.addListener(function (response) {
        var classList = response.classList;
        console.log(classList);
        var length = classList.length;
        addClass(classList, 0, length);
    });
}

function addClass(classList, i, length) {
    var course = classList[i];
    subject = course.split("|")[0];
    course = "\"" + course + "\"";

    setTimeout(function () {
        console.log("Selecting Subject: " + subject);
        selectSubject(subject);
        document.getElementsByClassName("btn-selectSubject")[0].click();
    }, 500);

    setTimeout(function () {
        console.log("Selecting Course: " + course);
        selectCourse(course);
        document.getElementsByClassName("btn-selectCourse")[0].click();
    }, 1000);

    setTimeout(function () {
        console.log("Adding class button: " + course);
        document.getElementsByClassName("btn-add")[0].click();
    }, 1500);

    setTimeout(function () {
        if (document.getElementsByClassName("btn-primary")[5]) {
            document.getElementsByClassName("btn-primary")[5].click();
        }
    }, 2000);
    setTimeout(function () {
        if (i + 1 < length) {
            addClass(classList, i + 1, length);
        }
    }, 2500);
};

function selectSubject(subject) {
    var classString = 'option[value=' + subject + ']';
    var subjectSelector = document.getElementById("subject-selector");
    subjectSelector.selectedIndex = subjectSelector.querySelectorAll(classString)[0].index;
};

function selectCourse(course) {
    var classString = 'option[value=' + course + ']';
    var subjectSelector = document.getElementById("course-selector");
    subjectSelector.selectedIndex = subjectSelector.querySelectorAll(classString)[0].index;
};