import os

from flask import Flask, jsonify
from flask_cors import CORS


# ============================================================
# CREAR APLICACIÓN FLASK
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# PÁGINA PRINCIPAL
# ============================================================

@app.route("/", methods=["GET"])
def inicio():

    return jsonify({
        "ok": True,
        "mensaje": "Backend de Leyendas de Santa Cruz funcionando"
    })


# ============================================================
# PRUEBA DEL SERVIDOR
# ============================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "ok": True,
        "servicio": "Leyendas de Santa Cruz IA",
        "groq_configurado": bool(
            os.environ.get("GROQ_API_KEY")
        )
    })


# ============================================================
# EJECUCIÓN LOCAL
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),
        debug=False
    )