import { Request, Response, Router } from "express";
import { generateCode, mailValidation, phoneValidation } from "./helpers";
import { notificationService } from "./notifications.service";

export const requestSms = async (
  { body }: Request,
  response: Response<any>
) => {
  const { phoneNumber } = body;

  if (!phoneNumber?.length) {
    return response.status(400).json({
      error: "Fill all required fields.",
    });
  }

  if (!phoneValidation.test(phoneNumber)) {
    return response.status(400).json({
      message: "Invalid phone number.",
    });
  }

  const code = generateCode();

  try {
    if (!(await codeRequest(phoneNumber, code, response))) {
      return;
    }

    await notificationService.sendSMS(
      phoneNumber,
      `${code} é o seu código de verificação no BRZ`
    );

    response.status(200).json({
      message: "SMS sent",
    });
  } catch (err: any) {
    console.error(err);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const requestEmail = async (
  { body }: Request,
  response: Response<any>
) => {
  const { email } = body;

  if (!email?.length) {
    return response.status(400).json({
      error: "Fill all required fields.",
    });
  }

  if (!mailValidation.test(email)) {
    return response.status(400).json({
      message: "Invalid email.",
    });
  }

  const code = generateCode();

  try {
    if (!(await codeRequest(email, code, response))) {
      return;
    }

    await notificationService.sendEmail(
      email,
      `${code} é o seu código de verificação no BRZ`
    );

    response.status(200).json({
      message: "Email sent",
    });
  } catch (err: any) {
    console.error(err);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};

const codeRequest = async (
  id: string,
  code: string,
  response: Response
): Promise<boolean> => {
  if (await notificationService.isCodeConfirmed(id)) {
    response.status(200).json({
      message: "already confirmed",
    });
    return false;
  }

  const { tries, nextTry } = await notificationService.readCode(id);

  if (nextTry > new Date()) {
    response.status(400).json({
      message:
        `Id ${id} request on cooldown for ` +
        Math.floor((nextTry.getTime() - new Date().getTime()) / 1000) +
        " more seconds.",
    });
    return false;
  }

  if (tries >= Number(process.env.MAX_CODES || 3)) {
    const newNextTry = new Date(
      new Date().getTime() +
        Number(process.env.WAITING_TIME_AFTER_MAX_CODES || 3600) * 1000
    );

    await notificationService.writeCode(id, code, 0, newNextTry);
  } else {
    await notificationService.writeCode(id, code, tries + 1);
  }

  return true;
};

const router = Router();

router.post("/requestSms", requestSms);
router.post("/requestEmail", requestEmail);

export { router as notificationsController };
