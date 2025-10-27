import {
	DB_PG_DATABASE,
	DB_PG_HOST,
	DB_PG_PASSWORD,
	DB_PG_PORT,
	DB_PG_USER,
} from "@/src/env.schema";
import { Sequelize } from "sequelize";

export const sequalizeP = new Sequelize(
	DB_PG_DATABASE,
	DB_PG_USER,
	DB_PG_PASSWORD,
	{
		host: DB_PG_HOST,
		port: DB_PG_PORT,
		dialect: "postgres",
		/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
	}
);

export const establishDBConnection = async () => {
	try {
		await sequalizeP.authenticate();
		console.log("Connection has been established successfully.");
        return sequalizeP;
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};
