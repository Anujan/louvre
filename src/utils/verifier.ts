import crypto from 'crypto';
import msgPack from 'msgpack-lite';

type TPurpose = string | Symbol;

type GenerateOptions = {
  expiresIn?: number;
  expiresAt?: number;
  purpose: TPurpose;
};

type SerializedMessage = {
  val: any;
  pur: string;
  exp: number;
};

const encode = (e: Buffer) => e.toString('base64');
const decode = (e: string) => Buffer.from(e, 'base64');
const digest = 'sha1';

const MESSAGE_SEPERATOR = '--';

export default class Verifier {
  secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }

  generate(value: any, options: GenerateOptions) {
    const data = encode(
      msgPack.encode({
        val: value,
        pur: options.purpose,
        exp: options.expiresAt
          ? options.expiresAt
          : options.expiresIn
            ? Date.now() + options.expiresIn
            : null
      })
    );
    return `${data}${MESSAGE_SEPERATOR}${this.generateDigest(data)}`;
  }

  isValidMessage(signedMesssage: string) {
    if (!signedMesssage) {
      return false;
    }
    const [data, digest] = signedMesssage.split(MESSAGE_SEPERATOR);
    return data && digest && digest === this.generateDigest(data);
  }

  verified(signedMessage: string, purpose: TPurpose) {
    if (this.isValidMessage(signedMessage)) {
      const data: SerializedMessage = msgPack.decode(
        decode(signedMessage.split(MESSAGE_SEPERATOR)[0])
      );
      if (this.isFresh(data) && this.isPurposeMatch(data, purpose)) {
        return data.val;
      }
    }

    return null;
  }

  isFresh(data: { exp?: number }) {
    return !data.exp || data.exp > Date.now();
  }

  isPurposeMatch(data: { pur?: string }, purpose: TPurpose) {
    return purpose === data.pur || !data.pur;
  }

  generateDigest(data: string) {
    return crypto
      .createHmac(digest, this.secret)
      .update(data)
      .digest('hex');
  }
}
