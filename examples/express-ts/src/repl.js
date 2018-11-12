const Knex = require('knex');
const objection = require('objection');
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig.development);
objection.Model.knex(knex);
knex.migrate.latest().then(() => console.log('Migrated.'));

// wait

const Person = require('../lib/models/Person').default;
debugger;
// Person.query()
//   .insertGraph({
//     firstName: 'Testy',
//     lastName: 'McTesterson',
//     pets: [
//       {
//         name: 'Fluffy McTesterson'
//       }
//     ],
//     avatar:{
//       key: "Sdgsdg",
//       location: "SDFsd",
//       createdAt: Date.now(),
//       name: "avatar"
//     }
//   })
//   .then(result => {
//     console.log('InsertGraph done:');
//     console.dir(result);
//   });

Person.query()
  .where('firstName', 'Testy')
  .eager("avatar")
  .then(result => {
    console.log('where found:');
    console.dir(result);
  });
