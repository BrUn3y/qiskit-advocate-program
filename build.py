"""Build the portable, offline HTML presentation using only the standard library."""
from pathlib import Path
import base64
import mimetypes
import re

ROOT = Path(__file__).resolve().parent


def asset(match):
    path = ROOT / match.group(1)
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return "data:" + mime + ";base64," + base64.b64encode(path.read_bytes()).decode()


html = (ROOT / "presentation.html").read_text()
html = html.replace("/* INCLUDE_STYLES */", (ROOT / "styles.css").read_text())
html = html.replace("/* INCLUDE_SCRIPT */", (ROOT / "presentation.js").read_text())
font_license = (ROOT / "assets/OFL.txt").read_text()
html = html.replace("</head>", '<script type="text/plain" id="font-license">\n' + font_license + "</script>\n</head>")
html = re.sub(r"ASSET\((assets/[^)]+)\)", asset, html)
(ROOT / "index.html").write_text(html)
print(f"index.html: {len(html.encode()):,} bytes; all images, fonts, styles and scripts embedded")
