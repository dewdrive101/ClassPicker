var button = document.createElement("button");
button.value = "Gather class information";
button.id = "gather-classes-button";
document.getElementsByClassName("Portal_Grid_Pager")[0].appendChild(button);
document.getElementById('gather-classes-button').addEventListener('click', loopPages, false);

function loopPages() {
        scrapePage();
        /*
        console.log("Looping through pages");
        if (document.getElementById("Next10") != "null") {
                for (i = 0; i <= 37; i++) {
                        portal = document.getElementsByClassName("Portal_Grid_Pager")[0].childNodes[i];
                        if (portal.tagName == "A") {
                                scrapePage();
                                portal.click();
                        }
                }
        } else {
                for (i = 0; i <= 31; i++) {
                        portal = document.getElementsByClassName("Portal_Grid_Pager")[0].childNodes[i];
                        if (portal.tagName == "A") {
                                scrapePage();
                                portal.click();
                        }
                }
        }
        scrapePage();
        */
}

function scrapePage() {
        coursesLength = document.getElementsByClassName("courseInfo").length;
        for (i = 0; i < coursesLength; i++) {
                //split course info into class number and session
                var courseInfo = document.getElementsByClassName("courseInfo")[i].cells[0].innerText.split("\n")[0];
                var sessionNumber = courseInfo.slice(-2);
                var courseLetters = courseInfo.slice(0, 3);
                var courseNumbers = courseInfo.slice(3, 7);
                var courseNumber = courseLetters + " " + courseNumbers;
                //
                var courseName = document.getElementsByClassName("courseInfo")[i].cells[1].innerText;
                var courseCredits = document.getElementsByClassName("courseInfo")[i].cells[2].innerText;
                var days = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[3].innerText;
                var startTime = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[5].innerText;
                var endTime = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[6].innerText;
                //calc seats left
                var maxEnrolled = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[7].innerText;
                var currentEnrolled = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[8].innerText;
                var seats = maxEnrolled - currentEnrolled;
                //
                var extraRow = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[4];
                var extraDays = "";
                var extraStart = "";
                var extraEnd = "";
                if (extraRow != undefined) {
                        extraDays = extraRow.cells[3].innerText;
                        extraStart = extraRow.cells[5].innerText;
                        extraEnd = extraRow.cells[6].innerText;
                        console.log(extraDays, extraStart, extraEnd);
                }
                chrome.runtime.sendMessage({courseNumber, courseName, sessionNumber, courseCredits, days, startTime, endTime, seats, extraDays, extraStart, extraEnd}, function (response) {
                        console.log(response.farewell);
                });
        }
}