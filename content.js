const DEFAULT_COLOR = "#f2c218";
const DEFAULT_OPACITY = 1.0;
const DEFAULT_MOVE_DEST_COLOR = "#4d4d4d"; 
const DEFAULT_HIGHLIGHT_OVERLAY_COLOR = "#eb6150"; 
const DEFAULT_SELECTED_COLOR = "#f2c218"; 

// Extension button and menu
const siteButtons = document.querySelector('.site-buttons');
if (siteButtons) {
    const extensionBtn = document.createElement('button');
    extensionBtn.id = 'extension-settings-toggle';
    extensionBtn.className = 'toggle link';
    extensionBtn.innerHTML = `<img src="${chrome.runtime.getURL('icon.png')}" alt="Settings Icon" style="width:20px;height:20px;vertical-align:middle;">`;

    // Insert as second-to-last element
    const lastChild = siteButtons.lastElementChild;
    siteButtons.insertBefore(extensionBtn, lastChild);

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

    extensionMenu.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; font-family: sans-serif;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">

        <!-- Arrow Color -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="arrowColor">Arrows</label>
          <div style="position: relative; width:40px; height:40px;">
            <input type="color" id="arrowColor" style="opacity:0; position:absolute; top:0; left:0; width:100%; height:100%; cursor: pointer;" />
            <div id="arrowColorCircle" style="border-radius:50%; width:40px; height:40px; cursor: pointer; border: 1px solid white; margin-top: 3px;"></div>
          </div>
        </div>

        <!-- Move Dest Color -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="moveDestColor">Move Dots</label>
          <div style="position: relative; width:40px; height:40px;">
            <input type="color" id="moveDestColor" style="opacity:0; position:absolute; top:0; left:0; width:100%; height:100%; cursor: pointer;" />
            <div id="moveDestColorCircle" style="border-radius:50%; width:40px; height:40px; cursor: pointer; border: 1px solid white; margin-top: 3px"></div>
          </div>
        </div>

        <!-- Highlight Overlay Color -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="highlightOverlayColor">Highlighter</label>
          <div style="position: relative; width:40px; height:40px;">
            <input type="color" id="highlightOverlayColor" style="opacity:0; position:absolute; top:0; left:0; width:100%; height:100%; cursor: pointer;" />
            <div id="highlightOverlayColorCircle" style="border-radius:50%; width:40px; height:40px; cursor: pointer; border: 1px solid white; margin-top: 3px"></div>
          </div>
        </div>

        <!-- Selected Square Color -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="selectedSquareColor">Selected</label>
          <div style="position: relative; width:40px; height:40px;">
            <input type="color" id="selectedSquareColor" style="opacity:0; position:absolute; top:0; left:0; width:100%; height:100%; cursor: pointer;" />
            <div id="selectedSquareColorCircle" style="border-radius:50%; width:40px; height:40px; cursor: pointer; border: 1px solid white; margin-top: 3px"></div>
          </div>
        </div>

         <!-- Opacity -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="arrowOpacity">Arrow Opacity</label>
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

    // Toggle menu on click
    extensionBtn.addEventListener('click', () => {
        extensionMenu.style.display = (extensionMenu.style.display === 'none') ? 'block' : 'none';
    });

    const colorInput = extensionMenu.querySelector('#arrowColor');
    const moveDestColorInput = extensionMenu.querySelector('#moveDestColor');
    const highlightOverlayColorInput = extensionMenu.querySelector('#highlightOverlayColor');
    const selectedSquareColorInput = extensionMenu.querySelector('#selectedSquareColor');
    const opacitySlider = extensionMenu.querySelector('#arrowOpacity');
    const opacityValueDisplay = extensionMenu.querySelector('#opacityValue');
    const saveButton = extensionMenu.querySelector('#saveSettings');
    const resetButton = extensionMenu.querySelector('#resetDefaults');

    // Retrieve saved settings
    chrome.storage.sync.get(["arrowColor", "arrowOpacity", "moveDestColor", "highlightOverlayColor", "selectedSquareColor"], (data) => {
        const savedColor = data.arrowColor || DEFAULT_COLOR;
        const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : DEFAULT_OPACITY;
        const savedMoveDestColor = data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
        const savedHighlightOverlayColor = data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
        const savedSelectedSquareColor = data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

        colorInput.value = savedColor;
        moveDestColorInput.value = savedMoveDestColor;
        highlightOverlayColorInput.value = savedHighlightOverlayColor;
        selectedSquareColorInput.value = savedSelectedSquareColor;

        // Update the circle backgrounds
        document.getElementById('arrowColorCircle').style.backgroundColor = savedColor;
        document.getElementById('moveDestColorCircle').style.backgroundColor = savedMoveDestColor;
        document.getElementById('highlightOverlayColorCircle').style.backgroundColor = savedHighlightOverlayColor;
        document.getElementById('selectedSquareColorCircle').style.backgroundColor = savedSelectedSquareColor;

        opacitySlider.value = savedOpacity;
        opacityValueDisplay.textContent = parseFloat(savedOpacity).toFixed(2);
    });

    // Show color picker when the circles are clicked
    document.getElementById('arrowColorCircle').addEventListener('click', () => colorInput.click());
    document.getElementById('moveDestColorCircle').addEventListener('click', () => moveDestColorInput.click());
    document.getElementById('highlightOverlayColorCircle').addEventListener('click', () => highlightOverlayColorInput.click());
    document.getElementById('selectedSquareColorCircle').addEventListener('click', () => selectedSquareColorInput.click());

    // Update circle background on color input changes
    colorInput.addEventListener('change', () => {
        document.getElementById('arrowColorCircle').style.backgroundColor = colorInput.value;
    });
    moveDestColorInput.addEventListener('change', () => {
        document.getElementById('moveDestColorCircle').style.backgroundColor = moveDestColorInput.value;
    });
    highlightOverlayColorInput.addEventListener('change', () => {
        document.getElementById('highlightOverlayColorCircle').style.backgroundColor = highlightOverlayColorInput.value;
    });
    selectedSquareColorInput.addEventListener('change', () => {
        document.getElementById('selectedSquareColorCircle').style.backgroundColor = selectedSquareColorInput.value;
    });

    // Save button logic
    saveButton.addEventListener("click", () => {
        const color = colorInput.value;
        const moveDestColor = moveDestColorInput.value;
        const highlightOverlayColor = highlightOverlayColorInput.value;
        const selectedSquareColor = selectedSquareColorInput.value;
        const opacity = parseFloat(opacitySlider.value);

        chrome.storage.sync.set({ 
            arrowColor: color, 
            arrowOpacity: opacity, 
            moveDestColor: moveDestColor,
            highlightOverlayColor: highlightOverlayColor,
            selectedSquareColor: selectedSquareColor
        }, () => {
            console.log("Arrow settings saved:", { color, opacity, moveDestColor, highlightOverlayColor, selectedSquareColor });
        });
    });

    // Reset to default logic
    resetButton.addEventListener("click", () => {
        chrome.storage.sync.set({ 
            arrowColor: DEFAULT_COLOR, 
            arrowOpacity: DEFAULT_OPACITY, 
            moveDestColor: DEFAULT_MOVE_DEST_COLOR, 
            highlightOverlayColor: DEFAULT_HIGHLIGHT_OVERLAY_COLOR,
            selectedSquareColor: DEFAULT_SELECTED_COLOR
        }, () => {
            colorInput.value = DEFAULT_COLOR;
            moveDestColorInput.value = DEFAULT_MOVE_DEST_COLOR;
            highlightOverlayColorInput.value = DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
            selectedSquareColorInput.value = DEFAULT_SELECTED_COLOR;

            document.getElementById('arrowColorCircle').style.backgroundColor = DEFAULT_COLOR;
            document.getElementById('moveDestColorCircle').style.backgroundColor = DEFAULT_MOVE_DEST_COLOR;
            document.getElementById('highlightOverlayColorCircle').style.backgroundColor = DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
            document.getElementById('selectedSquareColorCircle').style.backgroundColor = DEFAULT_SELECTED_COLOR;

            opacitySlider.value = DEFAULT_OPACITY;
            opacityValueDisplay.textContent = DEFAULT_OPACITY.toFixed(2);
            console.log("Arrow settings reset to default:", { 
                color: DEFAULT_COLOR, 
                opacity: DEFAULT_OPACITY, 
                moveDestColor: DEFAULT_MOVE_DEST_COLOR,
                highlightOverlayColor: DEFAULT_HIGHLIGHT_OVERLAY_COLOR,
                selectedSquareColor: DEFAULT_SELECTED_COLOR
            });
        });
    });
}

