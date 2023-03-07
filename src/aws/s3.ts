import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });

const FILE_ALLOWLIST = ['GTA_SA.iso', 'gta_sa.exe'];

export const createPresignedUrl = async (file: string) => {
  if(!FILE_ALLOWLIST.includes(file)) {
    throw new Error('File not allowed');
  }

  const client = new S3Client({ region: 'sa-east-1'});
  const command = new GetObjectCommand({ Bucket: 'cdn.brz.gg', Key: file });
  
  return await getSignedUrl(client, command, { expiresIn: 3600 })
    .then((url) => {
      return url;
    }).catch((err) => {
      throw err;
    });
};
