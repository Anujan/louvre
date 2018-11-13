import { TStorage, UploadOptions, IO, DownloadResult } from './types';
import fs, { ReadStream } from 'fs';
import * as AWS from 'aws-sdk';
import * as debug from 'debug';

const log = debug('louvre:s3');

type S3Config = AWS.S3.ClientConfiguration & {
  bucket?: string;
  acl?: string;
};

export default class AmazonS3 implements TStorage {
  s3: AWS.S3;
  bucket: string;
  acl: string;

  constructor(config: S3Config) {
    const bucket = config.bucket || process.env.AWS_BUCKET;
    if (!bucket) {
      throw new Error('AWS Bucket was not specified');
    }
    this.bucket = bucket;

    this.acl = config.acl || 'public-read';
    this.s3 = new AWS.S3({
      region: config.region
    });
  }

  upload(stream: IO, key: string, options: UploadOptions) {
    if (!stream) {
      throw new Error('No file input available to upload');
    }
    const params = {
      ACL: this.acl,
      Bucket: this.bucket,
      Key: key,
      Body: stream,
      ContentType: options.contentType,
      ContentMD5: options.checksum
    };
    return this.s3.putObject(params).promise();
  }

  download(key: string): Promise<DownloadResult> {
    // @ts-ignore
    return this.s3
      .getObject({ Bucket: this.bucket, Key: key })
      .promise()
      .then(data => ({
        body: data.Body,
        byteSize: data.ContentLength,
        contentType: data.ContentType
      }));
  }

  delete(key: string) {
    return this.s3.deleteObject({ Bucket: this.bucket, Key: key }).promise();
  }

  metadata(key: string) {
    return this.s3
      .headObject({
        Bucket: this.bucket,
        Key: key
      })
      .promise()
      .then(data => ({
        contentType: data.ContentType,
        byteSize: data.ContentLength
      }));
  }

  url(key: string, expiresInSeconds: number): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresInSeconds
    });
  }
}
