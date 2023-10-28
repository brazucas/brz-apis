import * as express from "express";
import { healthRoutes } from "@/health/health.routes";
import { fileDownloadRoutes } from "./file-download/file-download.routes";
import * as cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (process.env.NODE_ENV === "local") {
  app.use(
    cors({
      origin: "*",
    })
  );
}

app.use("/", healthRoutes);
app.use("/download", fileDownloadRoutes);

export { app, port };
