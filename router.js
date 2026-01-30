import express from "express";
import { getSession } from "./sessionManager.js";
import { fetchUpstream } from "./networkAdapter.js";
import { adaptResponse } from "./responseAdapter.js";

export const runtimeRouter = express.Router();

runtimeRouter.get("/view", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl?.startsWith("http")) {
    return res.status(400).send("Invalid URL");
  }

  const session = getSession(req, res);

  try {
    const upstream = await fetchUpstream(targetUrl, session);
    await adaptResponse(upstream, targetUrl, res);
  } catch (err) {
    res.status(502).send("Upstream error");
  }
});
