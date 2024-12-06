// Locate the .site-buttons container in the DOM
const siteButtons = document.querySelector('.site-buttons');
if (siteButtons) {
    // Create the Extension Settings toggle button
    // const extensionBtn = document.createElement('button');
    // extensionBtn.id = 'extension-settings-toggle';
    // extensionBtn.className = 'toggle link';
    // extensionBtn.textContent = 'Extension Settings';


    const extensionBtn = document.createElement('button');
extensionBtn.id = 'extension-settings-toggle';
extensionBtn.className = 'toggle link';
// Instead of textContent, use innerHTML to include the icon
extensionBtn.innerHTML = `<img src="${chrome.runtime.getURL('icon.png')}" alt="Settings Icon" style="width:20px;height:20px;vertical-align:middle;margin-right:5px;">`;


    // Append the button to .site-buttons
    siteButtons.appendChild(extensionBtn);

    // Create a container for the settings menu
    const extensionMenu = document.createElement('div');
    extensionMenu.id = 'extension-menu';
    extensionMenu.style.display = 'none'; // Hidden by default
    extensionMenu.style.position = 'absolute';
    extensionMenu.style.right = '20px';
    extensionMenu.style.top = '50px';
    extensionMenu.style.background = 'rgb(66 66 66)';
    extensionMenu.style.border = '1px solid #bababa';
    extensionMenu.style.borderRadius = '5px';
    extensionMenu.style.padding = '10px';
    extensionMenu.style.zIndex = '999999';
    extensionMenu.style.color = '#e3e3e3';

    // Insert the popup-like HTML structure into the menu
    extensionMenu.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; font-family: sans-serif;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="arrowColor">Color</label>
          <input type="color" id="arrowColor" style="margin: 0 auto;" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="arrowOpacity">Opacity</label>
          <input type="range" id="arrowOpacity" min="0" max="1" step=".01" style="width: 120px; padding: 0;" />
        </div>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <button id="saveSettings" style="padding: 8px 14px; border: 1px solid #ccc; border-radius: 4px; background-color: #f3f3f3; color: #373737; cursor: pointer; font: inherit; font-weight: bold;">
          Apply
        </button>
        <button id="resetDefaults" style="padding: 8px 14px; border: 1px solid #ccc; border-radius: 4px; background-color: #f3f3f3; color: #848484; cursor: pointer; font: inherit; font-weight: bold;"> 
          Reset
        </button>
      </div>
    </div>
  `;
  

    document.body.appendChild(extensionMenu);

    // Toggle the visibility of the menu when the button is clicked
    extensionBtn.addEventListener('click', () => {
        extensionMenu.style.display = (extensionMenu.style.display === 'none') ? 'block' : 'none';
    });

    // Adapted logic from popup.js
    const DEFAULT_COLOR = "#f2c218";
    const DEFAULT_OPACITY = 1.0;
    const colorInput = extensionMenu.querySelector('#arrowColor');
    const opacitySlider = extensionMenu.querySelector('#arrowOpacity');
    const opacityValueDisplay = extensionMenu.querySelector('#opacityValue');
    const saveButton = extensionMenu.querySelector('#saveSettings');
    const resetButton = extensionMenu.querySelector('#resetDefaults');

    // Retrieve the saved settings
    chrome.storage.sync.get(["arrowColor", "arrowOpacity"], (data) => {
        const savedColor = data.arrowColor || DEFAULT_COLOR;
        const savedOpacity = data.arrowOpacity !== undefined ? data.arrowOpacity : DEFAULT_OPACITY;

        colorInput.value = savedColor;
        colorInput.style.border = 'none';
        colorInput.style.width = '40px';
        colorInput.style.height = '40px';
        colorInput.style.padding = '0';

        console.log('color', savedColor);
        opacitySlider.value = savedOpacity;
        opacityValueDisplay.textContent = parseFloat(savedOpacity).toFixed(2);
    });

    // Update displayed opacity value when the slider moves
    opacitySlider.addEventListener("input", () => {
        opacityValueDisplay.textContent = parseFloat(opacitySlider.value).toFixed(2);
    });

    // Save button logic
    saveButton.addEventListener("click", () => {
        const color = colorInput.value;
        const opacity = parseFloat(opacitySlider.value);

        chrome.storage.sync.set({ arrowColor: color, arrowOpacity: opacity }, () => {
            console.log("Arrow settings saved:", { color, opacity });
        });
    });

    // Reset to default logic
    resetButton.addEventListener("click", () => {
        chrome.storage.sync.set({ arrowColor: DEFAULT_COLOR, arrowOpacity: DEFAULT_OPACITY }, () => {
            colorInput.value = DEFAULT_COLOR;
            opacitySlider.value = DEFAULT_OPACITY;
            opacityValueDisplay.textContent = DEFAULT_OPACITY.toFixed(2);
            console.log("Arrow settings reset to default:", { color: DEFAULT_COLOR, opacity: DEFAULT_OPACITY });
        });
    });
}





let dragStartSquare = null; // Track the square where the drag started

const enableSquareHighlighting = () => {
    
    document.addEventListener("pointerdown", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; 
        console.log('here', event.button)

        if (event.button === 2) { // Right mouse button
            dragStartSquare = getSquareFromEvent(event); // Record the starting square
            console.log(dragStartSquare);
        }
    });

    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard

        if (event.button === 2) { // Right mouse button
            const endSquare = getSquareFromEvent(event); // Get the square where the drag ended
            console.log(dragStartSquare, endSquare);
            if (dragStartSquare && (dragStartSquare.row !== endSquare.row || dragStartSquare.col !== endSquare.col)) {
                // Do not highlight if the drag ended on a different square
                return;
            }
            toggleSquareHighlight(event); // Highlight the square if it's the same as the starting square
        }
        dragStartSquare = null;
    });

    // Add a left-click event listener to clear all highlights
    document.addEventListener("click", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard

        // Remove all highlight overlays
        board.querySelectorAll(".highlight-overlay").forEach((highlight) => highlight.remove());
    });

    document.addEventListener("contextmenu", (event) => {
        const board = document.querySelector("cg-board");
        if (board && board.contains(event.target)) {
            event.preventDefault(); // Prevent the default context menu only on the chessboard
        }
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

chrome.storage.sync.get(["arrowColor", "arrowOpacity"], (data) => {
    const savedColor = data.arrowColor || "#f2c218";
    const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : 1.0;

    injectDynamicCSS(savedColor, savedOpacity);
    enableSquareHighlighting(); // Enable right-click highlighting for squares
});


chrome.storage.onChanged.addListener((changes) => {
    let newColor, newOpacity;
    if (changes.arrowColor) {
        newColor = changes.arrowColor.newValue;
    }
    if (changes.arrowOpacity) {
        newOpacity = changes.arrowOpacity.newValue;
    }

    chrome.storage.sync.get(["arrowColor", "arrowOpacity"], (data) => {
        const updatedColor = newColor || data.arrowColor || "#f2c218";
        const updatedOpacity = (newOpacity !== undefined) ? newOpacity : (data.arrowOpacity !== undefined ? data.arrowOpacity : 1.0);
        injectDynamicCSS(updatedColor, updatedOpacity);
    });
});

// Inject dynamic CSS
const injectDynamicCSS = (color, opacity) => {
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
            background: radial-gradient(rgba(77,77,77,.5) 19%, rgba(0, 0, 0, 0) 20%) !important;
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
        cg-container .cg-shapes {
            opacity: ${opacity} !important;
        }
        input::-webkit-color-swatch {
            border: none;
        }
    `;

    const style = document.createElement("style");
    style.id = "dynamicArrowStyles";
    style.textContent = css;

    document.head.appendChild(style);
};

