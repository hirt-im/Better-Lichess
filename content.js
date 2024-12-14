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
        if (opacityValueDisplay) {
            opacityValueDisplay.textContent = parseFloat(savedOpacity).toFixed(2);
        }
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
            if (opacityValueDisplay) {
                opacityValueDisplay.textContent = DEFAULT_OPACITY.toFixed(2);
            }
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


// Utility functions
const isOrientationBlack = () => {
    const boardContainer = document.querySelector(".cg-wrap");
    return boardContainer?.classList.contains("orientation-black");
};

const getSquareFromEvent = (event) => {
    const board = document.querySelector("cg-board");
    if (!board) return null;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;  
    const squareSize = rect.width / 8;
    let col = Math.floor(x / squareSize);
    let row = Math.floor(y / squareSize);

    if (isOrientationBlack()) {
        row = 7 - row;
        col = 7 - col;
    }

    return { row, col };
};

const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const isKnightOnSquare = (square) => {
    const boards = document.querySelectorAll("cg-board");
    if (boards.length === 0) {
        console.warn("No cg-board elements found.");
        return false;
    }

    for (const board of boards) {
        const boardContainer = board.closest(".cg-wrap");
        const isBlackOrientation = boardContainer?.classList.contains("orientation-black") || false;
        const knightPieces = board.querySelectorAll("piece[class*='knight']");

        if (knightPieces.length === 0) continue;

        const boardRect = board.getBoundingClientRect();
        const squareWidth = boardRect.width / 8;
        const squareHeight = boardRect.height / 8;
        const threshold = 5;
        
        let expectedX = square.col * squareWidth;
        let expectedY = square.row * squareHeight;

        if (isBlackOrientation) {
            expectedX = (7 - square.col) * squareWidth;
            expectedY = (7 - square.row) * squareHeight;
        }

        for (const piece of knightPieces) {
            const transform = piece.style.transform;
            if (!transform) continue;
            const matches = transform.match(/translate\\(([\d.]+)px,\\s*([\d.]+)px\\)/);
            if (!matches) continue;

            const pieceX = parseFloat(matches[1]);
            const pieceY = parseFloat(matches[2]);

            const xMatch = Math.abs(pieceX - expectedX) <= threshold;
            const yMatch = Math.abs(pieceY - expectedY) <= threshold;

            if (xMatch && yMatch) {
                return true;
            }
        }
    }

    return false;
};

const drawKnightArrowSegments = (startSquare, endSquare, color, container) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const normalizeCoord = (index) => isOrientationBlack() ? 3.5 - index : index - 3.5;
    const startX = normalizeCoord(startSquare.col);
    const startY = normalizeCoord(startSquare.row); 
    const endX = normalizeCoord(endSquare.col);
    const endY = normalizeCoord(endSquare.row);

    let midX, midY;
    if (Math.abs(startSquare.row - endSquare.row) === 2) {
        midX = startX;
        midY = endY;
    } else {
        midX = endX;
        midY = startY;
    }

    const arrowGroup = document.createElementNS(svgNS, "g");
    arrowGroup.classList.add("knight-arrow");

    const firstSegment = document.createElementNS(svgNS, "line");
    firstSegment.setAttribute("x1", startX);
    firstSegment.setAttribute("y1", startY);
    firstSegment.setAttribute("x2", midX);
    firstSegment.setAttribute("y2", midY);
    firstSegment.setAttribute("stroke", color);
    firstSegment.setAttribute("stroke-width", 0.14625);
    firstSegment.setAttribute("marker-end", "none");
    firstSegment.setAttribute("stroke-linecap", "square");

    const secondSegment = document.createElementNS(svgNS, "line");
    secondSegment.setAttribute("x1", midX);
    secondSegment.setAttribute("y1", midY);
    secondSegment.setAttribute("x2", endX);
    secondSegment.setAttribute("y2", endY);
    secondSegment.setAttribute("stroke", color);
    secondSegment.setAttribute("stroke-width", 0.14625);
    secondSegment.setAttribute("marker-end", "url(#arrowhead-g)");

    arrowGroup.appendChild(firstSegment);
    arrowGroup.appendChild(secondSegment);
    container.appendChild(arrowGroup);

    return arrowGroup;
};

const drawStraightArrow = (startSquare, endSquare, color, container) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const normalizeCoord = (index) => isOrientationBlack() ? 3.5 - index : index - 3.5;
    const startX = normalizeCoord(startSquare.col);
    const startY = normalizeCoord(startSquare.row); 
    const endX = normalizeCoord(endSquare.col);
    const endY = normalizeCoord(endSquare.row);

    const arrowGroup = document.createElementNS(svgNS, "g");
    arrowGroup.classList.add("straight-arrow");

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", 0.15625);
    line.setAttribute("marker-end", "url(#arrowhead-g)");
    line.setAttribute("stroke-linecap", "butt");

    arrowGroup.appendChild(line);
    container.appendChild(arrowGroup);
    return arrowGroup;
};

