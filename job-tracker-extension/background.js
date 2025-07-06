chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "duplicate-job") {
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icon.png', // Must exist in root or update path
        title: 'Job Already Applied',
        message: 'You’ve already tracked this job using Job Tracker.',
        priority: 1
      }, notificationId => {
        if (chrome.runtime.lastError) {
          console.error('[JobTracker] Notification error:', chrome.runtime.lastError.message);
        } else {
          console.log('[JobTracker] ✅ Notification sent with ID:', notificationId);
        }
      });
    }
  });