import { Metadata, AttachmentOptions } from './types';
import { ReadStream, open, readFile, PathLike, createReadStream } from 'fs';
import { promisify } from 'util';
import * as fileType from 'file-type';
import { basename } from 'path';
import { checksum } from './utils/checksum';
import { generate as generateKey } from './utils/base58';
import Config, { getDefaultConfig } from './configure';

type BlobFileType = 'audio' | 'image' | 'video' | 'text';
type createOptions = {
  filename: string | null;
  contentType: string;
  byteSize: number;
  checksum: string;
  key: string;
  fd: number;
};

export default class Blob {
  public key: string;
  filename: string | null;
  contentType: string;
  byteSize: number;
  metadata?: Metadata;
  checksum: string;
  location?: string;
  stream?: ReadStream;
  validation?: AttachmentOptions;

  constructor(options: createOptions, validation?: AttachmentOptions) {
    this.contentType = options.contentType;
    this.filename = options.filename;
    this.checksum = options.checksum;
    this.byteSize = options.byteSize;
    this.key = options.key;
    this.validation = validation;
    if (options.fd) {
      this.stream = createReadStream('', { fd: options.fd });
    }
  }

  static fromFile(file: number | PathLike, options: AttachmentOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (typeof file !== 'number') {
        // not a file descriptor
        return promisify(open)(file, 'r+')
          .then((fd: number) => resolve(fd))
          .catch(reject);
      }
      resolve(file);
    }).then((fd: any) => {
      return promisify(readFile)(fd).then((file: Buffer) => {
        const contentType = fileType(file).mime;
        const byteSize = file.length;
        const filename = typeof file === 'string' ? basename(file) : null;
        return generateKey(24).then(
          (key: string) =>
            new Promise<Blob>((res, rej) =>
              checksum(
                fd,
                {},
                (err, cs) =>
                  err
                    ? rej(err)
                    : res(
                        new Blob({
                          filename,
                          contentType,
                          byteSize,
                          key,
                          checksum: cs ? cs.toString() : '',
                          fd
                        })
                      )
              )
            )
        );
      });
    });
  }

  public validate() {
    if (this.validation) {
      // TODO validation
    }
    return Promise.resolve(this);
  }

  public variant(options: any) {
    // TODO create variant
  }

  public upload(config?: Config) {
    if (!this.stream) {
      return Promise.reject(
        new Error("No stream provided. Make sure the file you're uploading exists")
      );
    }
    config = config || getDefaultConfig();
    return config.getPrimaryService().upload(this.stream, this.key);
  }

  public isAudio() {
    return this.contentType.startsWith('audio');
  }

  public isImage() {
    return this.contentType.startsWith('image');
  }

  public isText() {
    return this.contentType.startsWith('text');
  }

  public isVideo() {
    return this.contentType.startsWith('video');
  }

  public toJSON() {
    const { key, filename, byteSize, contentType, metadata, checksum, location } = this;
    return { key, filename, byteSize, contentType, metadata, checksum, location };
  }
}
