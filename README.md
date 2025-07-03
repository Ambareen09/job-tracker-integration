Job Application Tracker

A simple system to log your LinkedIn job applications directly into a Notion database whenever you click Apply on a job posting.

⸻

🚀 Features
	•	Automated tracking: Captures job title, company, and location from LinkedIn
	•	Notion integration: Stores application details in a Notion database
	•	Chrome extension: Listens for Apply clicks on LinkedIn
	•	Flask API: Serves as a secure bridge between your extension and Notion API

⸻

📦 Repository Structure

linkedin-job-tracker/
├── backend/                  # Flask API server
│   ├── main.py               # Entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Sample environment variables
├── extension/                # Chrome extension files
│   ├── manifest.json
│   └── content.js
└── README.md                 # This documentation


⸻

🎯 Prerequisites
	•	Git (to clone this repo)
	•	Python 3.7+
	•	pip
	•	Google Chrome
	•	Notion account with permission to create integrations

⸻

🔨 Step-by-Step Setup

1. Clone the Repository

git clone https://github.com/<your-username>/linkedin-job-tracker.git
cd linkedin-job-tracker

2. Configure Notion
	1.	In Notion, go to Settings & Members > Integrations and click + New integration.
	2.	Name it Job Tracker, grant Insert content and Read content permissions.
	3.	Copy the Internal Integration Token.
	4.	Create a Database in Notion called Job Tracker with these properties:
	•	Company Name (Title)
	•	Job Title (Rich Text)
	•	Date Applied (Date)
	•	Source (Select)
	•	Location (Rich Text)
	5.	Share the database with your new integration.
	6.	Copy the Database ID from the URL (the long string after the last slash).

3. Set Up the Backend (Flask API)
	1.	Enter the backend folder:

cd backend


	2.	Create a virtual environment and activate it:

python3 -m venv venv
source venv/bin/activate   # on Windows use `venv\Scripts\activate`


	3.	Install dependencies:

pip install -r requirements.txt


	4.	Copy .env.example to .env and fill in your values:

NOTION_API_KEY=secret_xxxx
NOTION_DATABASE_ID=your_database_id


	5.	Start the Flask server:

python main.py

By default, it listens on http://localhost:5001.

4. Load the Chrome Extension
	1.	Open Chrome and go to chrome://extensions.
	2.	Enable Developer mode (toggle top-right).
	3.	Click Load unpacked and select the extension/ directory.
	4.	Ensure the extension is Enabled.

5. Test the Workflow
	1.	Open any LinkedIn job posting or search page.
	2.	Open DevTools (F12) and switch to the Console tab.
	3.	Click an Apply or Easy Apply button.
	4.	You should see logs like:

[JobTracker] Apply button clicked
[JobTracker] Detected: "Software Engineer" at "Acme Corp" in "Berlin, Germany"
[JobTracker] ✔ Logged to Notion


	5.	Check your Notion Job Tracker database—the new row should appear.

⸻

☁️ Deploying the Backend Publicly (Optional)

To use this extension on any network, deploy the Flask server:
	•	Render: Connect your GitHub repo, set environment variables, and deploy.
	•	Railway or Heroku: Similarly, push your code and configure your .env values.

Once deployed, update the fetch URL in extension/content.js to:

fetch("https://your-deployment-url/add-to-notion", { ... })


⸻

🛠 Troubleshooting
	•	No logs in DevTools: Ensure the extension’s manifest.json has:

"matches": ["*://*.linkedin.com/*"],
"all_frames": true


	•	CORS errors: Install flask-cors in your backend and allow your extension origin.
	•	Wrong selectors: LinkedIn often changes class names. Inspect the job title, company, or location elements and update the CSS selectors in content.js accordingly.
	•	Token or DB ID errors: Double-check your .env values and that your integration has access to the database.

⸻

🎉 Contributing

Feel free to open issues or pull requests to add new features (e.g., support for other job sites, additional fields, UI notifications in Chrome, etc.).

⸻

🔮 Future Scope

• Avoid duplicate entries by checking existing records before inserting.

• Extend to other job platforms (Indeed, Glassdoor, etc.).

• Add UI notifications in Chrome to indicate if you've already applied.

