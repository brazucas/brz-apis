import { config } from "@challenge/config/recaptcha";
import { ChallengeService } from "@challenge/types/challenge.interface";
import axios from "axios";

export class GoogleRecaptchaAdapter implements ChallengeService {
  private recaptchaSecret: string;

  constructor() {
    if (!config.recaptchaSecret) {
      throw new Error("RECAPTCHA_SECRET not set");
    }

    this.recaptchaSecret = config.recaptchaSecret;
  }

  checkChallenge = async (token: string): Promise<boolean> => {
    const recaptchaCheck = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          secret: this.recaptchaSecret,
          response: token,
        },
      }
    );

    if ([200, 201].indexOf(recaptchaCheck.status) === -1) {
      throw new Error(
        `Unexpected response from recaptcha endpoint: ${recaptchaCheck.status} status code`
      );
    }

    const recaptchaCheckJson = recaptchaCheck.data;

    if (!recaptchaCheckJson.success) {
      console.error(recaptchaCheckJson);
    }

    return recaptchaCheckJson.success === true;
  };
}
