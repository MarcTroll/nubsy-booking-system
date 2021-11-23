import {Config} from "~/server/lib/system/config/Config";
import {Database} from "~/server/lib/system/database/Database";
import {PoolConnection} from "mysql2/promise";
import {Formatting} from "~/server/lib/system/log/Formatting";

class BookingLibSingleton {
    
    private readonly db: Database;
    private readonly config: Config;
    
    constructor() {
        this.config = new Config();
        this.db = new Database(this.config.getDatabaseConfigOptions());
    }

    async init() {
        try {
            let connection : PoolConnection = await this.getDatabase().getConnection();
            await connection.release();
            
            console.log(`${Formatting.COLOR_GREEN}Successfully connected to database.${Formatting.RESET}`)
        } catch(error) {
            // Do nothing. Error is already logged in Database#getConnection()
        }
    }
    
    getConfig() {
        return this.config;
    }
    
    getDatabase() {
        return this.db;
    }
    
}

export const BookingLib = new BookingLibSingleton();