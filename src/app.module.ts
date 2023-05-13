import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicModule } from './modules/public/public.module';
import { ChallengeModule } from './modules/challenge/challenge.module';

@Module({
  imports: [PublicModule, ConfigModule.forRoot(), ChallengeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
