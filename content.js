import { finder } from "@medv/finder";
import MicroModal from "micromodal";

var last_element = null;

async function insertScrapStatsPopup() {
    let newElement = new DOMParser().parseFromString('<div id="scrap-stats-popup"></div>', 'text/html').body.childNodes[0];
    let add_scraper_popup_url = chrome.runtime.getURL("add_scraper_popup.html");

    document.querySelector("body").appendChild(newElement);
    document.getElementById("scrap-stats-popup").innerHTML = await (await fetch(add_scraper_popup_url)).text();
    document.getElementById("scrap-stats-popup").querySelector("#add-scraper").addEventListener("click", addScraper);

    // set icon image
    let iconImage = document.getElementById("scrap-stats-popup").querySelector(".icon > img");
    iconImage.src = chrome.runtime.getURL("icon.png");

    // inject css
    var element = document.getElementById("scrap-stats-popup");
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("add_scraper_popup.css");
    link.media = "all";
    element.appendChild(link)

    MicroModal.init();
}

insertScrapStatsPopup();

function removeScrapStatsPopup() {
    document.getElementById("scrap-stats-popup").remove();
}

function overElement(event) {
    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }

    let element = event.target;
    last_element = element;
    element.classList.add("scrap-stats-selected");
}

function selectElement(event) {
    let element = event.target;

    deactivate();

    modalFill(element);

    MicroModal.show("modal-1", {
        onShow: modalShow,
        onClose: modalClose,
        debugMode: true
    });
}

function modalFill(element) {
    let modalElement = document.getElementById("scrap-stats-popup");
    modalElement.querySelector("#url").innerHTML = location.href;
    modalElement.querySelector("#name").innerHTML = document.title;
    modalElement.querySelector("#selector").innerHTML = finder(element);
    modalElement.querySelector("#value").innerHTML = element.innerHTML.substring(0, 20);
}

function modalShow(modal) {
    deactivate();
}

function modalClose(modal) {
    activate();
}

function activate() {
    console.debug("Scrap Stats Extension activated");
    document.addEventListener("mousedown", selectElement);
    document.addEventListener("mouseover", overElement);
}

function deactivate() {
    console.debug("Scrap Stats Extension deactivated");
    document.removeEventListener("mousedown", selectElement);
    document.removeEventListener("mouseover", overElement);

    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }
}

chrome.runtime.onMessage.addListener(commandReceived);

function commandReceived(message, sender, sendResponse) {
    if (message.command == "activate") {
        activate();
    }

    if (message.command == "deactivate") {
        deactivate();
    }

    sendResponse({ farewell: "Roger That" });
}

function addScraper() {
    console.debug("addScraper()");

    let modalElement = document.getElementById("scrap-stats-popup");
    let name = modalElement.querySelector("#name").innerHTML;
    let url = modalElement.querySelector("#url").innerHTML;
    let selector = modalElement.querySelector("#selector").innerHTML;

    name = encodeURIComponent(name)
    url = encodeURIComponent(url)
    selector = encodeURIComponent(selector)

    // window.open("https://scrapstats.com/front/scrapers/new?name=" + name + "&url=" + url + "&selector=" + selector);
    window.open("http://localhost:3000/front/scrapers/new?name=" + name + "&url=" + url + "&selector=" + selector);
}
