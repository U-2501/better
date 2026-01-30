import fetch from "node-fetch";

export async function fetchUpstream(url, session) {
  const cookieHeader = [...session.cookies.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "WebView-Lab/1.0",
      "Cookie": cookieHeader
    }
  });

  const setCookies = response.headers.raw()["set-cookie"];
  if (setCookies) {
    setCookies.forEach(c => {
      const [pair] = c.split(";");
      const [k, v] = pair.split("=");
      session.cookies.set(k, v);
    });
  }

  return response;
}
