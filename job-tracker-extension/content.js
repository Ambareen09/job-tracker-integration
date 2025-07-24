/** @format */

console.log(
  "%c[JobTracker] 🎬 content.js injected",
  "color: purple; font-weight: bold;"
);

window.addEventListener("load", () => {
  console.log("[JobTracker] 📦 window.load fired");

  const pick = (selectors) =>
    selectors.map((sel) => document.querySelector(sel)).find(Boolean) || null;

  const extractJobData = () => {
    const jobTitle =
      pick([
        "h1.jobs-unified-top-card__job-title",
        "h1.top-card-layout__title",
        "h1[data-test-job-detail-title]",
        "h1",
      ])?.innerText.trim() || "";

    const companyEl = pick([
      "div.job-details-jobs-unified-top-card__company-name a",
      "div.job-details-jobs-unified-top-card__company-name",
      "a.topcard__org-name-link",
      "a[data-test-company-name]",
      ".jobs-unified-top-card__company-name",
    ]);
    let company = companyEl?.innerText.trim() || "";
    if (!company) {
      company =
        companyEl
          ?.getAttribute("aria-label")
          ?.replace(/\s*logo$/i, "")
          .trim() ||
        companyEl
          ?.querySelector("img")
          ?.alt.replace(/\s*logo$/i, "")
          .trim() ||
        "";
    }

    const location =
      pick([
        "div.job-details-jobs-unified-top-card__tertiary-description-container span.tvm__text",
        "span.jobs-unified-top-card__bullet",
        ".jobs-unified-top-card__workplace-type",
      ])?.innerText.trim() || "";

    const url = window.location.href;

    console.log("[JobTracker] 🧭 Location:", location);
    console.log(`[JobTracker] 🏢 ${jobTitle} @ ${company}`);
    const jobDescription =
      document.querySelector("#job-details")?.innerText.trim() || "";
    return { jobTitle, company, location, url, jobDescription };
  };

  const showNotification = (title, message) => {
    chrome.runtime.sendMessage({
      type: "SHOW_NOTIFICATION",
      options: {
        type: "basic",
        iconUrl: "icon.png",
        title,
        message,
        priority: 1,
      },
    });
  };

  const logJobToNotion = async (remarks = "") => {
    const { jobTitle, company, location, url, jobDescription } =
      extractJobData();

    chrome.storage.sync.get(
      ["notionKey", "databaseId"],
      async ({ notionKey, databaseId }) => {
        if (!notionKey || !databaseId) {
          console.warn("[JobTracker] ❌ Notion credentials missing");
          return;
        }

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
              remarks,
              jobDescription,
            }),
          });

          const result = await res.json();

          if (res.status === 200 || res.status === 201) {
            console.log(
              `%c[JobTracker] ✅ Successfully saved "${jobTitle}" @ "${company}" to Notion`,
              "color: green; font-weight: bold;"
            );
            showNotification("Job Tracker", "✅ Job added to Notion!");
          } else if (res.status === 409) {
            console.warn("[JobTracker] ⚠️ Duplicate job detected");
            showNotification(
              "Job Tracker",
              "⚠️ You already applied for this job!"
            );
          } else {
            console.error(`[JobTracker] ❌ Error (${res.status}):`, result);
            showNotification(
              "Job Tracker",
              `❌ Failed to log job. (${res.status})`
            );
          }
        } catch (err) {
          console.error("[JobTracker] ❌ Fetch error:", err);
          showNotification(
            "Job Tracker",
            "❌ Network error while logging job."
          );
        }
      }
    );
  };

  const trackSubmitButton = () => {
    const observer = new MutationObserver(() => {
      const submitBtn = document.querySelector(
        'button[aria-label*="Submit application"]'
      );
      if (submitBtn && !submitBtn.dataset.tracked) {
        submitBtn.dataset.tracked = "true";
        submitBtn.addEventListener("click", () => {
          console.log("[JobTracker] 📤 Submit Application clicked");
          logJobToNotion();
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const text = btn.innerText || "";
    const aria = btn.getAttribute("aria-label") || "";

    if (!/Apply/i.test(text) && !/Apply/i.test(aria)) return;

    const isEasyApply = /Easy Apply/i.test(text) || /Easy Apply/i.test(aria);
    const url = window.location.href;
    console.log("[JobTracker] 🔗 Job URL:", url);

    if (isEasyApply) {
      console.log(
        "%c[JobTracker] 🛠 Easy Apply → Waiting for Submit",
        "color: orange;"
      );
      trackSubmitButton();
    } else {
      console.log("[JobTracker] 🔗 External Apply → Logging now");
      logJobToNotion("External link clicked");
    }
  });
});
