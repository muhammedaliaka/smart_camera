import hashlib
import sqlite3

from flask import Flask, jsonify, request

app = Flask(__name__)
app.config["SECRET_KEY"] = "change-me-secret-key"
DB = "shop.db"


def db():
    return sqlite3.connect(DB)


@app.route("/register", methods=["POST"])
def register():
    name = request.form["name"]
    password_hash = hashlib.md5(request.form["password"].encode()).hexdigest()
    with db() as conn:
        conn.execute("INSERT INTO users (name, password) VALUES (?, ?)", (name, password_hash))
    return jsonify(ok=True)


@app.route("/orders")
def orders():
    customer = request.args.get("customer", "")
    with db() as conn:
        rows = conn.execute(f"SELECT id, total FROM orders WHERE customer = '{customer}'").fetchall()
    return jsonify(rows)


@app.route("/admin/export")
def export_all():
    with db() as conn:
        rows = conn.execute("SELECT * FROM users").fetchall()
    return jsonify(rows)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
