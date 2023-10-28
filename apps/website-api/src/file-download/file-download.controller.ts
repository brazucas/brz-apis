import { challengeService, storageService } from "@/services";
import { Request, Response } from "express";

export const downloadFile = async (request: Request, response: Response) => {
  const fileName = request.params.fileName;
  const token = request.query.token;
  if (!fileName) {
    return response.status(400).json({
      error: "File name is required",
    });
  }

  if (!token) {
    return response.status(400).json({
      error: "Recaptcha token is required",
    });
  }

  try {
    const challenge = await challengeService.checkChallenge(token as string);

    if (!challenge) {
      return response.status(400).json({
        error: "Recaptcha challenge failed",
      });
    }

    const url = await storageService.generateDownloadUrl(fileName as string);

    response
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "https://blog.brz.gg")
      .json({ url });
  } catch (err: any) {
    console.error(err);
    response.status(500).json({
      message: err.message,
    });
  }
};
