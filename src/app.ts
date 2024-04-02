import express from "express";
import { requestLogger } from "./util/logger";

const app = express();

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.send("Hello World");
  _req.log.info("Hello World");
});

export default app;
