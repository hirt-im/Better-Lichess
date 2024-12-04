document.getElementById("saveColor").addEventListener("click", () => {
    const color = document.getElementById("arrowColor").value;

    // Save the color to Chrome storage
    chrome.storage.sync.set({ arrowColor: color }, () => {
        console.log("Arrow color saved!"); // Optional: Use console.log for debugging
    });
});
