console.log(
  "%c[JobTracker] 🎬 content.js injected",
  "color: purple; font-weight: bold;"
);

window.addEventListener("load", () => {
  console.log("[JobTracker] 📦 window.load fired");

  function pick(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function extractJobData() {
    const titleEl = pick([
      "h1.jobs-unified-top-card__job-title",
      "h1.top-card-layout__title",
      "h1[data-test-job-detail-title]",
      "h1"
    ]);
    const jobTitle = titleEl?.innerText.trim() || "";

    const compEl = pick([
      "div.job-details-jobs-unified-top-card__company-name a",
      "div.job-details-jobs-unified-top-card__company-name",
      "a.topcard__org-name-link",
      "a[data-test-company-name]",
      ".jobs-unified-top-card__company-name"
    ]);
    let company = "";
    if (compEl) {
      company = compEl.innerText.trim() || "";
      if (!company) {
        company =
          compEl.getAttribute("aria-label")?.replace(/\s*logo$/i, "").trim() ||
          compEl.querySelector("img")?.alt.replace(/\s*logo$/i, "").trim() ||
          "";
      }
    }

    const locEl = pick([
      "div.job-details-jobs-unified-top-card__tertiary-description-container span.tvm__text",
      "span.jobs-unified-top-card__bullet",
      ".jobs-unified-top-card__workplace-type"
    ]);
    const location = locEl?.innerText.trim() || "";

    const url = window.location.href;

    console.log("[JobTracker] 🧭 Location →", location);
    console.log(`[JobTracker] 🏢 "${jobTitle}" @ "${company}"`);

    return { jobTitle, company, location, url };
  }

  function showNotification(title, message) {
    chrome.runtime.sendMessage({
      type: "SHOW_NOTIFICATION",
      options: {
        type: "basic",
        iconUrl: "icon.png",
        title,
        message
      }
    });
  }

  async function logJobToNotion(remarks = "") {
    const { jobTitle, company, location, url } = extractJobData();

    chrome.storage.sync.get(["notionKey", "databaseId"], async ({ notionKey, databaseId }) => {
      if (!notionKey || !databaseId) {
        console.warn("[JobTracker] ❌ Missing Notion credentials");
        return;
      }

      console.log("[JobTracker] 🔐 Sending job to Notion...");

      const baseURL =
        window.location.hostname === "localhost"
          ? "http://localhost:5001"
          : "https://job-tracker-integration.onrender.com";

      try {
        const res = await fetch(`${baseURL}/add-to-notion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle,
            company,
            location,
            url,
            notionKey,
            databaseId,
            remarks
          })
        });

        const result = await res.json();

        if (res.status === 201) {
          console.log("[JobTracker] ✅ Job logged to Notion");
        } else if (res.status === 409) {
          console.warn("[JobTracker] ⚠️ Duplicate job detected");
          showNotification("Job Tracker", "⚠️ You already applied for this job!");
        } else {
          console.error(`[JobTracker] ❌ Error (${res.status}):`, result);
        }
      } catch (err) {
        console.error("[JobTracker] ❌ Fetch error:", err);
      }
    });
  }

  function trackSubmitButton() {
    const observer = new MutationObserver(() => {
      const submitBtn = document.querySelector('button[aria-label*="Submit application"]');
      if (submitBtn && !submitBtn.dataset.tracked) {
        submitBtn.dataset.tracked = "true";
        submitBtn.addEventListener("click", () => {
          console.log("[JobTracker] 📤 Submit Application clicked — Logging to Notion");
          logJobToNotion();
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.body.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const text = btn.innerText || "";
    const aria = btn.getAttribute("aria-label") || "";

    const isApplyClick = /Apply/i.test(text) || /Apply/i.test(aria);
    if (!isApplyClick) return;

    const isEasyApply = /Easy Apply/i.test(text) || /Easy Apply/i.test(aria);
    const url = window.location.href;
    console.log("[JobTracker] 🔗 Job URL →", url);

    if (isEasyApply) {
      console.log("%c[JobTracker] 🛠 Detected Easy Apply → Waiting for Submit Application", "color: orange;");
      trackSubmitButton(); // wait for actual submit click
      return;
    }

    // External Apply
    console.log("[JobTracker] 🔗 External Apply clicked — Logging now");
    logJobToNotion("External link clicked");
  });
});