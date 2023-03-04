import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import * as serverless from "serverless-http";
import { createPresignedUrl } from "./aws/s3";
import { checkRecaptchaChallenge } from "./recaptcha/v3-challenge";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/download/(*)", async (req: Request, res: Response) => {
  const { token } = req.query;
  const fileName = req.params[0];

  if (!fileName) {
    return res.status(400).json({
      error: "File name is required",
    });
  }

  try {
    const challenge = await checkRecaptchaChallenge(token as string);

    if (!challenge) {
      return res.status(400).json({
        error: "Recaptcha challenge failed",
      });
    }

    const url = await createPresignedUrl(fileName as string);

    res
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "https://blog.brz.gg")
      .json({ url });
  } catch (err: any) {
    res.status(500).json({
      message: err.message?.replace(/^.*?\{/, "{"),
    });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

module.exports.handler = serverless.default(app);
