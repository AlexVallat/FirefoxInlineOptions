browser.storage.onChanged.addListener(function (changes) {
    for (var change in changes) {
        console.log("Setting changed: " + change + " =", changes[change].newValue);
    }
});

browser.runtime.onMessage.addListener(message =>
    console.log("Button clicked: " + message)
);