import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '@storage/types/storage.interface';

const FILE_ALLOWLIST = ['GTA_SA.iso', 'gta_sa.exe'];

@Injectable()
export class AWSS3Adapter implements StorageService {
  protected s3Client: S3Client;

  constructor(protected readonly configSvc: ConfigService) {
    this.client = new S3Client({
      region: this.configSvc.get<string>('region'),
    });
  }

  get client(): S3Client {
    return this.s3Client;
  }

  set client(client: S3Client) {
    this.s3Client = client;
  }

  generateDownloadUrl(
    file: string,
    expiresIn = this.configSvc.get<number>('fileDownloadExpirationTime'),
  ): Promise<string> {
    if (!FILE_ALLOWLIST.includes(file)) {
      throw new Error('File not allowed');
    }

    const command = new GetObjectCommand({
      Bucket: this.configSvc.get<string>('storage.cdnBucket'),
      Key: file,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}
