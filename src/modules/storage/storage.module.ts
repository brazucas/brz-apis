import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWSS3Adpter } from './adapters/aws-s3.adapter';
import aws from './config/aws';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [aws],
    }),
  ],
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useClass: AWSS3Adpter,
    },
  ],
  exports: ['STORAGE_SERVICE'],
})
export class StorageModule {}
