import { TStorage } from './types';
import fs, { ReadStream } from 'fs';
import * as AWS from 'aws-sdk';

type IO = fs.ReadStream | string;
type S3Config = AWS.S3.ClientConfiguration & {
  bucket?: string;
  acl?: string;
};

export default class AmazonS3 implements TStorage {
  s3: AWS.S3;
  bucket: string;
  acl: string;

  constructor(config: S3Config) {
    config = Object.assign(
      {
        region: process.env.AWS_REGION,
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY
      },
      config
    );
    const bucket = config.bucket || process.env.AWS_BUCKET;
    if (!bucket) {
      throw new Error('AWS Bucket was not specified');
    }
    this.bucket = bucket;

    this.acl = config.acl || 'public-read';
    this.s3 = new AWS.S3(config);
  }

  upload(stream: IO, key: string) {
    if (!stream) {
      throw new Error('No file stream available to upload');
    }
    const params = { ACL: this.acl, Bucket: this.bucket, Key: key, Body: stream };
    return this.s3.putObject(params).promise();
  }

  download(key: string) {
    return this.s3.getObject({ Bucket: this.bucket, Key: key }).promise();
  }

  delete(key: string) {
    return this.s3.deleteObject({ Bucket: this.bucket, Key: key }).promise();
  }

  exists(key: string) {
    return this.s3
      .headObject({
        Bucket: this.bucket,
        Key: key
      })
      .promise()
      .then(() => true)
      .catch(() => false);
  }

  url(key: string, expiresInSeconds: number): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresInSeconds
    });
  }
}
