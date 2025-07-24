from flask import Flask, request, jsonify
import requests
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

NOTION_VERSION = "2022-06-28"

def notion_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION
    }

def is_duplicate_url(notion_token, database_id, job_url):
    query_url = f"https://api.notion.com/v1/databases/{database_id}/query"
    filter_payload = {
        "filter": {
            "property": "URL",
            "url": {
                "equals": job_url
            }
        }
    }

    res = requests.post(query_url, headers=notion_headers(notion_token), json=filter_payload)
    if res.status_code != 200:
        print("Failed to query Notion:", res.text)
        return False

    return len(res.json().get("results", [])) > 0

@app.route('/add-to-notion', methods=['POST'])
def add_to_notion():
    data = request.json

    notion_token = data.get("notionKey")
    database_id = data.get("databaseId")
    job_title = data.get("jobTitle", "Unknown").strip()
    company = data.get("company", "Unknown").strip()
    location = data.get("location", "").strip()
    job_url = data.get("url", "").strip()
    job_description = data.get("jobDescription", "").strip()

    if not notion_token or not database_id:
        return jsonify({"error": "Missing Notion credentials"}), 400

    if not job_url:
        return jsonify({"error": "Missing job URL"}), 400

    if is_duplicate_url(notion_token, database_id, job_url):
        print(f"[Backend] Duplicate job URL detected → {job_url}")
        return jsonify({
            "status": "duplicate",
            "message": "This job URL is already added to your Notion database."
        }), 409

    payload = {
        "parent": {"database_id": database_id},
        "properties": {
            "Company Name": {"title": [{"text": {"content": company}}]},
            "Job Title": {"rich_text": [{"text": {"content": job_title}}]},
            "Location": {"rich_text": [{"text": {"content": location}}]},
            "Date Applied": {"date": {"start": datetime.utcnow().isoformat()}},
            "Source": {"select": {"name": "LinkedIn"}},
            "Status": {"status": {"name": "Applied"}},
            "URL": {"url": job_url},
            "Job Description": {"rich_text": [{"text": {"content": job_description[:2000]}}]},
        }
    }

    response = requests.post("https://api.notion.com/v1/pages", headers=notion_headers(notion_token), json=payload)
    return jsonify({"status": response.status_code, "response": response.text})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)