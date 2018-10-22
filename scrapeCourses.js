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
    //wait 500 milliseconds before running this code
    setTimeout(function () {
        var infoBox = document.getElementsByClassName('ajaxcourseindentfix')[i - 40];
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
    }, 20000); //takes 20 seconds for all the boxes to open
}

function gatherClassInfo(i) {
    console.log("Gathering class info for: " + i);
    
}