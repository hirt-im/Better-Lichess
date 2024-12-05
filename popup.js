// Wait for the DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the saved color from chrome.storage.sync
    chrome.storage.sync.get("arrowColor", (data) => {
        const savedColor = data.arrowColor || "#ff0000"; // Default to red if no color is saved
        // Set the color input's value to the saved color
        document.getElementById("arrowColor").value = savedColor;
    });

    // Event listener for the "Save" button
    document.getElementById("saveColor").addEventListener("click", () => {
        const color = document.getElementById("arrowColor").value;
        chrome.storage.sync.set({ arrowColor: color }, () => {
            console.log("Arrow color saved:", color);
        });
    });
});
