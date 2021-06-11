console.log("Scrap Stats popup.js loading...");

chrome.runtime.onMessage.addListener(messageReceived);

function messageReceived(message, sender, sendResponse) {
    console.log("messageReceived: ", message);

    document.getElementById("url").innerHTML = "XXX";

    sendResponse({
        data: "Data received from popup.js"
    })
}