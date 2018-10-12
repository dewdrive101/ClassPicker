var button = document.createElement("button");
button.value = "Gather class information";
button.id = "gather-classes-button";
document.getElementById('gateway-toolbar-1').appendChild(button);
document.getElementById('gather-classes-button').addEventListener('click', checkClass, false);

function checkClass() {
    //opens the first class, classes are 40 and 139
   // for (i = 40; i < 140; i++) {
        document.getElementsByTagName('a')[40].click();
     //   var classBox = document.getElementsByTagName('a')[i];
       // classBox.click();
        //wait 500 milliseconds before running this code
        setTimeout(function () {
            var infoBox = document.getElementsByClassName('ajaxcourseindentfix')[0];
//            console.log("Checking for box: " + i);
            console.log("Checking for box: ");
            if (infoBox != undefined) {
                console.log("Found box: ");
 //               console.log("Found box: " + i);
                //gets the text of each box
                var textArray = infoBox.innerText.split(/\r?\n/);
                var number = textArray[0].slice(0, 8);
                //check if the number is already in the database. if yes the class exists on cams
                chrome.runtime.sendMessage({ greeting: "isClass", number }, function (response) {
                    console.log(response);
                    console.log(number + ": " + response.farewell);
//                    console.log(i + ": " + number + ": " + response.farewell);
                    if (response.farewell) {
                        //Class exists on cams
                        gatherClassInfo();
                    }
                });
            }
        }, 500);
  //  }
}

function gatherClassInfo() {

}