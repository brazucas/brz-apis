import { ChallengeModule } from '@challenge/challenge.module';
import { Module } from '@nestjs/common';
import { StorageModule } from '@storage/storage.module';
import { FileDownloadController } from './controllers/file-download.controller';

@Module({
  controllers: [FileDownloadController],
  imports: [StorageModule, ChallengeModule],
})
export class PublicModule {}
