import express from "express";
import { requestLogger } from "./util/logger";
import v1Router from "./routes";
import { errorHandler } from "./util/util";

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", v1Router);

app.get("/api", (_req, res) => {
  res.send("API v1 at /api/v1");
});

// Should be last to catch all errors
app.use(errorHandler);

export default app;
