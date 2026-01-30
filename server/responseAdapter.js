import { rewriteDocument } from "./documentRewriter.js";

export async function adaptResponse(response, baseUrl, res) {
  const type = response.headers.get("content-type") || "";

  if (!type.includes("text/html")) {
    res.set("Content-Type", type);
    response.body.pipe(res);
    return;
  }

  const html = await response.text();
  const rewritten = rewriteDocument(html, baseUrl);

  res.set("Content-Type", "text/html");
  res.set(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' data: blob:"
  );

  res.send(rewritten);
}
