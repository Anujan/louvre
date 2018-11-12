import * as fs from 'fs';
import * as crypto from 'crypto';
import { promisify } from 'util';

type Options = {
  algorithm: string;
  encoding: string;
};

const defaultOptions = {
  algorithm: 'sha1',
  encoding: 'hex'
};

export function checksum(
  fd: number,
  options: Partial<Options> = {},
  callback: (err?: Error | null, checksum?: string | Buffer) => void
) {
  const mergedOptions: Options = Object.assign(defaultOptions, options);
  const hash = crypto.createHash(mergedOptions.algorithm);
  hash.setEncoding(mergedOptions.encoding);

  const stream = fs.createReadStream('', { fd: fd });
  stream.pipe(
    hash,
    { end: false }
  );

  stream.on('error', function(err) {
    callback(err);
  });

  stream.on('end', function() {
    hash.end();
    callback(null, hash.read());
  });
}

export default promisify(checksum);
