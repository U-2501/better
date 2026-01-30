import crypto from "crypto";

const sessions = new Map();

export function getSession(req, res) {
  let sid = req.cookies.sid;

  if (!sid || !sessions.has(sid)) {
    sid = crypto.randomUUID();
    sessions.set(sid, {
      cookies: new Map(),
      created: Date.now()
    });
    res.cookie("sid", sid, { httpOnly: true });
  }

  return sessions.get(sid);
}
