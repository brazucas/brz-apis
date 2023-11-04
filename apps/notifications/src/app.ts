import * as express from "express";
import * as cors from "cors";
import { notificationsController } from "./notifications.controller";

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

app.get("/", (request, response) => {
  response.send("Notifications API");
});

app.use("/v1", notificationsController);

export { app, port };
