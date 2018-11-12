// import { Model, transaction, Id, ref } from 'objection';
// import { AttachOptions } from '../types';
// import { Attachment } from './models/attachment';
// import { Blob } from './models/blob';
// import { Blob as LouvreBlob } from '../../blob';
// import DatabaseError from '../../errors/DatabaseError';
// import { QueryBuilder } from 'knex';

// const readStatic = (klass: any, property: string) => {
//   return typeof klass[property] === 'function' ? klass[property]() : klass[property];
// };

// const capitalize = (str: string) =>
//   str
//     .substring(0, 1)
//     .toUpperCase()
//     .concat(str.substring(1));

// const createRelation = (name: string, RelationType: any) => {
//   const modifyRef = ref(`${Attachment.tableName}.name`) as any;

//   return class FilterableRelation extends RelationType {
//     findQuery(builder: QueryBuilder, opt: any) {
//       debugger;
//       super.findQuery(builder, opt);
//       return builder.where(modifyRef, '=', name);
//     }
//   };
// };

// export default function attach(ModelClass: typeof Model, options: AttachOptions) {
//   const superMappings = readStatic(ModelClass, 'relationMappings');
//   const tableName = readStatic(ModelClass, 'tableName');
//   ModelClass.relationMappings = Object.keys(options).reduce((acc, curr) => {
//     const config = options[curr];
//     acc[curr] = {
//       relation: createRelation(
//         curr,
//         config.multiple ? Model.ManyToManyRelation : Model.HasOneThroughRelation
//       ),
//       modelClass: Blob,
//       join: {
//         from: `${tableName}.${readStatic(ModelClass, 'idColumn')}`,
//         through: {
//           from: `${Attachment.tableName}.record_id`,
//           to: `${Attachment.tableName}.blob_id`,
//           extra: ['name']
//         },
//         to: `${Blob.tableName}.id`
//       }
//     };
//     return acc;
//   }, superMappings);
//   const proto = ModelClass.prototype as { [key: string]: any };

//   Object.keys(options).forEach(function(name) {
//     const config = options[name];
//     const capitalizedName = capitalize(name);

//     const addBlob = async function(this: Model, blob: LouvreBlob) {
//       const trx = await transaction.start(Blob.knex());
//       try {
//         const blobInstance = await Blob.query(trx).insert(blob.toJSON());
//         const id = blobInstance.id;
//         if (!id) {
//           throw new Error('Could not retrieve ID of blob');
//         }
//         const relate = { id, name } as Partial<Model>;
//         const result = await this.$relatedQuery(name, trx).relate(relate);

//         trx.commit();
//         return result;
//       } catch (err) {
//         trx.rollback();
//         throw new DatabaseError(err);
//       }
//     };

//     const removeBlob = async function(this: Model, blobOrId: Blob | Id) {
//       const trx = await transaction.start(Blob.knex());
//       try {
//         let blob: Blob;
//         if (typeof blobOrId === 'string' || typeof blobOrId === 'number') {
//           const toFind = await Blob.query().findById(blobOrId);
//           if (toFind) {
//             blob = toFind;
//           } else {
//             throw new Error(`Blob with ID=${blobOrId} not found`);
//           }
//         } else {
//           blob = blobOrId;
//         }
//         this.$relatedQuery(name, trx)
//           .unrelate()
//           .where('id', blob.id);
//         trx.commit();
//       } catch (err) {
//         trx.rollback();
//         throw new DatabaseError(err);
//       }
//     };

//     proto[`set${capitalizedName}`] = addBlob;
//     proto[`append${capitalizedName}`] = addBlob;
//     proto[`remove${capitalizedName}`] = removeBlob;
//   });

//   return ModelClass;
// }
