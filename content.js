// ================================
// Default Values
// ================================
const DEFAULT_COLOR = "#f2c218";
const DEFAULT_OPACITY = 1.0;
const DEFAULT_MOVE_DEST_COLOR = "#4d4d4d";
const DEFAULT_HIGHLIGHT_OVERLAY_COLOR = "#eb6150";
const DEFAULT_SELECTED_COLOR = "#99d8ff";

const DEFAULT_FREE_ARROWS = true;  // If free arrows is ON, no snapping

// We'll use a 20px threshold for knight squares:
const THRESHOLD_PX = 40; // Adjust as needed

// ================================
//  Extension button and menu
// ================================
const siteButtons = document.querySelector('.site-buttons');
if (siteButtons) {
    // Create the "Extension Settings" button
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
    extensionMenu.style.display = 'none';
    extensionMenu.style.position = 'absolute';
    extensionMenu.style.right = '20px';
    extensionMenu.style.top = '50px';
    extensionMenu.style.background = 'rgb(66 66 66)';
    extensionMenu.style.border = '1px solid #bababa';
    extensionMenu.style.borderRadius = '5px';
    extensionMenu.style.padding = '10px';
    extensionMenu.style.zIndex = '999999';
    extensionMenu.style.color = '#e3e3e3';

    // ================================
    //  Settings Menu HTML
    // ================================
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

        <!-- Knight Arrow Toggle -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="knightArrowToggle">Knight Arrows</label>
          <input type="checkbox" id="knightArrowToggle" />
        </div>

        <!-- Free Arrows Toggle -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label style="font: inherit; font-weight: bold;" for="freeArrowsToggle">Free Arrows</label>
          <input type="checkbox" id="freeArrowsToggle" />
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

    // Hide menu if user clicks outside
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = extensionMenu.contains(event.target);
        const isClickOnButton = extensionBtn.contains(event.target);
        if (!isClickInsideMenu && !isClickOnButton) {
            extensionMenu.style.display = 'none';
        }
    });

    // Toggle menu on click
    extensionBtn.addEventListener('click', () => {
        extensionMenu.style.display = (extensionMenu.style.display === 'none') ? 'block' : 'none';
    });

    // Grab references to the inputs
    const colorInput = extensionMenu.querySelector('#arrowColor');
    const moveDestColorInput = extensionMenu.querySelector('#moveDestColor');
    const highlightOverlayColorInput = extensionMenu.querySelector('#highlightOverlayColor');
    const selectedSquareColorInput = extensionMenu.querySelector('#selectedSquareColor');
    const opacitySlider = extensionMenu.querySelector('#arrowOpacity');
    const opacityValueDisplay = extensionMenu.querySelector('#opacityValue');
    const knightArrowToggle = extensionMenu.querySelector('#knightArrowToggle');
    const freeArrowsToggle = extensionMenu.querySelector('#freeArrowsToggle');

    const saveButton = extensionMenu.querySelector('#saveSettings');
    const resetButton = extensionMenu.querySelector('#resetDefaults');

    // ======================================
    // RETRIEVE SETTINGS
    // ======================================
    chrome.storage.sync.get([
        "arrowColor",
        "arrowOpacity",
        "moveDestColor",
        "highlightOverlayColor",
        "selectedSquareColor",
        "knightArrowEnabled",
        "freeArrowsEnabled"
    ], (data) => {
        const savedColor = data.arrowColor || DEFAULT_COLOR;
        const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : DEFAULT_OPACITY;
        const savedMoveDestColor = data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
        const savedHighlightOverlayColor = data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
        const savedSelectedSquareColor = data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

        let savedKnightArrowEnabled = data.knightArrowEnabled;
        if (savedKnightArrowEnabled === undefined) {
            savedKnightArrowEnabled = true; 
            chrome.storage.sync.set({ knightArrowEnabled: true });
        }

        let savedFreeArrowsEnabled = data.freeArrowsEnabled;
        if (savedFreeArrowsEnabled === undefined) {
            savedFreeArrowsEnabled = DEFAULT_FREE_ARROWS; 
            chrome.storage.sync.set({ freeArrowsEnabled: DEFAULT_FREE_ARROWS });
        }

        // Update UI
        colorInput.value = savedColor;
        moveDestColorInput.value = savedMoveDestColor;
        highlightOverlayColorInput.value = savedHighlightOverlayColor;
        selectedSquareColorInput.value = savedSelectedSquareColor;

        document.getElementById('arrowColorCircle').style.backgroundColor = savedColor;
        document.getElementById('moveDestColorCircle').style.backgroundColor = savedMoveDestColor;
        document.getElementById('highlightOverlayColorCircle').style.backgroundColor = savedHighlightOverlayColor;
        document.getElementById('selectedSquareColorCircle').style.backgroundColor = savedSelectedSquareColor;

        opacitySlider.value = savedOpacity;
        if (opacityValueDisplay) {
            opacityValueDisplay.textContent = parseFloat(savedOpacity).toFixed(2);
        }

        knightArrowToggle.checked = savedKnightArrowEnabled; 
        freeArrowsToggle.checked = savedFreeArrowsEnabled; 
    });

    // Show color pickers when circle is clicked
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

    // ================================
    // Save button logic
    // ================================
    saveButton.addEventListener("click", () => {
        const color = colorInput.value;
        const moveDestColor = moveDestColorInput.value;
        const highlightOverlayColor = highlightOverlayColorInput.value;
        const selectedSquareColor = selectedSquareColorInput.value;
        const opacity = parseFloat(opacitySlider.value);
        const knightArrowsEnabled = knightArrowToggle.checked;
        const freeArrowsEnabled = freeArrowsToggle.checked;

        chrome.storage.sync.set({ 
            arrowColor: color, 
            arrowOpacity: opacity, 
            moveDestColor: moveDestColor,
            highlightOverlayColor: highlightOverlayColor,
            selectedSquareColor: selectedSquareColor,
            knightArrowEnabled: knightArrowsEnabled,
            freeArrowsEnabled: freeArrowsEnabled
        });
    });

    // ================================
    // Reset button logic
    // ================================
    resetButton.addEventListener("click", () => {
        chrome.storage.sync.set({ 
            arrowColor: DEFAULT_COLOR, 
            arrowOpacity: DEFAULT_OPACITY, 
            moveDestColor: DEFAULT_MOVE_DEST_COLOR, 
            highlightOverlayColor: DEFAULT_HIGHLIGHT_OVERLAY_COLOR,
            selectedSquareColor: DEFAULT_SELECTED_COLOR,
            knightArrowEnabled: true,
            freeArrowsEnabled: DEFAULT_FREE_ARROWS
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

            knightArrowToggle.checked = true;
            freeArrowsToggle.checked = DEFAULT_FREE_ARROWS;
        });
    });
}

