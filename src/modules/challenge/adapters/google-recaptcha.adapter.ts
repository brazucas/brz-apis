import { ChallengeService } from '@challenge/types/challenge.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleRecaptchaAdapter implements ChallengeService {
  private recaptchaSecret = this.configSvc.get<string | null | undefined>(
    'recaptchaSecret',
  );

  constructor(
    protected readonly configSvc: ConfigService,
    protected readonly httpSvc: HttpService,
  ) {
    if (!this.recaptchaSecret) {
      throw new Error('RECAPTCHA_SECRET not set');
    }
  }

  checkChallenge = async (token: string): Promise<boolean> => {
    const recaptchaCheck = await firstValueFrom(
      this.httpSvc.post(
        'https://www.google.com/recaptcha/api/siteverify',
        {},
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            secret: this.recaptchaSecret,
            response: token,
          },
        },
      ),
    );

    if ([200, 201].indexOf(recaptchaCheck.status) === -1) {
      throw new Error(
        `Unexpected response from recaptcha endpoint: ${recaptchaCheck.status} status code`,
      );
    }

    const recaptchaCheckJson = recaptchaCheck.data;

    return recaptchaCheckJson.success === true;
  };
}
