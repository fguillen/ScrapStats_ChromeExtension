console.log("Scrap Stats popup.js loading...");

chrome.runtime.onMessage.addListener(messageReceived);

function messageReceived(message, sender, sendResponse) {
    console.log("messageReceived: ", message);
    sendResponse({
        data: "Received from popup.js"
    })
}