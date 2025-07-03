// content.js

console.log("%c[JobTracker] 🎬 content.js injected", "color: purple; font-weight: bold;");

window.addEventListener("load", () => {
  console.log("[JobTracker] window.load fired");

  function pick(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  document.body.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const text = btn.innerText || "";
    const aria = btn.getAttribute("aria-label") || "";
    if (!(/Apply/i).test(text) && !(/Apply/i).test(aria)) return;
    console.log("[JobTracker] Apply clicked");

    await new Promise(r => setTimeout(r, 1500));

    // — Job Title
    const titleEl = pick([
      "h1.jobs-unified-top-card__job-title",
      "h1.top-card-layout__title",
      "h1[data-test-job-detail-title]",
      "h1"
    ]);
    let jobTitle = titleEl?.innerText.trim() || "";
    if (!jobTitle) {
      const parts = document.title.split("|")[0].split(" at ");
      jobTitle = parts[0].trim();
      console.log("[JobTracker] fallback title →", jobTitle);
    }

    // — Company
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
    if (!company) {
      const dt = document.title;
      company = dt.includes(" at ")
        ? dt.split(" at ")[1].split("|")[0].trim()
        : (dt.split("|")[1] || dt.split("|")[0]).trim();
      console.log("[JobTracker] fallback company →", company);
    }

    // — Location
    // LinkedIn puts location in the “tertiary description” section:
    const locEl = pick([
      "div.job-details-jobs-unified-top-card__tertiary-description-container span.tvm__text",
      "span.jobs-unified-top-card__bullet",      // alternative bullet selector
      ".jobs-unified-top-card__workplace-type"    // another variant
    ]);
    let location = locEl?.innerText.trim() || "";
    console.log("[JobTracker] Detected location →", location);

    console.log(`[JobTracker] "${jobTitle}" @ "${company}" in "${location}"`);

    // — send to backend
    try {
      const res = await fetch("http://localhost:5001/add-to-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, location })
      });
      if (res.ok) console.log("[JobTracker] ✔ Logged to Notion");
      else       console.error("[JobTracker] ✖ Notion API error:", await res.text());
    } catch (err) {
      console.error("[JobTracker] ✖ Fetch failed", err);
    }
  });
});