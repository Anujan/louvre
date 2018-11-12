import { randomBytes } from 'crypto';
const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const base = alphabet.length;

export const generate = (length: number) => {
  return new Promise<string>((resolve, reject) =>
    randomBytes(length, (err: any, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(Array.prototype.map.call(buffer, (n: number) => alphabet[n % base]).join(''));
      }
    })
  );
};
