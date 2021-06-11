import { finder } from "@medv/finder";

document.addEventListener("mousedown", selectElement);

var micro_popup_url = chrome.runtime.getURL("micro_popup.html");
let newElement = new DOMParser().parseFromString('<div id="scrap-stats-popup"><object type="text/html" data="' + micro_popup_url + '" ></object></div>', 'text/html').body.childNodes[0];
document.querySelector("body").appendChild(newElement);



var last_element = null;

function selectElement(event) {
    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }

    let element = event.target;
    last_element = element;
    console.log("element: " + element);

    sendDataMessage(element);

    // element.style.color = "red";
    element.classList.add("scrap-stats-selected");
}

function sendDataMessage(element) {
    console.log("sendDataMessage()");
    let selector = finder(element);

    chrome.runtime.sendMessage({
        message: "Hello!",
        url: location.href,
        title: "The title",
        value: element.innerHTML,
        selector: selector
    }, function(response) {
        console.log("message response: ", response);
    });
}