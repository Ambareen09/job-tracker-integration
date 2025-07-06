console.log("[JobTracker] Extension Loaded");

const applyButtonSelector = 'button.jobs-apply-button';
let lastSubmittedUrl = "";

function getJobDetails() {
  const jobTitleElement = document.querySelector('h2.top-card-layout__title');
  const companyElement = document.querySelector('.topcard__org-name-link, .topcard__flavor');
  const locationElement = document.querySelector('.topcard__flavor--bullet');

  const jobTitle = jobTitleElement?.innerText.trim() || "Unknown Title";
  const company = companyElement?.innerText.trim() || "Unknown Company";
  const location = locationElement?.innerText.trim() || "";
  const jobUrl = window.location.href;

  return { jobTitle, company, location, jobUrl };
}

function sendToNotion(details) {
  chrome.storage.sync.get(['notionKey', 'databaseId'], ({ notionKey, databaseId }) => {
    if (!notionKey || !databaseId) {
      console.warn('[JobTracker] ❗ Notion key or database ID is missing.');
      return;
    }

    fetch('http://localhost:5001/add-to-notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...details,
        notionKey,
        databaseId
      })
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        console.log(`[JobTracker] ✅ Successfully logged ➝ ${details.jobUrl}`);
      } else if (response.status === 409) {
        console.info(`[JobTracker] ⚠️ Duplicate entry skipped ➝ ${details.jobUrl}`);
      } else {
        console.error('[JobTracker] ❌ Error logging to Notion:', response.response);
      }
    })
    .catch(error => {
      console.error('[JobTracker] ❌ Fetch failed:', error);
    });
  });
}

function handleClick() {
  const details = getJobDetails();

  if (details.jobUrl === lastSubmittedUrl) {
    console.log('[JobTracker] 🔁 Already submitted this job URL. Skipping...');
    return;
  }

  lastSubmittedUrl = details.jobUrl;
  sendToNotion(details);
}

const observer = new MutationObserver(() => {
  const applyButton = document.querySelector(applyButtonSelector);
  if (applyButton && !applyButton.dataset.jobTrackerBound) {
    applyButton.addEventListener('click', handleClick);
    applyButton.dataset.jobTrackerBound = 'true';
  }
});

observer.observe(document.body, { childList: true, subtree: true });