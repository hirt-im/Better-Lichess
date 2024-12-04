document.getElementById("saveColor").addEventListener("click", () => {
    const color = document.getElementById("arrowColor").value;
    chrome.storage.sync.set({ arrowColor: color }, () => {
        console.log("Arrow color saved!"); 
    });
});
