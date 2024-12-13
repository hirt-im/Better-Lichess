const DEFAULT_COLOR = "#f2c218";
const DEFAULT_OPACITY = 1.0;
const DEFAULT_MOVE_DEST_COLOR = "#4d4d4d"; 
const DEFAULT_HIGHLIGHT_OVERLAY_COLOR = "#eb6150"; 
const DEFAULT_SELECTED_COLOR = "#99d8ff"; 

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

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = extensionMenu.contains(event.target);
        const isClickOnButton = extensionBtn.contains(event.target);
    
        // If the click is outside the menu and not on the button, hide the menu
        if (!isClickInsideMenu && !isClickOnButton) {
            extensionMenu.style.display = 'none';
        }
    });

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





const removeArrowFromStartSquare = (startSquare) => {
    console.log('removing arrows except knight-arrow');
    const board = document.querySelector("cg-board");
    console.log('board', board);
    const container = board?.parentElement.querySelector(".cg-shapes g");
    if (!container) return;

    const normalizeCoord = (index) => isOrientationBlack() ? 3.5 - index : index - 3.5;

    const startX = normalizeCoord(startSquare.col);
    const startY = normalizeCoord(startSquare.row);

    // Find and remove the arrow that starts from the specified square
    container.querySelectorAll("line").forEach((line) => {
        const parentGroup = line.closest("g"); // Get the parent group of the line
        if (parentGroup?.classList.contains("knight-arrow")) {
            console.log("Skipping knight-arrow:", line);
            return; // Skip lines that belong to a knight-arrow
        }

        const lineStartX = parseFloat(line.getAttribute("x1"));
        const lineStartY = parseFloat(line.getAttribute("y1"));

        // Check if the line starts from the specified square
        if (lineStartX === startX && lineStartY === startY) {
            console.log("Removing default arrow:", line);
            line.remove();
        }
    });

    console.log('finished removing arrows');
};


// Square highlighting 
let dragStartSquare = null; // Track the square where the drag started
const enableSquareHighlighting = () => {
    let isRightMouseDown = false; // Track the state of the right mouse button

    document.addEventListener("pointerdown", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 2) { // Right mouse button
            isRightMouseDown = true; // Set the flag to true
            dragStartSquare = getSquareFromEvent(event); // Record the starting square
            console.log("Drag start square:", dragStartSquare);
        }
    });

    document.addEventListener("mousemove", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (isRightMouseDown && dragStartSquare && isKnightOnSquare(dragStartSquare)){
            console.log('puzzle test')

        }

        if (isRightMouseDown && dragStartSquare) {
            console.log('puzzle drawing valid knight');
            const currentSquare = getSquareFromEvent(event); // Track the square under the mouse

            const rowDifference = Math.abs(dragStartSquare.row - currentSquare.row);
            const colDifference = Math.abs(dragStartSquare.col - currentSquare.col);

            const isValidKnightMove =
                (rowDifference === 2 && colDifference === 1) ||
                (rowDifference === 1 && colDifference === 2);

            if (isValidKnightMove){
                console.log("Drawing knight arrow dynamically");
                removeArrowFromStartSquare(dragStartSquare);
                drawKnightArrow(dragStartSquare, currentSquare); 
            }
        }
    });

    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        const endSquare = getSquareFromEvent(event); // Get the square where the drag ended
        console.log('dragstart', dragStartSquare);
        if (isRightMouseDown && dragStartSquare) {
            const rowDifference = Math.abs(dragStartSquare.row - endSquare.row);
            const colDifference = Math.abs(dragStartSquare.col - endSquare.col);

            const isValidKnightMove =
                (rowDifference === 2 && colDifference === 1) ||
                (rowDifference === 1 && colDifference === 2);

            if (event.button === 2 && isKnightOnSquare(dragStartSquare)){
                console.log('test1');
            }

            if (
                event.button === 2 && // Right mouse button
                isKnightOnSquare(dragStartSquare) && // Check if a knight is on the start square
                isValidKnightMove // Ensure the move is valid for a knight
            ) {
                console.log("Drawing knight arrow on mouseup");
                drawKnightArrow(dragStartSquare, endSquare);
            }
        }

        if (event.button === 2) {
            console.log("End drag:", dragStartSquare, endSquare);

            // Highlight the square if the drag ended on the same square
            if (
                dragStartSquare.row === endSquare.row &&
                dragStartSquare.col === endSquare.col
            ) {
                toggleSquareHighlight(event);
            }
        }
    

        // Reset drag state when the right mouse button is released
        if (event.button === 2) {
            isRightMouseDown = false;
            dragStartSquare = null;
        }
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


