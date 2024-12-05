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
            visibility: hidden !important;
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
        .highlight-overlay {
            border: none;
            background-color: rgb(235, 97, 80);
            opacity: 0.8;
            pointer-events: none; /* Prevent interference with mouse events */
            position: absolute;
            z-index: 1;
        }
    `;

    const style = document.createElement("style");
    style.id = "dynamicArrowStyles";
    style.textContent = css;

    document.head.appendChild(style);
};

// Add a right-click event listener to highlight or unhighlight squares
const enableSquareHighlighting = () => {
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // Prevent the default right-click menu

        // Get the chessboard
        const board = document.querySelector("cg-board");
        if (!board) return;

        // Calculate the clicked position
        const rect = board.getBoundingClientRect();
        const x = event.clientX - rect.left; // X position relative to the board
        const y = event.clientY - rect.top;  // Y position relative to the board

        // Calculate the square size and the row/column
        const squareSize = rect.width / 8; // Assuming an 8x8 grid
        const col = Math.floor(x / squareSize);
        const row = Math.floor(y / squareSize);

        // Translate these into `transform` values
        const transform = `translate(${col * squareSize}px, ${row * squareSize}px)`;

        const highlightClass = "highlight-overlay";

        // Check if the square is already highlighted
        const existingHighlight = Array.from(board.querySelectorAll(`.${highlightClass}`)).find(
            (highlight) => highlight.style.transform === transform
        );

        if (existingHighlight) {
            // If the square is already highlighted, remove the highlight
            existingHighlight.remove();
        } else {
            // Otherwise, create a new highlight overlay
            const highlight = document.createElement("div");
            highlight.classList.add(highlightClass);
            highlight.style.width = `${squareSize}px`;
            highlight.style.height = `${squareSize}px`;
            highlight.style.transform = transform;

            // Append the highlight to the board
            board.appendChild(highlight);
        }
    });

    // Add a left-click event listener to clear all highlights
    document.addEventListener("click", (event) => {
        // Get the chessboard
        const board = document.querySelector("cg-board");
        if (!board) return;

        // Remove all highlight overlays
        board.querySelectorAll(".highlight-overlay").forEach((highlight) => highlight.remove());
    });
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
    enableSquareHighlighting(); // Enable right-click highlighting for squares
});

// Listen for changes to the color and update the CSS dynamically
chrome.storage.onChanged.addListener((changes) => {
    if (changes.arrowColor) {
        const newColor = changes.arrowColor.newValue;
        injectDynamicCSS(newColor);
    }
});
