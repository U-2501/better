import express from "express";
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import { rewriteHTML } from "./rewrite.js";
import { getSession } from "./sessionStore.js";

const app = express();
app.use(cookieParser());
app.use(express.static("../public"));

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl || !targetUrl.startsWith("http")) {
    return res.status(400).send("Invalid URL");
  }

  const session = getSession(req, res);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "WebView-Research-Proxy/1.0"
      }
    });

    const contentType = response.headers.get("content-type") || "";

    // Pass through non-HTML
    if (!contentType.includes("text/html")) {
      res.set("Content-Type", contentType);
      response.body.pipe(res);
      return;
    }

    const html = await response.text();
    const rewritten = rewriteHTML(html, targetUrl);

    res.set("Content-Security-Policy", "default-src 'self' 'unsafe-inline' data:");
    res.send(rewritten);

  } catch (err) {
    res.status(502).send("Upstream fetch failed");
  }
});

app.listen(3000, () => {
  console.log("Proxy running on port 3000");
});