const isOrientationBlack = () => {
    const boardContainer = document.querySelector(".cg-wrap");
    return boardContainer?.classList.contains("orientation-black");
};

const getSquareFromEvent = (event) => {
    const board = document.querySelector("cg-board");
    if (!board) return null;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position relative to the board
    const y = event.clientY - rect.top;  // Y position relative to the board

    const squareSize = rect.width / 8; // Assuming an 8x8 grid
    let col = Math.floor(x / squareSize);
    let row = Math.floor(y / squareSize);

    if (isOrientationBlack()) {
        // Flip row and column for black orientation
        row = 7 - row;
        col = 7 - col;
    }

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
        .cg-shapes g circle {
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
    // Select all cg-board elements to ensure the correct board is targeted
    const boards = document.querySelectorAll("cg-board");
    if (boards.length === 0) {
        console.warn("No cg-board elements found.");
        return false;
    }

    // Iterate through each board to find the knight
    for (const board of boards) {
        // Determine board orientation
        const boardContainer = board.closest(".cg-wrap");
        const isBlackOrientation = boardContainer?.classList.contains("orientation-black") || false;

        // Select all pieces that include 'knight' in their class list
        const knightPieces = board.querySelectorAll("piece[class*='knight']");
        if (knightPieces.length === 0) {
            console.warn("No knight pieces found on this board.");
            continue; // Move to the next board if no knights are present
        }

        // Get board dimensions
        const boardRect = board.getBoundingClientRect();
        const squareWidth = boardRect.width / 8;
        const squareHeight = boardRect.height / 8;

        // Define a threshold for approximate matching (e.g., ±5px)
        const threshold = 5;

        // Calculate expected square position based on orientation
        let expectedX = square.col * squareWidth;
        let expectedY = square.row * squareHeight;

        if (isBlackOrientation) {
            // Flip coordinates for black orientation
            expectedX = (7 - square.col) * squareWidth;
            expectedY = (7 - square.row) * squareHeight;
        }

        // Iterate through all knight pieces to find a match
        for (const piece of knightPieces) {
            const transform = piece.style.transform;
            if (!transform) {
                console.warn("Knight piece without transform style:", piece);
                continue;
            }

            // Match translate(xpx, ypx) with possible decimal values and optional spaces
            const matches = transform.match(/translate\(([\d.]+)px,\s*([\d.]+)px\)/);
            if (!matches) {
                console.warn("Transform style does not match expected format:", transform);
                continue;
            }

            const pieceX = parseFloat(matches[1]);
            const pieceY = parseFloat(matches[2]);

            // Check if the piece is within the threshold of the expected square
            const xMatch = Math.abs(pieceX - expectedX) <= threshold;
            const yMatch = Math.abs(pieceY - expectedY) <= threshold;

            // Debug logs for verification
            console.log(`Checking piece at (${pieceX}, ${pieceY}) against expected (${expectedX}, ${expectedY})`);
            console.log(`X Match: ${xMatch}, Y Match: ${yMatch}`);

            if (xMatch && yMatch) {
                console.log("Knight found on the specified square.");
                return true;
            }
        }
    }

    console.log("No knight found on the specified square.");
    return false;
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
    const normalizeCoord = (index) => isOrientationBlack() ? 3.5 - index : index - 3.5;

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
    firstSegment.classList.add("knight-line");
    firstSegment.setAttribute("x1", startX);
    firstSegment.setAttribute("y1", startY);
    firstSegment.setAttribute("x2", midX);
    firstSegment.setAttribute("y2", midY);
    firstSegment.setAttribute("stroke", color);
    firstSegment.setAttribute("stroke-width", 0.15625); // Match default arrow width
    firstSegment.setAttribute("opacity", 1);
    firstSegment.setAttribute("marker-end", "none");
    firstSegment.setAttribute("stroke-linecap", "square");

    // Create the second segment
    const secondSegment = document.createElementNS(svgNS, "line");
    secondSegment.classList.add("knight-line");
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

