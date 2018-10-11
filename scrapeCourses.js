var button = document.createElement("button");
button.value = "Gather class information";
button.id = "gather-classes-button";
document.getElementById('gateway-toolbar-1').appendChild(button);
document.getElementById('gather-classes-button').addEventListener('click', gatherInfo, false);

function gatherInfo() {
    //opens the first class
    document.getElementsByTagName('a')[41].click();
    var infoBox = document.getElementsByClassName('ajaxcourseindentfix')[0]
    console.log("Starting timer");
    setInterval(timer, 500);
    function timer() {
        console.log("Checking for box");
        if (infoBox != undefined) {
            //gets the text of each box
            var textArray = infoBox.innerText.split(/\r?\n/);
            console.log(textArray[0].slice(0, 8));
            var number = textArray[0].slice(0, 8);
            //check if the number is already in the database. if yes the class exists on cams
            chrome.runtime.sendMessage({ greeting: "isClass", number }, function (response) {
                console.log(response.farewell);
            });

        }
    }
}