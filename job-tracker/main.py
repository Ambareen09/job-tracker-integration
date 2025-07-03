from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

app = Flask(__name__)
CORS(app)

@app.route('/add-to-notion', methods=['POST'])
def add_to_notion():
    data = request.json
    company = data.get("company", "Unknown")
    title = data.get("jobTitle", "Unknown")

    notion_url = "https://api.notion.com/v1/pages"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    body = {
        "parent": {"database_id": NOTION_DATABASE_ID},
        "properties": {
            "Company Name": {
                "title": [{"text": {"content": company}}]
            },
            "Job Title": {
                "rich_text": [{"text": {"content": title}}]
            },
            "Date Applied": {
                "date": {"start": datetime.utcnow().isoformat()}
            },
            "Source": {
                "select": {"name": "LinkedIn"}
            }
        }
    }

    response = requests.post(notion_url, headers=headers, json=body)
    return jsonify({"status": response.status_code, "message": response.text})

if __name__ == '__main__':
    app.run(port=5001)