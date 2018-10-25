var num = document.getElementsByClassName("courseInfo").length;
var i = 0;
//var myVar;
var currentPage = document.getElementsByClassName("Portal_Grid_Pager")[0].innerText.slice(50, 52).trim();
if (currentPage == 1) {
        var button = document.createElement("button");
        button.value = "Gather class information";
        button.id = "gather-classes-button";
        document.getElementsByClassName("Portal_Grid_Pager")[0].appendChild(button);
        document.getElementById('gather-classes-button').addEventListener('click', loopPages, false);
} else {
        loopPages();
}
function loopPages() {
        scrapePage(0);
}

function scrapePage(i) {
        if (num == i) {
                nextPage();
        } else {
                var courseInfo = document.getElementsByClassName("courseInfo")[i].cells[0].innerText.split("\n")[0];
                var sessionNumber = courseInfo.slice(-2);
                var courseNumber = courseInfo.slice(0, -2);
                console.log(i, courseNumber);
                //open the class page if it doesn't exist yet
                var port = chrome.runtime.connect({ name: "isClass" });
                port.postMessage({ greeting: "isClass", courseNumber, sessionNumber });
                port.onMessage.addListener(function (response) {
                        console.log(response);
                        if (!response.common) {
                                document.getElementsByClassName("Portal_Group_SubHeader2 courseName")[i].children[0].click();
                                //wait 1.3 seconds before running the next session of code
                                //setTimeout(function () {
                                //        scrapePage(i + 1);
                                //}, 1300);
                        } else {
                                scrapePage(i + 1);
                        }
                        if (!response.session) {
                                //split course info into class number and session
                                var courseName = document.getElementsByClassName("courseInfo")[i].cells[1].innerText;
                                var courseCredits = document.getElementsByClassName("courseInfo")[i].cells[2].innerText;
                                var days = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[3].innerText;
                                var startTime = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[5].innerText;
                                var endTime = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[6].innerText;
                                //calc seats left
                                var maxEnrolled = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[7].innerText;
                                var currentEnrolled = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[2].cells[8].innerText;
                                var seats = maxEnrolled - currentEnrolled;
                                var extraRow = document.getElementsByClassName("Portal_Group_Table nested")[i].childNodes[1].childNodes[4];
                                var extraDays = "";
                                var extraStart = "";
                                var extraEnd = "";
                                if (extraRow != undefined) {
                                        extraDays = extraRow.cells[3].innerText;
                                        extraStart = extraRow.cells[5].innerText;
                                        extraEnd = extraRow.cells[6].innerText;
                                }
                                chrome.runtime.sendMessage({ greeting: "saveClass", courseNumber, courseName, sessionNumber, courseCredits, days, startTime, endTime, seats, extraDays, extraStart, extraEnd }, function (response) {
                                });
                        }
                });
        }
}

function nextPage() {
        //loads the next page
        console.log(Number(currentPage) + 1);
        document.getElementById('idPage').value = Number(currentPage) + 1;
        document.forms['OptionsForm'].submit();
}


//can get rid of isSession if i can get "i" to be passed in as "i" isn't saved and starts at 0

//simple listener, response is not important and not "needed"
chrome.runtime.onMessage.addListener(function (message) {
        console.log(i, message);
        scrapePage(i + 1);
});