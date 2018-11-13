import * as fs from 'fs';
import * as crypto from 'crypto';
import { promisify } from 'util';

type Options = {
  algorithm: string;
  encoding: string;
};

const defaultOptions = {
  algorithm: 'md5',
  encoding: 'hex'
};

export function checksum(buffer: Buffer, options: Partial<Options> = {}) {
  const mergedOptions: Options = Object.assign(defaultOptions, options);
  const hash = crypto.createHash(mergedOptions.algorithm);
  hash.setEncoding(mergedOptions.encoding);

  hash.update(buffer);
  hash.end();
  return hash.read();
}
