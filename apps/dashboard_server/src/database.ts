// src/config/database.ts
import { Sequelize, Options } from 'sequelize';
import fs from 'fs';
import path from 'path';

import { databaseEnv as env } from '@/src/config/env.database';
import { IS_DEVELOPMENT, IS_PRODUCTION } from '@/src/config/env.schema';

const dialectOptions: any = (() => {
    let dialectOptions = undefined;

    if (IS_PRODUCTION) {
        const path_to_ca = path.resolve(
            process.cwd(),
            'src/certs/rds-combined-ca-bundle.pem'
        );

        dialectOptions = {
            ssl: {
                require: true,
                rejectUnauthorized: true,
                ca: fs.readFileSync(path_to_ca).toString(),
            },
        };
    } else if (IS_DEVELOPMENT) {
        dialectOptions = {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        };
    }

    dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
    console.log('>> postgres dialect options: ', dialectOptions);

    return dialectOptions;
})();

const config: Options = {
    dialect: 'postgres',

    database: env.database.name,
    username: env.database.user,
    password: env.database.password,

    host: env.database.host,
    port: env.database.port,
    logging: IS_DEVELOPMENT ? console.log : false,

    pool: {
        max: IS_DEVELOPMENT ? 5 : 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions,
    retry: {
        max: 3,
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
        ],
    },
};

console.log('>> database config: ', config);
export const sequalizeP = new Sequelize(config);

export async function initializeDatabase(db: Sequelize): Promise<Sequelize> {
    try {
        await db.authenticate();
        console.log('Database connected');

        // TODO cuz I do not use model
        // if (env.nodeEnv === 'development') {
        //     await sequelize.sync({ alter: false });
        //     console.log('Database synchronized');
        // }

        return db;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw Error('Can not authenticate sequelize');
    }
}
