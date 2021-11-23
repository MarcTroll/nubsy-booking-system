import {createPool} from "mysql2/promise";
import {Formatting} from "~/server/lib/system/log/Formatting";

/**
 * Database representation for the booking system.
 * */
export class Database {
    
    private connectionPool: any;
    
    constructor(options: {
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        database?: string;
        connectionLimit?: number;
    } = {
        host: "localhost",
        port: 3306,
        username: "root",
        password: "admin",
        database: "bookingsys",
        connectionLimit: 10
    }) {
        // Don't pass options directly to create connection pool. Misconfiguration may lead to unexpected behaviour.
        this.connectionPool = createPool({
            host: options.host,
            port: options.port,
            user: options.username,
            password: options.password,
            database: options.database,
            connectionLimit: options.connectionLimit
        });
    }
    
    async getConnection() {
        try {
            return await this.connectionPool.getConnection();
        } catch(connectError) {
            // @ts-ignore
            if(connectError.code === "ECONNREFUSED") {
                console.log(`${Formatting.COLOR_RED}Fatal error occurred establishing database connection:`);
                console.log(`  ${Formatting.RESET}Database-Connection could not be established. Please check your config and everything is up and running!`);
                // Don't stop. Display error message in browser and console if error occurs.
                // process.exit(9001);
            }
            throw connectError;
        }
    }
    
}