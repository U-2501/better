import { JSDOM } from "jsdom";
import { URL } from "url";

export function rewriteDocument(html, baseUrl) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const base = new URL(baseUrl);

  const rewrite = (el, attr) => {
    const val = el.getAttribute(attr);
    if (!val) return;
    try {
      const abs = new URL(val, base).href;
      el.setAttribute(attr, `/_runtime/view?url=${encodeURIComponent(abs)}`);
    } catch {}
  };

  [
    ["a", "href"],
    ["img", "src"],
    ["script", "src"],
    ["link", "href"],
    ["iframe", "src"]
  ].forEach(([tag, attr]) => {
    document.querySelectorAll(`${tag}[${attr}]`)
      .forEach(el => rewrite(el, attr));
  });

  return dom.serialize();
}
