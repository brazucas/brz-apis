const intercept = require("intercept-require");

// We disable the compression express middleware because it causes issues with the AWS API Gateway
intercept((moduleExport, info) => {
  if (info.moduleId === "compression") {
    return function () {
      return function (req, res, next) {
        next();
      };
    };
  }

  return moduleExport;
});

const { createServer, proxy } = require("aws-serverless-express");
const { eventContext } = require("aws-serverless-express/middleware");
const { create } = require("unleash-server/dist/lib/server-impl");
const express = require("express");

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const { app } = await create({
      databaseUrl: process.env.DATABASE_URL,
    });
    app.use(
      "/static",
      express.static(
        __dirname + "node_modules/unleash-server/frontend/build/static/"
      )
    );
    app.use(eventContext());
    cachedServer = createServer(app, undefined, [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/svg",
      "image/x-icon",
      "image/ico+xml",
    ]);
  }

  return cachedServer;
}

if (process.env.NODE_ENV === "local") {
  bootstrapServer().then((app) =>
    app.listen(3000, () => {
      console.log(`Server started successfully on port 3000`);
    })
  );
} else {
  const handler = async (event, context) => {
    app = await bootstrapServer();
    return proxy(app, event, context, "PROMISE").promise;
  };
  exports.handler = handler;
}
