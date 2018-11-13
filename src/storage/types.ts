import fs from 'fs';

export type IO = fs.ReadStream | string | Buffer;
export type UploadOptions = {
  contentType?: string;
  checksum?: string;
};

export type ServiceMetadata = {
  contentType?: string;
  byteSize?: number;
};

export type DownloadResult = ServiceMetadata & {
  body?: any;
  contentType: string;
  byteSize: string;
};

export interface TStorage {
  upload(stream: IO, key: string, options: UploadOptions): Promise<any>;
  download(key: string): Promise<DownloadResult>;
  downloadChunk?(key: string, begin: number, end?: number): Promise<fs.ReadStream>;
  delete(key: string): void;
  metadata(key: string): Promise<ServiceMetadata>;
  url(key: string, expiresInSeconds: number): string;
}
