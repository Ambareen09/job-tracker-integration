📋 Job Application Tracker

A Chrome extension + Flask backend that automatically logs your LinkedIn job applications into a Notion database. Capture job title, company, and location whenever you click Apply.

⸻

📑 Table of Contents
	•	🚀 Features
	•	📦 Repo Structure
	•	🎯 Prerequisites
	•	🔨 Setup Guide
	•	1. Clone the Repo
	•	2. Notion Configuration
	•	3. Backend (Flask) Setup
	•	4. Chrome Extension Installation
	•	5. End-to-End Test
	•	☁️ Deployment (Optional)
	•	🔮 Future Scope
	•	🛠 Troubleshooting
	•	🎉 Contributing
	•	⚖️ License

⸻

🚀 Features
	•	Automatic tracking: Detects clicks on Apply/Easy Apply
	•	Notion integration: Persists data via Notion API
	•	Fields captured: Job Title, Company, Location, Date Applied, Source
	•	Duplicate prevention: (Future) check before inserting

⸻

📦 Repo Structure

linkedin-job-tracker/
├── backend/
│   ├── main.py           # Flask API server
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # Environment variables sample
├── extension/
│   ├── manifest.json     # Chrome extension manifest
│   └── content.js        # Content script
└── README.md             # This document


⸻

🎯 Prerequisites
	•	Git
	•	Python 3.7+ & pip
	•	Google Chrome
	•	Notion account with integration access

⸻

🔨 Setup Guide

1. Clone the Repo

git clone https://github.com/<your-username>/linkedin-job-tracker.git
cd linkedin-job-tracker

2. Notion Configuration
	1.	In Notion, navigate to Settings & Members > Integrations.
	2.	Click + New integration:
	•	Name: Job Tracker
	•	Capabilities: Read content, Insert content
	3.	Copy the Internal Integration Token.
	4.	Create a Database named Job Tracker with columns:
	•	Company Name (Title)
	•	Job Title (Rich Text)
	•	Location (Rich Text)
	•	Date Applied (Date)
	•	Source (Select: LinkedIn, etc.)
	5.	Share the database with your integration.
	6.	Copy the Database ID from the URL (after the last /).

3. Backend (Flask) Setup

cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your NOTION_API_KEY and NOTION_DATABASE_ID
python main.py

	•	The server runs at http://localhost:5001 by default.

4. Chrome Extension Installation
	1.	Open Chrome → chrome://extensions.
	2.	Enable Developer mode.
	3.	Click Load unpacked and select the extension/ folder.
	4.	Ensure the extension is enabled.

5. End-to-End Test
	1.	Open LinkedIn job page or search results.
	2.	Open DevTools (F12) → Console.
	3.	Click Apply or Easy Apply on any job.
	4.	Verify logs:

[JobTracker] Apply button clicked
[JobTracker] Detected: "Software Engineer" at "Acme Corp" in "Berlin, Germany"
[JobTracker] ✔ Logged to Notion


	5.	Check your Notion DB for the new entry.

⸻

☁️ Deployment (Optional)

Deploy the Flask app to a hosting platform (Render, Railway, Heroku):
	1.	Push your repo to GitHub.
	2.	Connect the project to your hosting service.
	3.	Set NOTION_API_KEY and NOTION_DATABASE_ID in env vars.
	4.	Update fetch URL in extension/content.js to your deployed endpoint.

⸻

🔮 Future Scope
	•	✅ Duplicate checks: Query existing rows before inserting
	•	🌐 Support other job sites (Indeed, Glassdoor)
	•	🔔 Chrome UI notifications for success/failure and duplicates
	•	📊 Analytics dashboard for application history

⸻



	•	Selectors broken: Inspect the LinkedIn DOM and update CSS selectors in content.js.
	•	Integration errors: Ensure your .env values are correct and the integration has database access.

⸻

🎉 Contributing

Contributions are welcome! Please open issues or PRs to:
	•	Add new features
	•	Improve selectors or stability
	•	Support more job platforms

⸻