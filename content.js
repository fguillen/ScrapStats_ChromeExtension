import { finder } from "@medv/finder";
import MicroModal from "micromodal";


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

    modalFill(element);

    MicroModal.show("modal-1", {
        onShow: modalShow,
        onClose: modalClose,
        debugMode: true
    });

    deactivate();
    element.classList.add("scrap-stats-selected");
}

function modalFill(element) {
    let modalElement = document.getElementById("scrap-stats-popup");
    modalElement.querySelector("#url").innerHTML = location.href;
    modalElement.querySelector("#title").innerHTML = document.title;
    modalElement.querySelector("#selector").innerHTML = finder(element);
    modalElement.querySelector("#value").innerHTML = element.innerHTML;
}

function modalShow(modal) {
    deactivate();
}

function modalClose(modal) {
    activate();
}

function activate() {
    console.log("Scrap Stats Extension activated");
    document.addEventListener("mousedown", selectElement);
}

function deactivate() {
    console.log("Scrap Stats Extension deactivated");
    document.removeEventListener("mousedown", selectElement);
    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }
}

chrome.runtime.onMessage.addListener(commandReceived);

function commandReceived(message, sender, sendResponse) {
    console.log("commandReceived: ", message);

    if (message.command == "activate") {
        activate();
    }

    if (message.command == "deactivate") {
        deactivate();
    }

    sendResponse({ farewell: "Roger That" });
}