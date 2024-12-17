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
    // NEW: Add data attributes to identify this arrow
    arrowGroup.setAttribute('data-start', `${startSquare.row},${startSquare.col}`);
    arrowGroup.setAttribute('data-end', `${endSquare.row},${endSquare.col}`);

    const firstSegment = document.createElementNS(svgNS, "line");
    firstSegment.setAttribute("x1", startX);
    firstSegment.setAttribute("y1", startY);
    firstSegment.setAttribute("x2", midX);
    firstSegment.setAttribute("y2", midY);
    firstSegment.setAttribute("stroke", color);
    firstSegment.setAttribute("stroke-width", 0.165);
    firstSegment.setAttribute("stroke-linecap", "square");

    const secondSegment = document.createElementNS(svgNS, "line");
    secondSegment.setAttribute("x1", midX);
    secondSegment.setAttribute("y1", midY);
    secondSegment.setAttribute("x2", endX);
    secondSegment.setAttribute("y2", endY);
    secondSegment.setAttribute("stroke", color);
    secondSegment.setAttribute("stroke-width", 0.165);
    secondSegment.setAttribute("marker-end", "url(#custom)");

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
    // NEW: Add data attributes to identify this arrow
    arrowGroup.setAttribute('data-start', `${startSquare.row},${startSquare.col}`);
    arrowGroup.setAttribute('data-end', `${endSquare.row},${endSquare.col}`);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", 0.15625);
    line.setAttribute("marker-end", "url(#custom)");
    line.setAttribute("stroke-linecap", "square");

    arrowGroup.appendChild(line);
    container.appendChild(arrowGroup);
    return arrowGroup;
};

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

        .arrow-overlay{
            opacity: ${opacity} !important;
        }
        
        input::-webkit-color-swatch {
            border: none;
        }
        .cg-shapes g line {
            visibility: hidden !important;
        }

        .cg-shapes g[cgHash*="paleBlue"] line {
            visibility: visible !important;
        }

        .cg-shapes g[cgHash*="paleBlue"] line {
            stroke: ${selectedSquareColor} !important;
            fill: ${selectedSquareColor} !important;
        }

        marker#arrowhead-pb path {
            fill: ${selectedSquareColor} !important;
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
        // path.setAttribute("d", "M0,0 V4 L3,2 Z");
        path.setAttribute("d", "M0,0 V4 L3.5,2 Z");
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


let dragStartSquare = null; 
let isRightMouseDown = false; 
let currentArrowGroup = null; 
let customArrowsContainer = null;
let currentCustomArrowContainer = null;
let lastEndSquare = null; 
let firstSegment = null; 
let secondSegment = null; 
let isKnightArrow = false;
let wasKnightArrow = null; // track previous state

