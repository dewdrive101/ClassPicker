var department = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[0].innerText;
var courseId = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[1].innerText;
var name = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[3].innerText;
var credits = document.getElementsByClassName("center")[0].tBodies[0].children[0].children[5].innerText;
var number = department + " " + courseId;
console.log(number, name, credits);
var coreq = document.body.children[5].children[1].innerText;
//closes window
//document.getElementsByClassName("floatRight button")[0].click();