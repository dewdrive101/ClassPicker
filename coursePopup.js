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
// < 6 no reqs, 8 both co and pre reqs
if (length > 6) {
    if (length < 8) {
        if (document.body.children[5].children[1])
            coreq = document.body.children[5].children[1].innerText;
        if (document.body.children[6].children[1])
            prereq = document.body.children[6].children[1].innerText;
    } else {
        coreq = document.body.children[5].children[1].innerText;
        prereq = document.body.children[6].children[1].innerText;
    }
}
chrome.runtime.sendMessage({ greeting: "appendClass", number, name, credits, coreq, prereq }, function (response) {
});
document.getElementsByClassName("floatRight button")[0].click();