import { Request, Response, Router } from "express";
import {
  addSeconds,
  generateCode,
  mailValidation,
  phoneValidation,
} from "./helpers";
import { notificationService } from "./notifications.service";

const otpServiceRequestFunction = {
  sms: notificationService.sendSMS,
  email: notificationService.sendEmail,
};

export const requestCode = async (
  { body }: Request,
  response: Response<any>,
  type: "sms" | "email"
) => {
  const { id } = body;

  if (!id?.length) {
    return response.status(400).json({
      informAllFields: true,
    });
  }

  if (type === "sms" && !phoneValidation.test(id)) {
    return response.status(400).json({
      invalidPhoneNumber: true,
    });
  }

  if (type === "email" && !mailValidation.test(id)) {
    return response.status(400).json({
      invalidEmail: true,
    });
  }

  const code = generateCode();

  try {
    const { tries, nextTry } = await notificationService.readCode(id);

    if (nextTry > new Date()) {
      const cooldownTime = Math.floor(
        (nextTry.getTime() - new Date().getTime()) / 1000
      );

      response.status(400).json({
        cooldownTime,
        tries,
      });
      return false;
    }

    if (tries >= Number(process.env.MAX_CODES || 3)) {
      const newNextTry = addSeconds(
        new Date(),
        Number(process.env.WAITING_TIME_AFTER_MAX_CODES || 3600)
      );

      await notificationService.writeCode(id, code, 0, newNextTry);
    } else {
      await notificationService.writeCode(id, code, tries + 1);
    }

    await otpServiceRequestFunction[type](
      id,
      `${code} é o seu código de verificação no BRZ`
    );

    response.status(200).json({
      codeSent: true,
    });
  } catch (err: any) {
    console.error(err);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const confirmCode = async (
  request: Request,
  response: Response<any>
) => {
  const { code } = request.body;
  const id = request.params?.id;

  if (!code?.length || !id?.length) {
    return response.status(400).json({
      informAllFields: true,
    });
  }

  try {
    const codeRequest = await notificationService.readCode(id);

    if (!codeRequest || !codeRequest.code) {
      return response.status(404).json({
        codeNotFound: true,
      });
    }

    if (code !== codeRequest.code) {
      return response.status(400).json({
        wrongCode: true,
      });
    }

    response.status(200).json({ message: "Code confirmed successfully" });
  } catch (err: any) {
    response.status(500).json({
      message: err.message?.replace(/^.*?\{/, "{"),
    });
  }
};

const router = Router();

router.post("/otp/sms", (request, response) =>
  requestCode(request, response, "sms")
);
router.post("/otp/email", (request, response) =>
  requestCode(request, response, "email")
);
router.post("/otp/:id/check", confirmCode);

export { router as notificationsController };
