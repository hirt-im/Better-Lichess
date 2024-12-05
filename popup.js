// Default values
const DEFAULT_COLOR = "#f2c218";
const DEFAULT_OPACITY = 1.0;

// Wait for the DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const colorInput = document.getElementById("arrowColor");
    const opacitySlider = document.getElementById("arrowOpacity");
    const opacityValueDisplay = document.getElementById("opacityValue");
    const saveButton = document.getElementById("saveSettings");
    const resetButton = document.getElementById("resetDefaults");

    // Retrieve the saved settings from chrome.storage.sync
    chrome.storage.sync.get(["arrowColor", "arrowOpacity"], (data) => {
        const savedColor = data.arrowColor || DEFAULT_COLOR;
        const savedOpacity = data.arrowOpacity !== undefined ? data.arrowOpacity : DEFAULT_OPACITY;

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

    // Event listener for the "Reset to Default" button
    resetButton.addEventListener("click", () => {
        // Reset to default values
        chrome.storage.sync.set({ arrowColor: DEFAULT_COLOR, arrowOpacity: DEFAULT_OPACITY }, () => {
            // Update the UI to reflect defaults
            colorInput.value = DEFAULT_COLOR;
            opacitySlider.value = DEFAULT_OPACITY;
            opacityValueDisplay.textContent = DEFAULT_OPACITY.toFixed(2);
            console.log("Arrow settings reset to default:", { color: DEFAULT_COLOR, opacity: DEFAULT_OPACITY });
        });
    });
});
