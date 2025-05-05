# serve_isolated.py
from http.server import SimpleHTTPRequestHandler, HTTPServer

class IsolatedHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 這兩行標頭同時滿足跨來源隔離要求
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()

if __name__ == "__main__":
    port = 8000
    print(f"Serving http://localhost:{port} with COOP/COEP headers")
    HTTPServer(("", port), IsolatedHandler).serve_forever()
