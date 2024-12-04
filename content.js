// Function to update arrow styles
const updateArrowColor = (color) => {
    // Log to verify the function is called
    console.log("Updating arrow color to:", color);
  
    // Select all <line> elements inside <g> elements with cgHash attributes
    const arrows = document.querySelectorAll('g line');
    const arrowHeads = document.querySelectorAll('marker path');
    
    arrows.forEach(arrow => {
      console.log("Modifying arrow:", arrow); // Log the arrow element
      arrow.setAttribute('stroke', color); // Update the stroke color attribute
      arrow.setAttribute('fill', color); // Update the stroke color attribute
    });

    arrowHeads.forEach(arrowHead => {
        console.log("Modifying arrow:", arrowHead); // Log the arrow element
        // arrowHead.setAttribute('stroke', color); // Update the stroke color attribute
        arrowHead.setAttribute('fill', color); // Update the stroke color attribute
      });
  };
  
  // Function to initialize arrow color application
  const initializeArrowColor = () => {
    chrome.storage.sync.get("arrowColor", (data) => {
      const selectedColor = data.arrowColor || "red"; // Default to red if no color is set
  
      // Update arrows initially
      updateArrowColor(selectedColor);
  
      // Create an observer to watch for new arrows
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            console.log("New nodes added, updating arrows");
            updateArrowColor(selectedColor); // Apply the color to new arrows
          }
        });
      });
  
      // Start observing the document for changes
      observer.observe(document.body, { childList: true, subtree: true });
    });
  };
  
  // Listen for changes to the color in storage
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.arrowColor) {
      const newColor = changes.arrowColor.newValue;
      console.log("Arrow color changed to:", newColor);
      updateArrowColor(newColor); // Update all arrows with the new color
    }
  });
  
  // Run the initialization
  initializeArrowColor();
  