// ================================
//  Utility functions
// ================================
const isOrientationBlack = () => {
    const boardContainer = document.querySelector(".cg-wrap");
    return boardContainer?.classList.contains("orientation-black");
};

/**
 * Converts the mouse event into a (row, col) index, ignoring threshold,
 * plus minor clamp (0..7).
 */
const getSquareFromEvent = (event) => {
    const board = document.querySelector("cg-board");
    if (!board) return null;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;  
    const squareSize = rect.width / 8;
    let col = Math.floor(x / squareSize);
    let row = Math.floor(y / squareSize);

    // Basic clamp here, so we never exceed the board
    col = Math.max(0, Math.min(7, col));
    row = Math.max(0, Math.min(7, row));

    if (isOrientationBlack()) {
        row = 7 - row;
        col = 7 - col;
    }
    return { row, col };
};

/**
 * Returns a CSS rgba color string from a hex color + alpha
 */
const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Returns true if (r2,c2) is an EXACT knight move from (r1,c1).
 */
function isKnightMove(r1, c1, r2, c2) {
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    return (
        (rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2)
    );
}

// -------------------------------------------------------
// CLAMP HELPER
// -------------------------------------------------------
function clampCoord(value) {
    return Math.max(0, Math.min(7, value));
}

/**
 * If freeArrows is ON => no snapping (but still clamp).
 * If freeArrows is OFF => 
 *   1) Check which of 8 directions is closest in angle.
 *   2) For the chosen direction, compute a discrete step count so
 *      we only go to a "true" horizontal/vertical/diagonal square.
 *   3) Finally clamp row/col to [0..7].
 */
