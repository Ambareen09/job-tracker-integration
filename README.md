# 🗭 LinkedIn Job Tracker

A Chrome Extension + Flask backend that automatically logs your LinkedIn job applications into your Notion database.
Capture **job title**, **company**, and **location** with one click — no manual copy-paste needed.

Capture "Apply" event sent from LinkedIn, and stored the fields in Notion Template.

---

## 📌 Features

* 👡 One-click job tracking from LinkedIn
* 🧠 Stores all data in your personal Notion database
* 🌐 Serverless Flask backend (can be deployed on Render)
* 🔐 100% private — your Notion API credentials stay in your browser only

---

## 🚀 How to Use (For End Users)

> Want to use the extension without coding? Just follow the steps below:

### 1️⃣ Install the Chrome Extension

1. Clone this repository:

   ```bash
   git clone https://github.com/Ambareen09/job-tracker-integration.git
   ```

2. Go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (top right)

4. Click **"Load unpacked"**

5. Select the `job-tracker-extension/` folder from the repo you cloned

---

### 2️⃣ Setup Notion Integration

1. **Duplicate This Notion Template**
   → [📄 Notion Template Link](https://warm-bow-beb.notion.site/Job-Tracker-Integration-with-LinkedIn-template-22824df94f24800d9e60d488eaf6fbc4)

2. Go to: [notion.com/my-integrations](https://www.notion.com/my-integrations)

   * Click **"New Integration"**
   * Name it `Job Tracker`
   * Copy the **Internal Integration Token**

3. Share your database with the new integration (using “Share” → add integration)

---

### 3️⃣ Configure the Extension

1. Click the **Job Tracker** extension icon in Chrome

2. In the popup, click **Options**

3. Paste:

   * ✅ Your **Notion Integration Token**
   * 📂 Your **Notion Database ID** (from the URL of the duplicated template)

4. Click **Save** — you're done!

---

## 💠 Developer Guide

### Backend Setup (Optional – Only for developers)

This extension uses a Flask API to relay data to Notion.

1. Navigate to `job-tracker/`:

   ```bash
   cd job-tracker
   ```

2. Create a `.env` file with the following content:

   ```
   NOTION_TOKEN=your_integration_token
   NOTION_DATABASE_ID=your_database_id
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend locally:

   ```bash
   python main.py
   ```

Or deploy on [Render](https://render.com/) by pointing the root directory to `job-tracker/`.

---

## 🔒 Privacy & Data Usage

* No personally identifiable data is stored.
* All tokens and DB IDs are kept in Chrome local storage.
* The extension sends data only to your own Notion workspace.
* No external analytics or tracking scripts.

📄 [View full Privacy Policy](https://www.notion.so/Privacy-Policy-for-LinkedIn-Job-Tracker-Chrome-Extension-22824df94f2480d6b791d2ce664dec47)

---

## 🤝 Contributing

Want to help improve this project?

### Ways to contribute:

* 💡 Suggest improvements to UI/UX
* 🌍 Add support for more job boards
* 🧪 Add validation or duplicate check features
* 🐞 Report issues or bugs

### Setup for Contributors:

```bash
git clone https://github.com/Ambareen09/job-tracker-integration.git
cd job-tracker-integration
# Make changes in a new branch
git checkout -b feature/your-feature
```

Then push and open a **pull request**.

---
## Future scope

* Ensure user completed full application and submitted, before adding the field into notion database
* Ensure user applies to the same job only once (If the job application link is external, linkedIn does not show the applied status)
* Easy apply jobs must only be recorded if full application was submitted successfuly (and not in draft)


