import { ChallengeModule } from '@challenge/challenge.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicModule } from '@public/public.module';

@Module({
  imports: [PublicModule, ConfigModule.forRoot(), ChallengeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
