from flask import Flask, jsonify
import psycopg2
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

@app.route("/servers")
def fetch_servers():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM servers")
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    data = [dict(zip(columns, row)) for row in rows]
    cur.close()
    conn.close()
    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
