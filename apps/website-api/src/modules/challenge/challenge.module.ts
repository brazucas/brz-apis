import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleRecaptchaAdapter } from './adapters/google-recaptcha.adapter';
import recaptcha from './config/recaptcha';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [recaptcha],
    }),
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    {
      provide: 'CHALLENGE_SERVICE',
      useClass: GoogleRecaptchaAdapter,
    },
  ],
  exports: ['CHALLENGE_SERVICE'],
})
export class ChallengeModule {}
