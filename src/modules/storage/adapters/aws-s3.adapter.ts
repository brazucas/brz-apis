import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../types/storage.interface';

const FILE_WHITELIST = ['GTA_SA.iso'];

@Injectable()
export class AWSS3Adpter implements StorageService {
  constructor(protected readonly configSvc: ConfigService) {}

  async generateDownloadUrl(
    file: string,
    expiresIn = this.configSvc.get<number>('fileDownloadExpirationTime'),
  ): Promise<string> {
    if (!FILE_WHITELIST.includes(file)) {
      throw new Error('File not allowed');
    }

    const client = new S3Client({
      region: this.configSvc.get<string>('region'),
    });

    const command = new GetObjectCommand({
      Bucket: this.configSvc.get<string>('storage.cdnBucket'),
      Key: file,
    });

    return await getSignedUrl(client, command, { expiresIn })
      .then((url) => {
        return url;
      })
      .catch((err) => {
        throw err;
      });
  }
}
