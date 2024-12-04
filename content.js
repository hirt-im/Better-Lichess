const updateArrowColor = (color) => {
    console.log("Updating arrow color to:", color);

    const arrows = document.querySelectorAll('g line');
    const arrowHeads = document.querySelectorAll('marker path');
    const circles = document.querySelectorAll('g circle');
    const dots = document.querySelectorAll('square.move-dest');
    const selectedSquare = document.querySelectorAll('square.selected');
    
    arrows.forEach(arrow => {
        console.log("Modifying arrow:", arrow);
        arrow.setAttribute('stroke', color);
        arrow.setAttribute('fill', color);
    });

    arrowHeads.forEach(arrowHead => {
        console.log("Modifying arrow head:", arrowHead);
        arrowHead.setAttribute('fill', color);
    });

    circles.forEach(circle => {
        console.log("Modifying circle:", circle);
        circle.setAttribute('stroke', color);
    });

    const rgbaColor = hexToRgba(color, 0.5); 
    const gradient = `radial-gradient(${rgbaColor} 19%, rgba(0, 0, 0, 0) 20%)`;
    dots.forEach(dot => {
        console.log("Modifying circle:", dot);
        dot.style.background = gradient;
    });

    selectedSquare.forEach(square => {
        console.log("Modifying circle:", square);
        square.style.backgroundColor = rgbaColor;
    });
};


const initializeArrowColor = () => {
    let currentColor = "red"; 

    // Load the saved color from storage
    chrome.storage.sync.get("arrowColor", (data) => {
        currentColor = data.arrowColor || "red"; 
        console.log("Initial arrow color:", currentColor);
        updateArrowColor(currentColor); 

        // Observe for dynamically added arrows
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    console.log("New nodes added, updating arrows with color:", currentColor);
                    updateArrowColor(currentColor); 
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Listen for changes in color storage and update the observer's color
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.arrowColor) {
            currentColor = changes.arrowColor.newValue; 
            console.log("Arrow color changed to:", currentColor);
            updateArrowColor(currentColor); 
        }
    });
};


function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


initializeArrowColor();
