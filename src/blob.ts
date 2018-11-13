import { Metadata, AttachmentOptions, TransformOptions } from './types';
import { ReadStream, open, readFile, PathLike, createReadStream } from 'fs';
import { promisify } from 'util';
import * as fileType from 'file-type';
import { basename } from 'path';
import * as uuidv4 from 'uuid/v4';
import { checksum } from './utils/checksum';
import Config, { getDefaultConfig } from './configure';
import { transform as transformImage, validate as validateImage } from './content-types/image';

type BlobFileType = 'audio' | 'image' | 'video' | 'text';
type createOptions = {
  filepath: string | null;
  contentType: string;
  byteSize: number;
  checksum: string;
  key: string;
  input?: ReadStream | Buffer;
};

type FromFileOptions = {
  validate?: AttachmentOptions;
  transform?: TransformOptions;
};

export default class Blob {
  private key: string;
  private filename: string | null;
  private contentType: string;
  private byteSize: number;
  private metadata?: Metadata;
  private checksum: string;
  private input?: ReadStream | Buffer;

  constructor(options: createOptions) {
    this.contentType = options.contentType;
    this.filename = options.filepath && basename(options.filepath);
    this.checksum = options.checksum;
    this.byteSize = options.byteSize;
    this.key = options.key;
    if (options.input) {
      this.input = options.input;
    } else if (options.filepath) {
      this.input = createReadStream(options.filepath);
    }
  }

  static fromFile(fdOrFile: number | PathLike, options: FromFileOptions = {}): Promise<Blob> {
    const isBuffer = Buffer.isBuffer(fdOrFile);
    return (
      new Promise((resolve, reject) => {
        if (typeof fdOrFile !== 'number' && !isBuffer) {
          // not a file descriptor
          return promisify(open)(fdOrFile, 'r+')
            .then((fd: number) => resolve(fd))
            .catch(reject);
        }
        resolve(fdOrFile);
      })
        // @ts-ignore
        .then(() => (isBuffer ? Promise.resolve(fdOrFile) : promisify(readFile)))
        .then((file: Buffer) => {
          if (options.validate && options.validate.type === 'image') {
            return validateImage(file, options.validate);
          }
          return Promise.resolve(file);
        })
        .then((file: Buffer) => {
          if (options.transform) {
            return Promise.resolve(transformImage(file, options.transform));
          }
          return Promise.resolve(file);
        })
        .then((file: Buffer) => {
          const contentType = fileType(file).mime;
          const byteSize = file.length;
          const filepath = typeof fdOrFile === 'string' ? fdOrFile : null;
          const cs = checksum(file, {});
          const key = uuidv4();
          return new Blob({
            filepath,
            input: file,
            contentType,
            byteSize,
            key,
            checksum: cs.toString()
          });
        })
    );
  }

  static fromId(id: string, config?: Config) {
    config = config || getDefaultConfig();
    return config
      .getPrimaryService()
      .download(id)
      .then(data => {
        const { body, contentType, byteSize } = data;
        const cs = checksum(body, {});
        return new Blob({
          key: id,
          input: body,
          contentType,
          byteSize,
          checksum: cs.toString(),
          filepath: null
        });
      });
  }

  public variant(options: any) {
    // TODO create variant
  }

  public upload(this: Blob, config?: Config) {
    if (!this.input) {
      return Promise.reject(
        new Error("No input provided. Make sure the file you're uploading exists")
      );
    }
    config = config || getDefaultConfig();
    return config
      .getPrimaryService()
      .upload(this.input, this.key, {
        contentType: this.contentType
      })
      .then(data => ({ blob: this, data }));
  }

  public getServiceUrl(this: Blob, expiresInSeconds?: number, config?: Config) {
    config = config || getDefaultConfig();
    return config
      .getPrimaryService()
      .url(this.getLocation(), expiresInSeconds || config.getUrlExpiration());
  }

  public getId() {
    return this.key;
  }

  public getContentType() {
    return this.contentType;
  }

  public getFileName() {
    return this.filename;
  }

  public getByteSize() {
    return this.byteSize;
  }

  public getMetadata() {
    return this.metadata;
  }

  public getLocation() {
    return this.key;
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

  public toJSON(config: Config) {
    config = config || getDefaultConfig();

    const { key, filename, byteSize, contentType, metadata, checksum } = this;
    return {
      key,
      filename,
      byteSize,
      contentType,
      metadata,
      checksum,
      url: this.getServiceUrl()
    };
  }
}
