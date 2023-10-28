import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWSS3Adapter } from './adapters/aws-s3.adapter';
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
      useClass: AWSS3Adapter,
    },
  ],
  exports: ['STORAGE_SERVICE'],
})
export class StorageModule {}
