chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[JobTracker] 📩 Message received:", message);

  if (message.type === "SHOW_NOTIFICATION" && message.options) {
    chrome.notifications.create("", message.options, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[JobTracker] Notification error:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("[JobTracker] ✅ Notification sent:", notificationId);
      }
    });
  }
});
