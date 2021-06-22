import { finder } from "@medv/finder";
import MicroModal from "micromodal";

var last_element = null;
var last_scraper_settings = null;
var status = "deactivate";

insertScrapStatsPopup();

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

    MicroModal.show("scrap-stats-modal-1", {
        onShow: modalShow,
        onClose: modalClose,
        debugMode: true
    });
}

function modalFill(element) {
    let modalElement = document.getElementById("scrap-stats-popup");

    last_scraper_settings = {
        url: location.href,
        name: document.title,
        selector: finder(element),
        value: element.innerHTML.substring(0, 20)
    }

    console.debug("ScrapStats :: Content.modalFill()", last_scraper_settings);

    modalElement.querySelector("#url").innerHTML = last_scraper_settings.url;
    modalElement.querySelector("#name").innerHTML = last_scraper_settings.name;
    modalElement.querySelector("#selector").innerHTML = last_scraper_settings.selector;
    modalElement.querySelector("#value").innerHTML = last_scraper_settings.value;
}

function modalShow(modal) {
    deactivate();
}

function modalClose(modal) {
    activate();
}

function activate() {
    console.debug("ScrapStats :: Content.activate()");

    document.addEventListener("mousedown", selectElement);
    document.addEventListener("mouseover", overElement);

    status = "activate";
}

function deactivate() {
    console.debug("ScrapStats :: Content.deactivate()");

    document.removeEventListener("mousedown", selectElement);
    document.removeEventListener("mouseover", overElement);

    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }

    status = "deactivate";
}

chrome.runtime.onMessage.addListener(commandReceived);

function commandReceived(message, sender, sendResponse) {
    let result = null;

    switch (message.command) {
        case "activate":
            activate();
            result = "Roger That";
            break;

        case "deactivate":
            deactivate();
            result = "Roger That";
            break;

        case "status":
            result = status;
            break;

        default:
            console.debug("ScrapStats :: Content.commandReceived() :: command no supported", message.command);
            break;
    }

    sendResponse({ command: message.command, result: result });
    return true;
}

function addScraper() {
    let name = last_scraper_settings.name;
    let url = last_scraper_settings.url;
    let selector = last_scraper_settings.selector;

    name = encodeURIComponent(name)
    url = encodeURIComponent(url)
    selector = encodeURIComponent(selector)

    window.open("https://scrapstats.com/front/scrapers/new?name=" + name + "&url=" + url + "&selector=" + selector);
    // window.open("http://localhost:3000/front/scrapers/new?name=" + name + "&url=" + url + "&selector=" + selector);
}
