import express from "express";
import cookieParser from "cookie-parser";
import { runtimeRouter } from "./router.js";

const app = express();

app.use(cookieParser());
app.use(express.static("../public"));
app.use("/_runtime", runtimeRouter);

app.get("/health", (_, res) => res.send("ok"));

app.listen(3000, () => {
  console.log("WebView runtime listening on :3000");
});
