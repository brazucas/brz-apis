import { Module } from '@nestjs/common';
import { ChallengeModule } from '../challenge/challenge.module';
import { StorageModule } from '../storage/storage.module';
import { FileDownloadController } from './controllers/file-download.controller';

@Module({
  controllers: [FileDownloadController],
  imports: [StorageModule, ChallengeModule],
})
export class PublicModule {}
