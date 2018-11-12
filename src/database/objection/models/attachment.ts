import { Model, snakeCaseMappers, Relation, ColumnNameMappers } from 'objection';
import { Blob } from './blob';

export class Attachment extends Model {
  static get tableName() {
    return 'louvre_attachments';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get relationMappings() {
    return {
      blob: {
        relation: Model.BelongsToOneRelation,
        modelClass: Blob,
        join: { from: `${Attachment.tableName}.blob_id`, to: `${Blob.tableName}.id` }
      }
    };
  }
}
