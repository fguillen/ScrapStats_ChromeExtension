console.debug("Scrap Stats popup.js loading...");

function sendCommand(command) {
    console.debug("sendCommand(): ", command);

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: command }, function(response) {
            console.debug(response.farewell);
        });
    });
}

var switchElement = document.getElementById("switch");
switchElement.addEventListener("change", switchChanged);

function switchChanged(event) {
    console.debug("event.target: ", event.target);

    if (event.target.checked) {
        sendCommand("activate");
    } else {
        sendCommand("deactivate");
    }
}
