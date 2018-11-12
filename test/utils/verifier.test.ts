import Verifier from '../../src/utils/verifier';

describe('Verifier', () => {
  let verifier;
  let message;
  beforeEach(() => {
    verifier = new Verifier('abc');
    message = verifier.generate('message', { purpose: 'storage' });
  });

  describe('isValidMessage()', () => {
    it('validates messages', () => {
      expect(verifier.isValidMessage(message)).toBe(true);
    });

    it('fails with tampered messages', () => {
      expect(verifier.isValidMessage(message.slice(1))).toBe(false);
      expect(verifier.isValidMessage(null)).toBe(false);
    });
  });

  describe('verified()', () => {
    it('verifies purpose', () => {
      expect(verifier.verified(message, 'wrong purpose')).toEqual(null);
      expect(verifier.verified(message, 'storage')).toEqual('message');
    });

    it('fails with tampered message', () => {
      expect(verifier.verified(message.slice(1), 'storage')).toBe(null);
    });

    describe('verifies time', () => {
      it('expires when using expiresIn option', () => {
        Date.now = () => 1000;
        message = verifier.generate('message', { purpose: 'time', expiresIn: 1000 });
        expect(verifier.verified(message, 'time')).toEqual('message');
        Date.now = () => 2001;
        expect(verifier.verified(message, 'time')).toEqual(null);
      });

      it('expires when using expiresAt option', () => {
        Date.now = () => 1000;
        message = verifier.generate('message', { purpose: 'time', expiresAt: 2000 });
        expect(verifier.verified(message, 'time')).toEqual('message');
        Date.now = () => 2001;
        expect(verifier.verified(message, 'time')).toEqual(null);
      });
    });
  });
});
