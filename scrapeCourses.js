//opens the first class
document.getElementsByTagName('a')[41].click();
//gets the text of each box
var textArray = document.getElementsByClassName('ajaxcourseindentfix')[0].innerText.split(/\r?\n/);
console.log(textArray[0].slice(0, 8));
var number = textArray[0].slice(0, 8);
//check if the number is already in the database. if yes the class exists on cams
chrome.runtime.sendMessage({greeting: "isClass", number}, function (response) {
    console.log(response.farewell);
});