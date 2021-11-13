import {createPool} from "mysql2/promise";
import {Formatting} from "~/server/lib/system/log/Formatting";

/**
 * Database representation for the booking system.
 * */
export class Database {
    
    private connectionPool: any;
    
    constructor(options: {} = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "admin",
        connectionLimit: 10
    }) {
        // TODO: Check properties
        this.connectionPool = createPool({
            host: options.host,
            port: options.port,
            user: options.username,
            password: options.password,
            connectionLimit: options.connectionLimit
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
                // Don't stop. Display error message in browser and console if error occurs.
                // process.exit(9001);
            }
            throw connectError;
        }
    }
    
}