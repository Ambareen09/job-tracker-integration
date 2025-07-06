from flask import Flask, request, jsonify
import requests
from datetime import datetime
from flask_cors import CORS
    
app = Flask(__name__)
CORS(app)

@app.route('/add-to-notion', methods=['POST'])
def add_to_notion():
    data = request.json

    notion_token = data.get("notionKey")
    database_id = data.get("databaseId")

    company = data.get("company", "Unknown")
    title = data.get("jobTitle", "Unknown")
    location = data.get("location", "")

    if not notion_token or not database_id:
        return jsonify({"error": "Missing Notion credentials"}), 400

    headers = {
        "Authorization": f"Bearer {notion_token}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    payload = {
        "parent": {"database_id": database_id},
        "properties": {
            "Company Name": {"title": [{"text": {"content": company}}]},
            "Job Title": {"rich_text": [{"text": {"content": title}}]},
            "Location": {"rich_text": [{"text": {"content": location}}]},
            "Date Applied": {"date": {"start": datetime.utcnow().isoformat()}},
            "Source": {"select": {"name": "LinkedIn"}}
        }
    }

    response = requests.post("https://api.notion.com/v1/pages", headers=headers, json=payload)
    return jsonify({"status": response.status_code, "response": response.text})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)