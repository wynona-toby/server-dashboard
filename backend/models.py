# models.py
from extensions import db
from datetime import datetime

class Server(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    server_name = db.Column(db.String(100))
    status = db.Column(db.String(50))
    ipaddress = db.Column(db.String(50))
    ram_usage = db.Column(db.Float)
    network_traffic = db.Column(db.Float)
    cpu_usage = db.Column(db.Float)
    disk_usage = db.Column(db.Float)
    alert_level = db.Column(db.String(50))
    created_on = db.Column(db.DateTime, default=datetime.utcnow)
