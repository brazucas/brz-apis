import * as express from "express";
import { notificationsController } from "./notifications.controller";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Notifications API");
});

app.use("/v1", notificationsController);

export { app, port };
