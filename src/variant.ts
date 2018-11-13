import { Blob } from './louvre';
import Verifier from './utils/verifier';
import { getDefaultConfig } from './configure';

export default class Variant {
  private blob: Blob;
  private id: string;
  private transforms: any;

  constructor(id: string, blob: Blob, transforms: any) {
    this.id = id;
    this.blob = blob;
    this.transforms = transforms;
  }

  static fromBlob(blob: Blob, transforms: any) {
    const key = getDefaultConfig()
      .getVerifier()
      .generate({ blobId: blob.getId(), transforms }, { purpose: 'variantId' });
    return new Variant(key, blob, transforms);
  }

  public process() {}

  public upload() {}
  public getLocation() {
    return `variants/${this.blob.getId()}/${this.id}`;
  }
}
