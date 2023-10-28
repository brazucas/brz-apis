import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageService } from "@storage/types/storage.interface";
import { awsConfig } from "@storage/config/aws";
import { storageConfig } from "@storage/config/storage";

const FILE_ALLOWLIST = ["GTA_SA.iso", "gta_sa.exe"];

export class AWSS3Adapter implements StorageService {
  protected s3Client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: awsConfig.region,
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
    expiresIn = storageConfig.fileDownloadExpirationTime
  ): Promise<string> {
    if (!FILE_ALLOWLIST.includes(file)) {
      throw new Error("File not allowed");
    }

    const command = new GetObjectCommand({
      Bucket: awsConfig.storage.cdnBucket,
      Key: file,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}
