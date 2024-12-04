document.getElementById("saveColor").addEventListener("click", () => {
    const color = document.getElementById("arrowColor").value;
  
    // Save the color to Chrome storage
    chrome.storage.sync.set({ arrowColor: color }, () => {
      alert("Arrow color saved!");
    });
  });
  