function snapDirection(r1, c1, r2, c2, freeArrows) {
    if (freeArrows) {
        // STILL clamp final row/col in freeArrows mode:
        return {
            row: clampCoord(r2),
            col: clampCoord(c2)
        };
    }

    const rowDiff = r2 - r1;
    const colDiff = c2 - c1;

    // If same square => no move
    if (rowDiff === 0 && colDiff === 0) {
        return { row: r1, col: c1 };
    }

    // We'll measure angle from the horizontal axis
    const angleRad = Math.atan2(rowDiff, colDiff);
    let angleDeg = angleRad * (180 / Math.PI);

    // 8 directions: -180, -135, -90, -45, 0, 45, 90, 135
    const directions = [-180, -135, -90, -45, 0, 45, 90, 135];
    let bestDir = 0;
    let bestDist = 999999;
    for (const d of directions) {
        let diff = Math.abs(angleDeg - d);
        if (diff > 180) diff = 360 - diff; // e.g. -179 vs 179
        if (diff < bestDist) {
            bestDist = diff;
            bestDir = d;
        }
    }

    // We'll decide step size based on the direction
    const absRow = Math.abs(rowDiff);
    const absCol = Math.abs(colDiff);

    // The sign for row & col
    const signRow = rowDiff >= 0 ? 1 : -1;
    const signCol = colDiff >= 0 ? 1 : -1;

    let finalRow = r1;
    let finalCol = c1;

    if (bestDir === 0 || bestDir === 180 || bestDir === -180) {
        // purely horizontal
        const steps = absCol; 
        finalRow = r1;
        finalCol = r1 === r1 ? c1 + steps * signCol : c1; 
    } else if (bestDir === 90 || bestDir === -90) {
        // purely vertical
        const steps = absRow; 
        finalRow = r1 + steps * signRow;
        finalCol = c1;
    } else {
        // "true diagonal": ±45°, ±135°
        // step = min(row distance, col distance)
        const steps = Math.min(absRow, absCol);
        finalRow = r1 + steps * signRow;
        finalCol = c1 + steps * signCol;
    }

    // clamp so we never go off-board
    finalRow = clampCoord(finalRow);
    finalCol = clampCoord(finalCol);

    return { row: finalRow, col: finalCol };
}

