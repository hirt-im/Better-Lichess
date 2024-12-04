// Function to update arrow styles
const updateArrowColor = (color) => {
    console.log("Updating arrow color to:", color);

    // Select all <line> elements inside <g> elements with cgHash attributes
    const arrows = document.querySelectorAll('g line');
    const arrowHeads = document.querySelectorAll('marker path');
    const circles = document.querySelectorAll('g circle');
    
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
};

// Initialize arrow color and set up MutationObserver
const initializeArrowColor = () => {
    let currentColor = "red"; // Fallback default color

    // Load the saved color from storage
    chrome.storage.sync.get("arrowColor", (data) => {
        currentColor = data.arrowColor || "red"; // Use saved color or default to red
        console.log("Initial arrow color:", currentColor);
        updateArrowColor(currentColor); // Apply the initial color

        // Observe for dynamically added arrows
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    console.log("New nodes added, updating arrows with color:", currentColor);
                    updateArrowColor(currentColor); // Use the latest color
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Listen for changes in color storage and update the observer's color
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.arrowColor) {
            currentColor = changes.arrowColor.newValue; // Update to the latest color
            console.log("Arrow color changed to:", currentColor);
            updateArrowColor(currentColor); // Update all existing arrows immediately
        }
    });
};

// Run the initialization
initializeArrowColor();
