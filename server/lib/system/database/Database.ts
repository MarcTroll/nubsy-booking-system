import {createPool, PoolConnection} from "mysql2/promise";
import ErrnoException = NodeJS.ErrnoException;
import {Formatting} from "~/server/lib/system/log/Formatting";

/**
 * Database representation for the booking system.
 * */
export class Database {
    
    private connectionPool: any;
    
    constructor() {
        this.connectionPool = createPool({
            host: "localhost",
            user: "root",
            password: "secret"
        });
    }
    
    async getConnection() {
        try {
            return await this.connectionPool.getConnection();
        } catch(connectError) {
            // @ts-ignore
            if(connectError.code === "ECONNREFUSED") {
                console.log(`${Formatting.COLOR_RED}${Formatting.BOLD}Fatal error occurred establishing database connection:`);
                console.log(`  ${Formatting.RESET}Database-Connection could not be established. Please check your config and everything is up and running!`);
                process.exit(9001);
            }
            throw connectError;
        }
    }
    
}