// Square highlighting 
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

        if(isKnightOnSquare(getSquareFromEvent(event))){
            console.log('knight here');
        }
    });

    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return; // Only proceed if the event is on the chessboard
        const endSquare = getSquareFromEvent(event); // Get the square where the drag ended
        console.log('this', dragStartSquare, endSquare);
        if(event.button === 2 && isKnightOnSquare(dragStartSquare) && (dragStartSquare.row !== endSquare.row || dragStartSquare.col !== endSquare.col)){
            console.log('drawing knight arrow')
            drawKnightArrow(dragStartSquare, endSquare);
        }

        if (event.button === 2) { 
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

// Hex to rgba helper function
const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Get saved settings and inject CSS into page
chrome.storage.sync.get(["arrowColor", "arrowOpacity", "moveDestColor", "highlightOverlayColor", "selectedSquareColor"], (data) => {
    const savedColor = data.arrowColor || DEFAULT_COLOR;
    const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : DEFAULT_OPACITY;
    const savedMoveDestColor = data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
    const savedHighlightOverlayColor = data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
    const savedSelectedSquareColor = data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

    injectDynamicCSS(savedColor, savedOpacity, savedMoveDestColor, savedHighlightOverlayColor, savedSelectedSquareColor);
    enableSquareHighlighting(); // Enable right-click highlighting for squares
});

// Listen for changes in settings, including selectedSquareColor
chrome.storage.onChanged.addListener((changes) => {
    chrome.storage.sync.get(["arrowColor", "arrowOpacity", "moveDestColor", "highlightOverlayColor", "selectedSquareColor"], (data) => {
        const updatedColor = (changes.arrowColor && changes.arrowColor.newValue) || data.arrowColor || DEFAULT_COLOR;
        const updatedOpacity = (changes.arrowOpacity && changes.arrowOpacity.newValue !== undefined) 
            ? changes.arrowOpacity.newValue
            : (data.arrowOpacity !== undefined ? data.arrowOpacity : DEFAULT_OPACITY);
        const updatedMoveDestColor = (changes.moveDestColor && changes.moveDestColor.newValue) || data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
        const updatedHighlightOverlayColor = (changes.highlightOverlayColor && changes.highlightOverlayColor.newValue) || data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
        const updatedSelectedSquareColor = (changes.selectedSquareColor && changes.selectedSquareColor.newValue) || data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

        injectDynamicCSS(updatedColor, updatedOpacity, updatedMoveDestColor, updatedHighlightOverlayColor, updatedSelectedSquareColor);
    });
});

// Inject CSS into page
const injectDynamicCSS = (color, opacity, moveDestColor, highlightOverlayColor, selectedSquareColor) => {
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
            background: radial-gradient(${hexToRgba(moveDestColor, 0.5)} 19%, rgba(0, 0, 0, 0) 20%) !important;
        }
        square.selected {
            background-color: ${hexToRgba(selectedSquareColor, 0.5)} !important;
        }
        square.premove-dest {
            background: radial-gradient(${hexToRgba(moveDestColor, 0.5)} 19%, rgba(0, 0, 0, 0) 20%) !important;
        }
        .highlight-overlay {
            border: none;
            background-color: ${highlightOverlayColor};
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



const isKnightOnSquare = (square) => {
    const board = document.querySelector("cg-board");
    if (!board) return false;

    const squareIndex = square.row * 8 + square.col; // Calculate index based on row and column
    const pieces = board.querySelectorAll("piece");

    // Find the piece on the given square
    const piece = Array.from(pieces).find((p) => {
        const transform = p.style.transform;
        const matches = transform.match(/translate\((\d+)px, (\d+)px\)/);
        if (!matches) return false;

        const pieceX = parseInt(matches[1], 10);
        const pieceY = parseInt(matches[2], 10);

        const squareX = square.col * (board.getBoundingClientRect().width / 8);
        const squareY = square.row * (board.getBoundingClientRect().height / 8);

        return pieceX === squareX && pieceY === squareY;
    });

    // Check if the piece is a knight
    return piece && piece.classList.contains("knight");
};



const drawKnightArrow = (startSquare, endSquare, color = DEFAULT_COLOR) => {
    const board = document.querySelector("cg-board");
    if (!board) {
        console.error("Chessboard not found.");
        return;
    }

    const container = board.parentElement.querySelector(".cg-shapes g");
    if (!container) {
        console.error(".cg-shapes g container not found.");
        return;
    }

    // Normalize the row and column to SVG coordinates (-4 to 4)
    const normalizeCoord = (index) => index - 3.5;

    const startX = normalizeCoord(startSquare.col);
    const startY = normalizeCoord(startSquare.row); 
    const endX = normalizeCoord(endSquare.col);
    const endY = normalizeCoord(endSquare.row);

    // Determine intermediate point for L-shape
    let midX, midY;
    if (Math.abs(startSquare.row - endSquare.row) === 2) {
        midX = startX;
        midY = endY;
    } else {
        midX = endX;
        midY = startY;
    }



    const colToFile = (col) => String.fromCharCode(97 + col); // 'a' = 0, 'b' = 1, ...

    // Calculate start and end square labels (e.g., "b1")
    const startSquareLabel = `${colToFile(startSquare.col)}${8 - startSquare.row}`; // Flip row for correct chess rank
    const endSquareLabel = `${colToFile(endSquare.col)}${8 - endSquare.row}`; // Flip row for correct chess rank

    // Generate dynamic cgHash
    const cgHash = `712,712,${startSquareLabel},${endSquareLabel},green`;

    // Create a unique cgHash

    // Create the SVG container
    const svgNS = "http://www.w3.org/2000/svg";
    const arrowGroup = document.createElementNS(svgNS, "g");
    arrowGroup.setAttribute("cgHash", cgHash); // Add cgHash attribute
    arrowGroup.classList.add("knight-arrow");

    // Create the first segment
    const firstSegment = document.createElementNS(svgNS, "line");
    firstSegment.setAttribute("x1", startX);
    firstSegment.setAttribute("y1", startY);
    firstSegment.setAttribute("x2", midX);
    firstSegment.setAttribute("y2", midY);
    firstSegment.setAttribute("stroke", color);
    firstSegment.setAttribute("stroke-width", 0.15625); // Match default arrow width
    firstSegment.setAttribute("opacity", 1);
    firstSegment.setAttribute("marker-end", "none");

    // Create the second segment
    const secondSegment = document.createElementNS(svgNS, "line");
    secondSegment.setAttribute("x1", midX);
    secondSegment.setAttribute("y1", midY);
    secondSegment.setAttribute("x2", endX);
    secondSegment.setAttribute("y2", endY);
    secondSegment.setAttribute("stroke", color);
    secondSegment.setAttribute("stroke-width", 0.15625); // Match default arrow width
    secondSegment.setAttribute("opacity", 1);
    secondSegment.setAttribute("marker-end", "url(#arrowhead-g)");

    // Append segments to the group
    arrowGroup.appendChild(firstSegment);
    arrowGroup.appendChild(secondSegment);

    // Append the group to the `.cg-shapes g` container
    container.appendChild(arrowGroup);
    console.log('knight arrow:', arrowGroup);
    console.log("container: ", container);
};


