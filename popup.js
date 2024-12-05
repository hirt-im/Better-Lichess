// Wait for the DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const colorInput = document.getElementById("arrowColor");
    const opacitySlider = document.getElementById("arrowOpacity");
    const opacityValueDisplay = document.getElementById("opacityValue");
    const saveButton = document.getElementById("saveSettings");

    // Retrieve the saved settings from chrome.storage.sync
    chrome.storage.sync.get(["arrowColor", "arrowOpacity"], (data) => {
        const savedColor = data.arrowColor || "#f2c218";
        const savedOpacity = data.arrowOpacity !== undefined ? data.arrowOpacity : 1.0;

        // Set the color input's value to the saved color
        colorInput.value = savedColor;

        // Set the range input to the saved opacity
        opacitySlider.value = savedOpacity;
        opacityValueDisplay.textContent = savedOpacity.toFixed(2);
    });

    // Update the displayed opacity value when the slider moves
    opacitySlider.addEventListener("input", () => {
        opacityValueDisplay.textContent = parseFloat(opacitySlider.value).toFixed(2);
    });

    // Event listener for the "Save" button
    saveButton.addEventListener("click", () => {
        const color = colorInput.value;
        const opacity = parseFloat(opacitySlider.value);

        chrome.storage.sync.set({ arrowColor: color, arrowOpacity: opacity }, () => {
            console.log("Arrow settings saved:", { color, opacity });
        });
    });
});
