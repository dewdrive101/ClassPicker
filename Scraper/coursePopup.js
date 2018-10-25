var department = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[0].innerText;
var courseId = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[1].innerText;
var type = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[2].innerText;
var name = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[3].innerText;
var credits = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[5].innerText;
var number = department + courseId + type;
console.log(number, name, credits);

var coreq = "none";
var prereq = "none";
var length = document.body.children.length;
for (i = 0; i < length; i++) {
    child = document.body.children[i]
    if (child.children[0]) {
        if (child.children[0].innerText.split(" ")[0] == "Prerequisite")
            prereq = child.children[1].innerText;
        if (child.children[0].innerText.split(" ")[0] == "Corequisite") 
            coreq = child.children[1].innerText;
    }
}

chrome.runtime.sendMessage({ greeting: "appendClass", number, name, credits, coreq, prereq }, function (response) {
});
document.getElementsByClassName("floatRight button")[0].click();