function createArrowElements(isKnight, color) {
    const svgNS = "http://www.w3.org/2000/svg";

    // Clear existing lines
    if (currentArrowGroup) {
        currentArrowGroup.innerHTML = "";
    }

    if (isKnight) {
        // Knight arrow has two segments
        firstSegment = document.createElementNS(svgNS, "line");
        secondSegment = document.createElementNS(svgNS, "line");

        firstSegment.setAttribute("stroke-width", 0.165);
        secondSegment.setAttribute("stroke-width", 0.165);
        secondSegment.setAttribute("marker-end", "url(#custom)");
        firstSegment.setAttribute("stroke", color);
        firstSegment.setAttribute("stroke-linecap", 'square');
        secondSegment.setAttribute("stroke", color);
        secondSegment.setAttribute("stroke-linecap", 'square');

        currentArrowGroup.appendChild(firstSegment);
        currentArrowGroup.appendChild(secondSegment);
    } else {
        // Straight arrow has one segment
        firstSegment = document.createElementNS(svgNS, "line");
        firstSegment.setAttribute("stroke-width", 0.165);
        firstSegment.setAttribute("marker-end", "url(#custom)");
        firstSegment.setAttribute("stroke-linecap", 'square');
        firstSegment.setAttribute("stroke", color);

        currentArrowGroup.appendChild(firstSegment);
    }
}

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
                currentArrowGroup = null;
                firstSegment = null;
                secondSegment = null;
            }
        }
    });

    document.addEventListener("mousemove", (event) => {
        if (!isRightMouseDown || !dragStartSquare) return;
    
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;
    
        const currentSquare = getSquareFromEvent(event);
        if (!currentSquare) return;
    
        // Check if the current square is the same as the starting square
        if (currentSquare.row === dragStartSquare.row && currentSquare.col === dragStartSquare.col) {
            if (currentArrowGroup) {
                currentArrowGroup.remove(); // Remove the arrow if the end square is the same as the start square
                currentArrowGroup = null;
            }
            return; // Stop here, no arrow needs to be drawn
        }
    
        // If mouse moved to a new square, update or draw the arrow
        if (!lastEndSquare || lastEndSquare.row !== currentSquare.row || lastEndSquare.col !== currentSquare.col) {
            lastEndSquare = currentSquare;
    
            const rowDifference = Math.abs(dragStartSquare.row - currentSquare.row);
            const colDifference = Math.abs(dragStartSquare.col - currentSquare.col);
            isKnightArrow =
                (rowDifference === 2 && colDifference === 1) ||
                (rowDifference === 1 && colDifference === 2);
    
            chrome.storage.sync.get(["arrowColor"], (data) => {
                const color = data.arrowColor || DEFAULT_COLOR;
    
                if (!currentArrowGroup) {
                    const svgNS = "http://www.w3.org/2000/svg";
                    currentArrowGroup = document.createElementNS(svgNS, "g");
                    currentArrowGroup.classList.add(isKnightArrow ? "knight-arrow" : "straight-arrow");
                    currentArrowGroup.setAttribute('data-start', `${dragStartSquare.row},${dragStartSquare.col}`);
                    currentCustomArrowContainer.appendChild(currentArrowGroup);
                    createArrowElements(isKnightArrow, color);
                    wasKnightArrow = isKnightArrow;
                } else if (wasKnightArrow !== isKnightArrow) {
                    currentArrowGroup.classList.remove("knight-arrow", "straight-arrow");
                    currentArrowGroup.classList.add(isKnightArrow ? "knight-arrow" : "straight-arrow");
                    createArrowElements(isKnightArrow, color);
                    wasKnightArrow = isKnightArrow;
                }
    
                // Update arrow coordinates
                const normalizeCoord = (index) => isOrientationBlack() ? 3.5 - index : index - 3.5;
                const startX = normalizeCoord(dragStartSquare.col);
                const startY = normalizeCoord(dragStartSquare.row); 
                const endX = normalizeCoord(currentSquare.col);
                const endY = normalizeCoord(currentSquare.row);
    
                if (isKnightArrow && firstSegment && secondSegment) {
                    let midX, midY;
                    if (Math.abs(dragStartSquare.row - currentSquare.row) === 2) {
                        midX = startX;
                        midY = endY;
                    } else {
                        midX = endX;
                        midY = startY;
                    }
    
                    firstSegment.setAttribute("x1", startX);
                    firstSegment.setAttribute("y1", startY);
                    firstSegment.setAttribute("x2", midX);
                    firstSegment.setAttribute("y2", midY);
    
                    secondSegment.setAttribute("x1", midX);
                    secondSegment.setAttribute("y1", midY);
                    secondSegment.setAttribute("x2", endX);
                    secondSegment.setAttribute("y2", endY);
    
                    currentArrowGroup.setAttribute('data-end', `${currentSquare.row},${currentSquare.col}`);
                } else if (!isKnightArrow && firstSegment) {
                    firstSegment.setAttribute("x1", startX);
                    firstSegment.setAttribute("y1", startY);
                    firstSegment.setAttribute("x2", endX);
                    firstSegment.setAttribute("y2", endY);
    
                    currentArrowGroup.setAttribute('data-end', `${currentSquare.row},${currentSquare.col}`);
                }
            });
        }
    });
    
    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;
    
        if (event.button === 2 && dragStartSquare && currentArrowGroup) {
            chrome.storage.sync.get(["arrowColor"], (data) => {
                const start = currentArrowGroup.getAttribute('data-start');
                const end = currentArrowGroup.getAttribute('data-end');

                if (start && end) {
                    // Check if an arrow with the same start/end already exists
                    const existingArrow = customArrowsContainer.querySelector(`g[data-start="${start}"][data-end="${end}"]`);
                    if (existingArrow) {
                        // If found, remove it (erase the arrow)
                        existingArrow.remove();
                    } else {
                        // Otherwise, move the arrow from currentCustomArrowContainer to customArrowsContainer
                        const clone = currentArrowGroup.cloneNode(true);
                        customArrowsContainer.appendChild(clone);
                    }
                }

                // Clear current arrow
                if (currentCustomArrowContainer) {
                    currentCustomArrowContainer.innerHTML = "";
                }
                currentArrowGroup = null;
                firstSegment = null;
                secondSegment = null;
                wasKnightArrow = null;
            });
        }
    
        if (event.button === 2) {
            isRightMouseDown = false;
            dragStartSquare = null;
            lastEndSquare = null;
            isKnightArrow = false;
        }
    });

    document.addEventListener("click", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 0 && customArrowsContainer && currentCustomArrowContainer) {
            // Left-click clears arrows
            customArrowsContainer.innerHTML = "";
            currentCustomArrowContainer.innerHTML = "";
            currentArrowGroup = null;
            firstSegment = null;
            secondSegment = null;
            wasKnightArrow = null;
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

    // Use pointerup instead of mouseup for slightly faster response
    document.addEventListener("pointerup", (event) => {
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

function setCustomMarker() {
    // Ensure we are dealing with the correct namespace
    const svgNS = "http://www.w3.org/2000/svg";
    const svgElement = document.querySelector('.cg-shapes');
    // Locate or create a <defs> section in the SVG
    let defs = svgElement.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(svgNS, 'defs');
      svgElement.insertBefore(defs, svgElement.firstChild);
    }
  
    // Create a new <marker> element
    const marker = document.createElementNS(svgNS, 'marker');
    marker.setAttribute('id', 'custom');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('overflow', 'visible');
    marker.setAttribute('markerWidth', '4');
    marker.setAttribute('markerHeight', '4');
    marker.setAttribute('refX', '2.05');
    marker.setAttribute('refY', '2');
  
    // Create the <path> element for the marker shape
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M.3,0 V4 L3.3,2 Z');
    path.setAttribute('fill', arrowColor);
  
    // Append the path to the marker
    marker.appendChild(path);
  
    // Append the new marker to the <defs> section
    defs.appendChild(marker);
  }



// Re-append arrowContainer and customMarker when puzzle board re-renders
function setupBoardObserver() {
    const targetNode = document.querySelector('.puzzle.puzzle-play');
    if (!targetNode) return;

    const config = { childList: true, subtree: true };
    let isInitialized = false;

    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if cg-board or cg-container changed
                const cgContainer = document.querySelector('cg-container');
                if (cgContainer) {
                    const arrowOverlay = cgContainer.querySelector('.arrow-overlay');
                    if (!arrowOverlay) {
                        // Re-setup arrow containers and drawing
                        setupArrowContainers();
                        setCustomMarker();
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}



chrome.storage.sync.get(["arrowColor", "arrowOpacity", "moveDestColor", "highlightOverlayColor", "selectedSquareColor"], (data) => {
    const savedColor = data.arrowColor || DEFAULT_COLOR;
    const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : DEFAULT_OPACITY;
    const savedMoveDestColor = data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
    const savedHighlightOverlayColor = data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
    const savedSelectedSquareColor = data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

    injectDynamicCSS(savedColor, savedOpacity, savedMoveDestColor, savedHighlightOverlayColor, savedSelectedSquareColor);
    enableSquareHighlighting(); 
    setCustomMarker();
    setupArrowDrawing();
    setupBoardObserver();
});
