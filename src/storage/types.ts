import fs from 'fs';

type IO = fs.ReadStream | string;

export interface TStorage {
  upload(stream: IO, key: string): void;
  download(key: string): Promise<any>;
  downloadChunk?(key: string, begin: number, end?: number): Promise<fs.ReadStream>;
  delete(key: string): void;
  exists(key: string): Promise<boolean>;
  url(key: string, expiresInSeconds: number): string;
}