chrome.storage.sync.get(["arrowColor", "arrowOpacity", "moveDestColor", "highlightOverlayColor", "selectedSquareColor"], (data) => {
    const savedColor = data.arrowColor || DEFAULT_COLOR;
    const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : DEFAULT_OPACITY;
    const savedMoveDestColor = data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
    const savedHighlightOverlayColor = data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
    const savedSelectedSquareColor = data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

    injectDynamicCSS(savedColor, savedOpacity, savedMoveDestColor, savedHighlightOverlayColor, savedSelectedSquareColor);

    enableSquareHighlighting(); 
    setupArrowDrawing();
});

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
            pointer-events: none; 
            position: absolute;
            z-index: 1;
        }
        cg-container .cg-shapes {
            opacity: ${opacity} !important;
        }
        input::-webkit-color-swatch {
            border: none;
        }
        .cg-shapes g line {
            visibility: hidden;
        }
    `;

    const style = document.createElement("style");
    style.id = "dynamicArrowStyles";
    style.textContent = css;

    document.head.appendChild(style);
};

const toggleSquareHighlight = (event) => {
    const board = document.querySelector("cg-board");
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;  
    const squareSize = rect.width / 8; 
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    const transform = `translate(${col * squareSize}px, ${row * squareSize}px)`;
    const highlightClass = "highlight-overlay";

    const existingHighlight = Array.from(board.querySelectorAll(`.${highlightClass}`)).find(
        (highlight) => highlight.style.transform === transform
    );

    if (existingHighlight) {
        existingHighlight.remove();
    } else {
        const highlight = document.createElement("div");
        highlight.classList.add(highlightClass);
        highlight.style.width = `${squareSize}px`;
        highlight.style.height = `${squareSize}px`;
        highlight.style.transform = transform;
        board.appendChild(highlight);
    }
};

let dragStartSquare = null; 
let isRightMouseDown = false; 
let currentArrowGroup = null; 
let customArrowsContainer = null;
let currentCustomArrowContainer = null;
let lastEndSquare = null; 

const setupArrowContainers = () => {
    const board = document.querySelector("cg-board");
    if (!board) return;

    const cgContainer = board.closest("cg-container");
    if (!cgContainer) return;

    // Create arrow overlay if not present
    let arrowOverlay = cgContainer.querySelector(".arrow-overlay");
    if (!arrowOverlay) {
        arrowOverlay = document.createElement('div');
        arrowOverlay.className = 'arrow-overlay';
        arrowOverlay.style.position = 'absolute';
        arrowOverlay.style.top = '0';
        arrowOverlay.style.left = '0';
        arrowOverlay.style.width = '100%';
        arrowOverlay.style.height = '100%';
        arrowOverlay.style.pointerEvents = 'none';
        arrowOverlay.style.zIndex = '9999'; // ensures it's above pieces
        cgContainer.appendChild(arrowOverlay);
    }

    // Create defs if not present
    let defs = cgContainer.querySelector("defs#arrowheads");
    if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.setAttribute("id", "arrowheads");

        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead-g");
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerWidth", "4");
        marker.setAttribute("markerHeight", "4");
        marker.setAttribute("refX", "2.05");
        marker.setAttribute("refY", "2");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M0,0 V4 L3,2 Z");
        marker.appendChild(path);

        defs.appendChild(marker);
        cgContainer.appendChild(defs);
    }

    // Create or select the custom arrows containers
    if (!arrowOverlay.querySelector(".custom-arrows")) {
        // Custom Arrows Container
        customArrowsContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        customArrowsContainer.setAttribute("class", "custom-arrows");
        customArrowsContainer.setAttribute("viewBox", "-4 -4 8 8");
        customArrowsContainer.setAttribute("preserveAspectRatio", "xMidYMid slice");
        // Absolute positioning to overlay on top of the board
        customArrowsContainer.style.position = "absolute";
        customArrowsContainer.style.top = "0";
        customArrowsContainer.style.left = "0";
        customArrowsContainer.style.width = "100%";
        customArrowsContainer.style.height = "100%";
        customArrowsContainer.style.pointerEvents = "none";
        arrowOverlay.appendChild(customArrowsContainer);

        // Current Custom Arrow Container
        currentCustomArrowContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        currentCustomArrowContainer.setAttribute("class", "current-custom-arrow");
        currentCustomArrowContainer.setAttribute("viewBox", "-4 -4 8 8");
        currentCustomArrowContainer.setAttribute("preserveAspectRatio", "xMidYMid slice");
        currentCustomArrowContainer.style.position = "absolute";
        currentCustomArrowContainer.style.top = "0";
        currentCustomArrowContainer.style.left = "0";
        currentCustomArrowContainer.style.width = "100%";
        currentCustomArrowContainer.style.height = "100%";
        currentCustomArrowContainer.style.pointerEvents = "none";

        // Append after customArrowsContainer so it stacks above it
        arrowOverlay.appendChild(currentCustomArrowContainer);
    } else {
        customArrowsContainer = arrowOverlay.querySelector(".custom-arrows");
        currentCustomArrowContainer = arrowOverlay.querySelector(".current-custom-arrow");
        // Ensure they have proper absolute positioning
        customArrowsContainer.style.position = "absolute";
        customArrowsContainer.style.top = "0";
        customArrowsContainer.style.left = "0";

        currentCustomArrowContainer.style.position = "absolute";
        currentCustomArrowContainer.style.top = "0";
        currentCustomArrowContainer.style.left = "0";
    }
};

const setupArrowDrawing = () => {
    setupArrowContainers();

    document.addEventListener("pointerdown", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 2) { 
            isRightMouseDown = true; 
            dragStartSquare = getSquareFromEvent(event);
            lastEndSquare = null;
            if (currentCustomArrowContainer) {
                currentCustomArrowContainer.innerHTML = "";
            }
        }
    });

    document.addEventListener("mousemove", (event) => {
        if(!isRightMouseDown){return;}
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (isRightMouseDown && dragStartSquare) {
            const currentSquare = getSquareFromEvent(event); 
            if (!currentSquare) return;
            if (currentSquare.row === dragStartSquare.row && currentSquare.col === dragStartSquare.col) {
                currentCustomArrowContainer.innerHTML = "";
                return;
            }

            // If the mouse moved to a new square, redraw the arrow
            if (!lastEndSquare || lastEndSquare.row !== currentSquare.row || lastEndSquare.col !== currentSquare.col) {
                lastEndSquare = currentSquare;

                const rowDifference = Math.abs(dragStartSquare.row - currentSquare.row);
                const colDifference = Math.abs(dragStartSquare.col - currentSquare.col);
                const isValidKnightMove =
                    (rowDifference === 2 && colDifference === 1) ||
                    (rowDifference === 1 && colDifference === 2);

                currentCustomArrowContainer.innerHTML = "";

                chrome.storage.sync.get(["arrowColor"], (data) => {
                    const color = data.arrowColor || DEFAULT_COLOR;

                    if (isValidKnightMove) {
                        drawKnightArrowSegments(dragStartSquare, currentSquare, color, currentCustomArrowContainer);
                    } else {
                        drawStraightArrow(dragStartSquare, currentSquare, color, currentCustomArrowContainer);
                    }
                });
            }
            // If same square, do nothing, arrow remains visible
        }
    });

    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 2 && dragStartSquare) {
            chrome.storage.sync.get(["arrowColor"], (data) => {
                const color = data.arrowColor || DEFAULT_COLOR;
                // On mouseup, finalize arrow
                if (currentCustomArrowContainer && currentCustomArrowContainer.firstChild) {
                    const clones = [...currentCustomArrowContainer.childNodes].map(node => node.cloneNode(true));
                    clones.forEach(clone => customArrowsContainer.appendChild(clone));
                    currentCustomArrowContainer.innerHTML = "";
                }
            });
        }

        if (event.button === 2) {
            isRightMouseDown = false;
            dragStartSquare = null;
            lastEndSquare = null;
        }
    });

    document.addEventListener("click", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 0 && customArrowsContainer && currentCustomArrowContainer) {
            customArrowsContainer.innerHTML = "";
            currentCustomArrowContainer.innerHTML = "";
        }

        board.querySelectorAll(".highlight-overlay").forEach((highlight) => highlight.remove());
    });

    document.addEventListener("contextmenu", (event) => {
        const board = document.querySelector("cg-board");
        if (board && board.contains(event.target)) {
            event.preventDefault();
        }
    });
};

const enableSquareHighlighting = () => {
    let wasRightMouseDown = false;
    let startSquareHighlight = null;

    document.addEventListener("pointerdown", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 2) {
            wasRightMouseDown = true;
            startSquareHighlight = getSquareFromEvent(event);
        }
    });

    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 2 && wasRightMouseDown) {
            const endSquareHighlight = getSquareFromEvent(event);
            if (endSquareHighlight && startSquareHighlight &&
                endSquareHighlight.row === startSquareHighlight.row &&
                endSquareHighlight.col === startSquareHighlight.col) {
                toggleSquareHighlight(event);
            }
        }

        if (event.button === 2) {
            wasRightMouseDown = false;
            startSquareHighlight = null;
        }
    });
};
