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
                courseNumber = document.getElementsByClassName("courseInfo")[i].cells[0].innerText.split("\n")[0];
                courseName = document.getElementsByClassName("courseInfo")[i].cells[1].innerText;
                courseCredits = document.getElementsByClassName("courseInfo")[i].cells[2].innerText;
                days = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[3].innerText;
                startTime = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[5].innerText;
                endTime = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[6].innerText;
                maxEnrolled = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[7].innerText;
                currentEnrolled = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[8].innerText;
                seats = maxEnrolled - currentEnrolled;
                extraRow = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[4];
                extraDays = "";
                extraStart = "";
                extraEnd = "";
                if (extraRow != undefined) {
                        extraDays = extraRow.cells[3].innerText;
                        extraStart = extraRow.cells[5].innerText;
                        extraEnd = extraRow.cells[6].innerText;
                        console.log(extraDays, extraStart, extraEnd);
                }
                chrome.runtime.sendMessage({ courseNumber, courseName, courseCredits, days, startTime, endTime, seats, extraDays, extraStart, extraEnd}, function (response) {
                        console.log(response.farewell);
                });
        }
}