document.getElementById("saveBtn").addEventListener("click", () => {
    const notionKey = document.getElementById("notionKey").value;
    const databaseId = document.getElementById("databaseId").value;
  
    chrome.storage.sync.set({ notionKey, databaseId }, () => {
      document.getElementById("status").innerText = "✅ Saved!";
    });
  });