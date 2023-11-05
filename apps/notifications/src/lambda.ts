import { createServer, proxy } from "aws-serverless-express";
import { eventContext } from "aws-serverless-express/middleware";
import { Server } from "http";

import { app } from "@/app";

const express = require("express");

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer() {
  const base = "/";

  if (!cachedServer) {
    const expressApp = express();
    expressApp.use(eventContext());
    expressApp.use(app);
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }

  return cachedServer;
}

export const handler = async (event, context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, "PROMISE").promise;
};
