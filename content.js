const injectDynamicCSS = (color) => {
    const existingStyle = document.getElementById("dynamicArrowStyles");
    if (existingStyle) existingStyle.remove();

    const css = `
        g line {
            stroke: ${color} !important;
            fill: ${color} !important;
        }
        marker path {
            fill: ${color} !important;
        }
        g circle {
            stroke: ${color} !important;
        }
        square.move-dest {
            background: radial-gradient(${hexToRgba(color, 0.5)} 19%, rgba(0, 0, 0, 0) 20%) !important;
        }
        square.selected {
            background-color: ${hexToRgba(color, 0.5)} !important;
        }
        square.premove-dest {
            background: radial-gradient(${hexToRgba(color, 0.5)} 19%, rgba(0, 0, 0, 0) 20%) !important;
        }
    `;

    const style = document.createElement("style");
    style.id = "dynamicArrowStyles";
    style.textContent = css;

    document.head.appendChild(style);
};

// Convert hex to rgba
const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Retrieve the saved color from storage and inject the CSS
chrome.storage.sync.get("arrowColor", (data) => {
    const savedColor = data.arrowColor || "#ff0000"; // Default to red
    injectDynamicCSS(savedColor);
});

// Listen for changes to the color and update the CSS dynamically
chrome.storage.onChanged.addListener((changes) => {
    if (changes.arrowColor) {
        const newColor = changes.arrowColor.newValue;
        injectDynamicCSS(newColor);
    }
});
