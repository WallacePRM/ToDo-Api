const fs = require('fs');

const knexConfig = require('knex');
const knex = knexConfig({
    client: 'pg',
    connection: process.env.DATABASE_URL ? (process.env.DATABASE_URL + '?ssl=true') : {
        host : 'localhost',
        user : 'postgres',
        password : 'masterkey',
        database : 'ToDo'
    }
});

exports.getKnex = () => {

    return knex;
};

exports.executeMigration = async () => {

    try {
        await knex.raw('SELECT id FROM users LIMIT 1');
    }
    catch(error) {

        if (error.message.indexOf('relation "users" does not exist') === -1) {

            return;
        }

        const script = fs.readFileSync('./database/scripts/migration-20220128.sql', 'utf-8');
        await knex.raw(script);
    }
};