// ================================
//  Inject dynamic CSS
// ================================
const injectDynamicCSS = (
    color, 
    opacity, 
    moveDestColor, 
    highlightOverlayColor, 
    selectedSquareColor
) => {
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
        .arrow-overlay {
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

// ================================
//  Square highlighting
// ================================
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

    const existingHighlight = [...board.querySelectorAll(`.${highlightClass}`)].find(
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

// ================================
//  Arrow containers
// ================================
let customArrowsContainer = null;
let currentCustomArrowContainer = null;

const setupArrowContainers = () => {
    const board = document.querySelector("cg-board");
    if (!board) return;
    const cgContainer = board.closest("cg-container");
    if (!cgContainer) return;

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
        arrowOverlay.style.zIndex = '9999';
        cgContainer.appendChild(arrowOverlay);
    }

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
        path.setAttribute("d", "M0,0 V4 L3.5,2 Z");
        marker.appendChild(path);

        defs.appendChild(marker);
        cgContainer.appendChild(defs);
    }

    if (!arrowOverlay.querySelector(".custom-arrows")) {
        customArrowsContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        customArrowsContainer.setAttribute("class", "custom-arrows");
        customArrowsContainer.setAttribute("viewBox", "-4 -4 8 8");
        customArrowsContainer.setAttribute("preserveAspectRatio", "xMidYMid slice");
        customArrowsContainer.style.position = "absolute";
        customArrowsContainer.style.top = "0";
        customArrowsContainer.style.left = "0";
        customArrowsContainer.style.width = "100%";
        customArrowsContainer.style.height = "100%";
        customArrowsContainer.style.pointerEvents = "none";
        arrowOverlay.appendChild(customArrowsContainer);

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
        arrowOverlay.appendChild(currentCustomArrowContainer);
    } else {
        customArrowsContainer = arrowOverlay.querySelector(".custom-arrows");
        currentCustomArrowContainer = arrowOverlay.querySelector(".current-custom-arrow");
        customArrowsContainer.style.position = "absolute";
        customArrowsContainer.style.top = "0";
        customArrowsContainer.style.left = "0";
        currentCustomArrowContainer.style.position = "absolute";
        currentCustomArrowContainer.style.top = "0";
        currentCustomArrowContainer.style.left = "0";
    }
};

// ================================
//  Custom marker for arrows
// ================================
function setCustomMarker() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgElement = document.querySelector('.cg-shapes');
    if (!svgElement) return;

    let defs = svgElement.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(svgNS, 'defs');
        svgElement.insertBefore(defs, svgElement.firstChild);
    }
  
    const marker = document.createElementNS(svgNS, 'marker');
    marker.setAttribute('id', 'custom');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('overflow', 'visible');
    marker.setAttribute('markerWidth', '4');
    marker.setAttribute('markerHeight', '4');
    marker.setAttribute('refX', '2.05');
    marker.setAttribute('refY', '2');
  
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M.3,0 V4 L3.3,2 Z');
    path.setAttribute('fill', DEFAULT_COLOR);
    marker.appendChild(path);
    defs.appendChild(marker);
};

// -----------------------------------------------------------------------------
//  EXACT PIXEL-BASED THRESHOLD FOR KNIGHT SQUARE
// -----------------------------------------------------------------------------
/**
 * Return true if the mouse pointer is within `thresholdPx`
 * of the *center* of (row,col) in board coordinates.
 */
function isWithinSquareThreshold(event, row, col, thresholdPx = THRESHOLD_PX) {
    const board = document.querySelector("cg-board");
    if (!board) return false;

    const rect = board.getBoundingClientRect();
    const squareSize = rect.width / 8;

    // center of (row,col)
    let centerX = col * squareSize + squareSize / 2;
    let centerY = row * squareSize + squareSize / 2;

    // flip if black orientation
    if (isOrientationBlack()) {
        centerX = (7 - col) * squareSize + squareSize / 2;
        centerY = (7 - row) * squareSize + squareSize / 2;
    }

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    
    return (Math.abs(dx) <= thresholdPx && Math.abs(dy) <= thresholdPx);

}

/**
 * If you are "deep enough" inside one of the 8 knight squares 
 * from (startRow,startCol), returns that square. Otherwise null.
 */
function getKnightMoveSquareIfCloseEnough(event, startRow, startCol) {
    const candidates = [
        { row: startRow + 2, col: startCol + 1 },
        { row: startRow + 2, col: startCol - 1 },
        { row: startRow - 2, col: startCol + 1 },
        { row: startRow - 2, col: startCol - 1 },
        { row: startRow + 1, col: startCol + 2 },
        { row: startRow + 1, col: startCol - 2 },
        { row: startRow - 1, col: startCol + 2 },
        { row: startRow - 1, col: startCol - 2 },
    ];

    const onBoard = candidates.filter(
        sq => sq.row >= 0 && sq.row < 8 && sq.col >= 0 && sq.col < 8
    );

    for (const knightSq of onBoard) {
        if (isWithinSquareThreshold(event, knightSq.row, knightSq.col, THRESHOLD_PX)) {
            return knightSq;
        }
    }
    return null;
}

// ================================
//  Arrow drawing logic
// ================================
let dragStartSquare = null; 
let isRightMouseDown = false; 

// The in-progress arrow
let currentArrowGroup = null; 
let firstSegment = null; 
let secondSegment = null; 
let wasKnightArrow = null; 
let lastValidSquare = null; 

