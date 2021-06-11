import { finder } from "@medv/finder";
import MicroModal from "micromodal";

document.addEventListener("mousedown", selectElement);




async function load_micro_popup() {
    let newElement = new DOMParser().parseFromString('<div id="scrap-stats-popup"></div>', 'text/html').body.childNodes[0];
    let micro_popup_url = chrome.runtime.getURL("micro_popup.html");

    document.querySelector("body").appendChild(newElement);
    document.getElementById("scrap-stats-popup").innerHTML = await (await fetch(micro_popup_url)).text();
}

load_micro_popup();

MicroModal.init();


var last_element = null;

function selectElement(event) {
    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }

    let element = event.target;
    last_element = element;
    console.log("element: " + element);

    // sendDataMessage(element);

    // element.style.color = "red";
    element.classList.add("scrap-stats-selected");


    MicroModal.show("modal-1", {
        onShow: modal => console.info(`${modal.id} is shown`), // [1]
        onClose: modal => console.info(`${modal.id} is hidden`), // [2]
        openTrigger: 'data-custom-open', // [3]
        closeTrigger: 'data-custom-close', // [4]
        openClass: 'is-open', // [5]
        disableScroll: true, // [6]
        disableFocus: false, // [7]
        awaitOpenAnimation: false, // [8]
        awaitCloseAnimation: false, // [9]
        debugMode: true // [10]
    });
}

// function sendDataMessage(element) {
//     console.log("sendDataMessage()");
//     let selector = finder(element);

//     chrome.runtime.sendMessage({
//         message: "Hello!",
//         url: location.href,
//         title: "The title",
//         value: element.innerHTML,
//         selector: selector
//     }, function(response) {
//         console.log("message response: ", response);
//     });
// }