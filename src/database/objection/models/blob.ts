import { Model, snakeCaseMappers, Id, ColumnNameMappers } from 'objection';
import { Metadata as TMetadata } from '../../../types';

export class Blob extends Model {
  id?: Id;
  key?: string;
  filename?: string;
  contentType?: string;
  byteSize?: string;
  metadata?: TMetadata;
  checksum?: string;
  createdAt?: Date;
  location?: string;

  static get tableName() {
    return 'louvre_blobs';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public $formatJson(json: {}) {
    const { metadata, location } = super.$formatJson(json);
    return {
      metadata,
      location
    };
  }
}
