let isDragging = false; // Track if the user is dragging
let dragStartSquare = null; // Track the square where the drag started
let startX = 0; // Track the X position where the right-click started
let startY = 0; // Track the Y position where the right-click started
const dragThreshold = 50; // Minimum movement (in pixels) to consider it a drag

const enableSquareHighlighting = () => {
    document.addEventListener("mousedown", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard

        if (event.button === 2) { // Right mouse button
            isDragging = false; // Reset dragging state
            dragStartSquare = getSquareFromEvent(event); // Record the starting square
            startX = event.clientX; // Record the starting X position
            startY = event.clientY; // Record the starting Y position
        }
    });

    document.addEventListener("mousemove", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard

        if (event.buttons === 2) { // Right mouse button is pressed
            const deltaX = Math.abs(event.clientX - startX); // Calculate X movement
            const deltaY = Math.abs(event.clientY - startY); // Calculate Y movement

            if (deltaX > dragThreshold || deltaY > dragThreshold) {
                isDragging = true; // User is dragging if movement exceeds the threshold
            }
        }
    });

    document.addEventListener("mouseup", (event) => {
        isDragging = false;
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard

        if (event.button === 2) { // Right mouse button
            if (!isDragging) {
                // If not dragging, highlight the square
                toggleSquareHighlight(event);
            }
            isDragging = false; // Reset dragging state
        }
    });

    // Add a left-click event listener to clear all highlights
    document.addEventListener("click", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard

        // Remove all highlight overlays
        board.querySelectorAll(".highlight-overlay").forEach((highlight) => highlight.remove());
    });
};

const toggleSquareHighlight = (event) => {
    const board = document.querySelector("cg-board");
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position relative to the board
    const y = event.clientY - rect.top;  // Y position relative to the board

    const squareSize = rect.width / 8; // Assuming an 8x8 grid
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

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
};

const getSquareFromEvent = (event) => {
    const board = document.querySelector("cg-board");
    if (!board) return null;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position relative to the board
    const y = event.clientY - rect.top;  // Y position relative to the board

    // Calculate the square size and the row/column
    const squareSize = rect.width / 8; // Assuming an 8x8 grid
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    return { row, col };
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

// Inject dynamic CSS
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