function createArrowElements(isKnight, color) {
    if (currentArrowGroup) {
        currentArrowGroup.innerHTML = "";
    }
    const svgNS = "http://www.w3.org/2000/svg";

    if (isKnight) {
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
        // Single line
        firstSegment = document.createElementNS(svgNS, "line");
        firstSegment.setAttribute("stroke-width", 0.165);
        firstSegment.setAttribute("marker-end", "url(#custom)");
        firstSegment.setAttribute("stroke-linecap", "square");
        firstSegment.setAttribute("stroke", color);
        currentArrowGroup.appendChild(firstSegment);
    }
}

function setupArrowDrawing() {
    setupArrowContainers();

    document.addEventListener("pointerdown", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 2) {
            isRightMouseDown = true;
            dragStartSquare = getSquareFromEvent(event);
            lastValidSquare = null;
            if (currentCustomArrowContainer) {
                currentCustomArrowContainer.innerHTML = "";
                currentArrowGroup = null;
                firstSegment = null;
                secondSegment = null;
                wasKnightArrow = null;
            }
        }
    });

    document.addEventListener("mousemove", (event) => {
        if (!isRightMouseDown || !dragStartSquare) return;
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        // 1) Check if we're "deep enough" inside a knight square
        const maybeKnightSquare = getKnightMoveSquareIfCloseEnough(
            event,
            dragStartSquare.row,
            dragStartSquare.col
        );

        let pointerSquare;
        if (maybeKnightSquare) {
            // If we found a knight square by threshold => forcibly use it
            pointerSquare = maybeKnightSquare;
        } else {
            // Otherwise, fallback to normal getSquareFromEvent
            const rawSq = getSquareFromEvent(event);
            if (!rawSq) return;
            pointerSquare = rawSq;
        }

        // If user drags onto the same square
        if (
            pointerSquare.row === dragStartSquare.row &&
            pointerSquare.col === dragStartSquare.col
        ) {
            if (currentArrowGroup) {
                currentArrowGroup.remove();
                currentArrowGroup = null;
            }
            lastValidSquare = null;
            return;
        }

        chrome.storage.sync.get(
            ["arrowColor", "knightArrowEnabled", "freeArrowsEnabled"],
            (data) => {
                const color = data.arrowColor || DEFAULT_COLOR;
                const knightArrowsEnabled = (data.knightArrowEnabled === undefined)
                    ? true
                    : data.knightArrowEnabled;
                const freeArrowsEnabled = (data.freeArrowsEnabled === undefined)
                    ? true
                    : data.freeArrowsEnabled;

                let snapped;
                if (maybeKnightSquare) {
                    // If threshold triggered a knight square, skip angle snapping
                    snapped = { row: pointerSquare.row, col: pointerSquare.col };
                } else {
                    snapped = snapDirection(
                        dragStartSquare.row,
                        dragStartSquare.col,
                        pointerSquare.row,
                        pointerSquare.col,
                        freeArrowsEnabled
                    );
                }

                // If the snapped square is the same as start => invalid
                if (
                    snapped.row === dragStartSquare.row &&
                    snapped.col === dragStartSquare.col
                ) {
                    if (!lastValidSquare && currentArrowGroup) {
                        currentArrowGroup.remove();
                        currentArrowGroup = null;
                    }
                    return;
                }

                const newSquare = { row: snapped.row, col: snapped.col };

                // If it's the same as last valid, do nothing
                if (
                    lastValidSquare &&
                    lastValidSquare.row === newSquare.row &&
                    lastValidSquare.col === newSquare.col
                ) {
                    return;
                }
                lastValidSquare = newSquare;

                // Decide if it is actually a knight arrow or single line
                const actuallyKnight = isKnightMove(
                    dragStartSquare.row,
                    dragStartSquare.col,
                    newSquare.row,
                    newSquare.col
                );
                const shouldDrawKnight = knightArrowsEnabled && actuallyKnight;

                // Create arrow group if needed
                if (!currentArrowGroup) {
                    const svgNS = "http://www.w3.org/2000/svg";
                    currentArrowGroup = document.createElementNS(svgNS, "g");
                    currentArrowGroup.classList.add(
                        shouldDrawKnight ? "knight-arrow" : "straight-arrow"
                    );
                    currentArrowGroup.setAttribute(
                        "data-start",
                        `${dragStartSquare.row},${dragStartSquare.col}`
                    );
                    currentCustomArrowContainer.appendChild(currentArrowGroup);
                    createArrowElements(shouldDrawKnight, color);
                    wasKnightArrow = shouldDrawKnight;
                } 
                else if (wasKnightArrow !== shouldDrawKnight) {
                    currentArrowGroup.classList.remove("knight-arrow", "straight-arrow");
                    currentArrowGroup.classList.add(
                        shouldDrawKnight ? "knight-arrow" : "straight-arrow"
                    );
                    createArrowElements(shouldDrawKnight, color);
                    wasKnightArrow = shouldDrawKnight;
                }

                // Now set line coordinates in the SVG
                const normalizeCoord = (idx) =>
                    isOrientationBlack() ? 3.5 - idx : idx - 3.5;
                const startX = normalizeCoord(dragStartSquare.col);
                const startY = normalizeCoord(dragStartSquare.row);
                const endX = normalizeCoord(newSquare.col);
                const endY = normalizeCoord(newSquare.row);

                if (shouldDrawKnight && firstSegment && secondSegment) {
                    // L-shape with two segments
                    if (Math.abs(dragStartSquare.row - newSquare.row) === 2) {
                        // vertical 2, horizontal 1
                        firstSegment.setAttribute("x1", startX);
                        firstSegment.setAttribute("y1", startY);
                        firstSegment.setAttribute("x2", startX);
                        firstSegment.setAttribute("y2", endY);

                        secondSegment.setAttribute("x1", startX);
                        secondSegment.setAttribute("y1", endY);
                        secondSegment.setAttribute("x2", endX);
                        secondSegment.setAttribute("y2", endY);
                    } else {
                        // horizontal 2, vertical 1
                        firstSegment.setAttribute("x1", startX);
                        firstSegment.setAttribute("y1", startY);
                        firstSegment.setAttribute("x2", endX);
                        firstSegment.setAttribute("y2", startY);

                        secondSegment.setAttribute("x1", endX);
                        secondSegment.setAttribute("y1", startY);
                        secondSegment.setAttribute("x2", endX);
                        secondSegment.setAttribute("y2", endY);
                    }
                } 
                else if (!shouldDrawKnight && firstSegment) {
                    // Single line
                    firstSegment.setAttribute("x1", startX);
                    firstSegment.setAttribute("y1", startY);
                    firstSegment.setAttribute("x2", endX);
                    firstSegment.setAttribute("y2", endY);
                }

                currentArrowGroup.setAttribute(
                    "data-end",
                    `${newSquare.row},${newSquare.col}`
                );
            }
        );
    });

    document.addEventListener("mouseup", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;
    
        if (event.button === 2 && dragStartSquare && currentArrowGroup) {
            chrome.storage.sync.get(["arrowColor"], (data) => {
                const start = currentArrowGroup.getAttribute('data-start');
                const end = currentArrowGroup.getAttribute('data-end');

                if (start && end) {
                    // If an arrow with same start/end is found, remove it
                    const existingArrow = customArrowsContainer.querySelector(
                        `g[data-start="${start}"][data-end="${end}"]`
                    );
                    if (existingArrow) {
                        existingArrow.remove();
                    } else {
                        // Otherwise clone the in-progress arrow into permanent container
                        const clone = currentArrowGroup.cloneNode(true);
                        customArrowsContainer.appendChild(clone);
                    }
                }

                // Clear in-progress arrow
                if (currentCustomArrowContainer) {
                    currentCustomArrowContainer.innerHTML = "";
                }
                currentArrowGroup = null;
                firstSegment = null;
                secondSegment = null;
                wasKnightArrow = null;
                lastValidSquare = null;
            });
        }
    
        if (event.button === 2) {
            isRightMouseDown = false;
            dragStartSquare = null;
            lastValidSquare = null;
        }
    });

    // Left-click clears all arrows
    document.addEventListener("click", (event) => {
        const board = document.querySelector("cg-board");
        if (!board || !board.contains(event.target)) return;

        if (event.button === 0) {
            if (customArrowsContainer) customArrowsContainer.innerHTML = "";
            if (currentCustomArrowContainer) currentCustomArrowContainer.innerHTML = "";
            currentArrowGroup = null;
            firstSegment = null;
            secondSegment = null;
            wasKnightArrow = null;
            lastValidSquare = null;
        }

        // remove highlights
        board.querySelectorAll(".highlight-overlay").forEach((hl) => hl.remove());
    });

    // Prevent the browser's context menu on right-click
    document.addEventListener("contextmenu", (event) => {
        const board = document.querySelector("cg-board");
        if (board && board.contains(event.target)) {
            event.preventDefault();
        }
    });
}

