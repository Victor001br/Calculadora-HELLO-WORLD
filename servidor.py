from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path


PORTA = 3000
PASTA_DO_PROJETO = Path(__file__).resolve().parent
ARQUIVO_DE_REGISTRO = PASTA_DO_PROJETO / "ARQUIVOX.txt"


class CalculadoraHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PASTA_DO_PROJETO, **kwargs)

    def do_GET(self):
        if self.path != "/ultimos-registros":
            super().do_GET()
            return

        if ARQUIVO_DE_REGISTRO.exists():
            with ARQUIVO_DE_REGISTRO.open("r", encoding="utf-8") as arquivo:
                registros = [linha.strip() for linha in arquivo if linha.strip()]
        else:
            registros = []

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps({"records": registros[-5:]}).encode("utf-8"))

    def do_POST(self):
        if self.path != "/registrar-operacao":
            self.send_error(404, "Rota nao encontrada")
            return

        tamanho = int(self.headers.get("Content-Length", 0))
        corpo = self.rfile.read(tamanho)

        try:
            dados = json.loads(corpo.decode("utf-8"))
            operacao = dados["operation"]
        except (json.JSONDecodeError, KeyError, UnicodeDecodeError):
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Operacao invalida"}).encode("utf-8"))
            return

        with ARQUIVO_DE_REGISTRO.open("a", encoding="utf-8") as arquivo:
            arquivo.write(f"{operacao}\n")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))


if __name__ == "__main__":
    servidor = ThreadingHTTPServer(("127.0.0.1", PORTA), CalculadoraHandler)
    print(f"Calculadora rodando em http://127.0.0.1:{PORTA}")
    servidor.serve_forever()
