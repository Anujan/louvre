exports.up = knex => {
  return knex.schema
    .createTable('persons', table => {
      table.increments('id').primary();
      table
        .integer('parentId')
        .unsigned()
        .references('id')
        .inTable('persons')
        .onDelete('SET NULL');
      table.string('firstName');
      table.string('lastName');
      table.integer('age');
      table.json('address');
      table.bigInteger('createdAt').notNullable();
      table.bigInteger('updatedAt').notNullable();
    })
    .createTable('movies', table => {
      table.increments('id').primary();
      table.string('name');
    })
    .createTable('animals', table => {
      table.increments('id').primary();
      table
        .integer('ownerId')
        .unsigned()
        .references('id')
        .inTable('persons')
        .onDelete('SET NULL');
      table.string('name');
      table.string('species');
    })
    .createTable('persons_movies', table => {
      table.increments('id').primary();
      table
        .integer('personId')
        .unsigned()
        .references('id')
        .inTable('persons')
        .onDelete('CASCADE');
      table
        .integer('movieId')
        .unsigned()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE');
    })
    .createTable("louvre_blobs", table => {
      table.increments('id').primary();
      table
        .string("key");
      table
        .string("filename");
      table.string("contentType");
      table.integer("byteSize").unsigned();
      table.string("metadata");
      table.string("checksum");
      table.bigInteger('created_at').notNullable();
      table.string("location");

    })
    .createTable("louvre_attachments", table => {
      table.increments('id').primary();
      table
        .integer("blob_id")
        .unsigned()
        .references("id")
        .inTable("louvre_blobs");
      table
        .integer("record_id")
        .unsigned();
      table.string("name").notNullable();
    });
};

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('persons_movies')
    .dropTableIfExists('animals')
    .dropTableIfExists('movies')
    .dropTableIfExists("louvre_blobs")
    .dropTableIfExists('persons');
};