// ================================
//  Board observer for puzzle resets
// ================================
function setupBoardObserver() {
    const targetNode = document.querySelector('.puzzle.puzzle-play');
    if (!targetNode) return;

    const config = { childList: true, subtree: true };
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const cgContainer = document.querySelector('cg-container');
                if (cgContainer) {
                    const arrowOverlay = cgContainer.querySelector('.arrow-overlay');
                    if (!arrowOverlay) {
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

// ================================
//  Listen for changes to settings
// ================================
chrome.storage.onChanged.addListener((changes) => {
    chrome.storage.sync.get([
        "arrowColor", 
        "arrowOpacity", 
        "moveDestColor", 
        "highlightOverlayColor", 
        "selectedSquareColor"
    ], (data) => {
        const updatedColor = (changes.arrowColor && changes.arrowColor.newValue)
            || data.arrowColor
            || DEFAULT_COLOR;
        const updatedOpacity =
            (changes.arrowOpacity && changes.arrowOpacity.newValue !== undefined)
            ? changes.arrowOpacity.newValue
            : (data.arrowOpacity !== undefined ? data.arrowOpacity : DEFAULT_OPACITY);
        const updatedMoveDestColor =
            (changes.moveDestColor && changes.moveDestColor.newValue)
            || data.moveDestColor
            || DEFAULT_MOVE_DEST_COLOR;
        const updatedHighlightOverlayColor =
            (changes.highlightOverlayColor && changes.highlightOverlayColor.newValue)
            || data.highlightOverlayColor
            || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
        const updatedSelectedSquareColor =
            (changes.selectedSquareColor && changes.selectedSquareColor.newValue)
            || data.selectedSquareColor
            || DEFAULT_SELECTED_COLOR;

        injectDynamicCSS(
            updatedColor,
            updatedOpacity,
            updatedMoveDestColor,
            updatedHighlightOverlayColor,
            updatedSelectedSquareColor
        );
    });
});

// ================================
//  Initialize everything
// ================================
chrome.storage.sync.get([
  "arrowColor", 
  "arrowOpacity", 
  "moveDestColor", 
  "highlightOverlayColor", 
  "selectedSquareColor"
], (data) => {
    const savedColor = data.arrowColor || DEFAULT_COLOR;
    const savedOpacity = (data.arrowOpacity !== undefined) ? data.arrowOpacity : DEFAULT_OPACITY;
    const savedMoveDestColor = data.moveDestColor || DEFAULT_MOVE_DEST_COLOR;
    const savedHighlightOverlayColor = data.highlightOverlayColor || DEFAULT_HIGHLIGHT_OVERLAY_COLOR;
    const savedSelectedSquareColor = data.selectedSquareColor || DEFAULT_SELECTED_COLOR;

    injectDynamicCSS(
      savedColor,
      savedOpacity,
      savedMoveDestColor,
      savedHighlightOverlayColor,
      savedSelectedSquareColor
    );

    enableSquareHighlighting();
    setCustomMarker();
    setupArrowDrawing();
    setupBoardObserver();
});
