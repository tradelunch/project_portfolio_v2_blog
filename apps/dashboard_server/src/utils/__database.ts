// src/config/database.ts
import { Sequelize, Options } from 'sequelize';

import { databaseEnv as env } from '@/src/config/env.database';
import { IS_DEVELOPMENT } from '@/src/config/env.schema';

const dialectOptions: any =
    env.nodeEnv === 'production'
        ? {
              ssl: {
                  require: true,
                  rejectUnauthorized: false,
              },
          }
        : undefined;

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

export const sequelize = new Sequelize(config);

export async function initializeDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        // TODO cuz I do not use model
        // if (env.nodeEnv === 'development') {
        //     await sequelize.sync({ alter: false });
        //     console.log('Database synchronized');
        // }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw Error('Can not authenticate sequelize');
    }
}
