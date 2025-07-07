/** @format */

document.addEventListener("DOMContentLoaded", () => {
  const notionKeyInput = document.getElementById("notionKey");
  const databaseIdInput = document.getElementById("databaseId");
  const saveBtn = document.getElementById("saveBtn");
  const successMsg = document.getElementById("success");

  chrome.storage.sync.get(["notionKey", "databaseId"], (data) => {
    if (data.notionKey) notionKeyInput.value = data.notionKey;
    if (data.databaseId) databaseIdInput.value = data.databaseId;
  });

  saveBtn.addEventListener("click", () => {
    const notionKey = notionKeyInput.value.trim();
    const databaseId = databaseIdInput.value.trim();

    if (!notionKey || !databaseId) {
      alert("Please fill in both Notion fields.");
      return;
    }

    chrome.storage.sync.set({ notionKey, databaseId }, () => {
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 2000);
    });
  });
});
