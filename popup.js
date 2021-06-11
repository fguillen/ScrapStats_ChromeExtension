console.log("Scrap Stats popup.js loading...");

function sendCommand(command) {
    console.log("sendCommand(): ", command);

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: command }, function(response) {
            console.log(response.farewell);
        });
    });
}

var switchElement = document.getElementById("switch");
switchElement.addEventListener("change", switchChanged);

function switchChanged(event) {
    console.log("event.target: ", event.target);

    if (event.target.checked) {
        sendCommand("activate");
        setState("active");
    } else {
        sendCommand("deactivate");
        setState("inactive");
    }
}

chrome.storage.sync.get("scrap_stats_state", function(result) {
    console.log("result: ", result);
    let state = result.scrap_stats_state;
    console.log("Scrap Stats state is " + state);

    if (state == "active") {
        document.getElementById("switch").checked = true;
    } else {
        document.getElementById("switch").checked = false;
    }
});

function setState(state) {
    chrome.storage.sync.set({ "scrap_stats_state": state });
}