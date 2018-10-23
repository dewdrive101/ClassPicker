var button = document.createElement("button");
button.value = "Gather class information";
button.id = "gather-classes-button";
document.getElementById('gateway-toolbar-1').appendChild(button);
document.getElementById('gather-classes-button').addEventListener('click', forLoop, false);

function forLoop() {
    for (i = 40; i < 140; i++)
        checkClass(i);
}
function checkClass(i) {
    var classBox = document.getElementsByTagName('a')[i];
    classBox.click();
    //wait 20 seconds until all boxes are open before running this code
    setTimeout(function () {
        var arrayBox = document.getElementsByClassName("custompad_10")[i - 40].children;
        for (j = 0; j < arrayBox.length; j++) {
            if (arrayBox[j].className == "ajaxcourseindentfix") {
                infoBox = arrayBox[j];
                console.log("Checking for box: " + i);
                if (infoBox != undefined) {
                    console.log("Found box: " + i);
                    //gets the text of each box
                    var textArray = infoBox.innerText.split(/\r?\n/);
                    var number = textArray[0].slice(0, 8);

                    console.log("Starting port connection");
                    var port = chrome.runtime.connect({ name: "isClass" });
                    port.postMessage({ greeting: "isClass", number });
                    console.log("posting message");
                    port.onMessage.addListener(function (response) {
                        console.log(response);
                        if (response.answer) {
                            gatherClassInfo(i);
                        }
                    });
                }
            }
        }
    }, 20000); //takes 20 seconds for all the boxes to open
}

function gatherClassInfo(i) {
    console.log("Gathering class info for: " + i);
    var arrayBox = document.getElementsByClassName("custompad_10")[i - 40].children;
    for (j = 0; j < arrayBox.length; j++) {
        if (arrayBox[j].className == "ajaxcourseindentfix") {
            infoBox = arrayBox[j];

            //gets the text of each box
            var textArray = infoBox.innerText.split(/\r?\n/);
            var numberName = textArray[0].split("-");
            var number = numberName[0].trim();
            var Name = numberName[1].trim();
            var Credits = textArray[1].slice(9, 10);
            var Prerequisites;
            var CorequisiteOrPrerequisite;
            var Corequisite;

            for (k = 3; k < textArray.length - 1; k++) {
                var line = textArray[3].split(": ");
                if (line[0] == "Prerequisites") {
                    Prerequisites = line[1];
                }
                else if (line[0] == "Co-requisite or Prerequisite") {
                    CorequisiteOrPrerequisite = line[1];
                }
                else if (line[0] == "Co-requisite") {
                    Corequisite = line[1];
                }
            }
            console.log(credits);
            chrome.runtime.sendMessage({ greeting: "appendClass", number, Name, Credits, Prerequisites, CorequisiteOrPrerequisite, Corequisite }, function (response) {
            });
        }
    }
}