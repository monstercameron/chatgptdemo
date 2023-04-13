console.log("from extension");

chrome.tabs.sendMessage(tabId, { greeting: "hello" }, function (response) {
    console.log(response.farewell);
});
