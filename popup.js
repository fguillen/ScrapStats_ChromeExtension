console.debug("Scrap Stats popup.js loading...");

document.addEventListener("DOMContentLoaded", onLoad);

function sendCommand(command) {
    console.debug("ScrapStats :: Popup.sendCommand(): ", command);

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: command }, parseCommandResponse);
    });
}

function parseCommandResponse(response) {
    console.debug("ScrapStats :: Popup.parseCommandResponse()", response);

    if (response.command === "status") {
        setSwitchStatus(response.result);
    }
}

function switchChanged(event) {
    if (event.target.checked) {
        sendCommand("activate");
    } else {
        sendCommand("deactivate");
    }
}

function onLoad() {
    console.debug("ScrapStats :: Popup.onLoad()");
    document.getElementById("switch").addEventListener("change", switchChanged);

    sendCommand("status");
}

function setSwitchStatus(status) {
    console.debug("ScrapStats :: Popup.setSwitchStatus()", status);

    let switchElement = document.getElementById("switch");

    if (status === "activate") {
        switchElement.checked = true;
    } else {
        switchElement.checked = false;
    }
}
