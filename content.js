console.log("Scrap Stats Extension content.js loading ....");
document.addEventListener("mousedown", selectElement);

var last_element = null;

function selectElement(event) {
    if (last_element != null) {
        last_element.classList.remove("scrap-stats-selected");
    }

    let element = event.target;
    last_element = element;
    console.log("element: " + element);
    // element.style.color = "red";
    element.classList.add("scrap-stats-selected");

    sendDataMessage(element);
}

function sendDataMessage(element) {
    console.log("sendDataMessage()");

    chrome.runtime.sendMessage({
        message: "Hello!",
        value: element.innerHTML
    }, function(response) {
        console.log("message response: ", response);
    });
}