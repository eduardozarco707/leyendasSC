import os

from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)

CORS(app)


@app.route("/api", methods=["GET"])
def inicio():
    return jsonify({
        "ok": True,
        "mensaje": "Backend de Leyendas de Santa Cruz funcionando"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "ok": True,
        "servicio": "Leyendas de Santa Cruz IA",
        "groq_configurado": bool(
            os.environ.get("GROQ_API_KEY")
        )
    })
