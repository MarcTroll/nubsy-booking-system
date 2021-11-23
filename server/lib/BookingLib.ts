import {Config} from "~/server/lib/system/config/Config";
import {Database} from "~/server/lib/system/database/Database";
import {PoolConnection} from "mysql2/promise";

class BookingLibSingleton {
    
    private readonly db: Database;
    private config: Config;
    
    constructor() {
        this.config = new Config();
        this.db = new Database(this.config.getDatabaseConfigOptions());
    }

    async init() {
        try {
            let connection : PoolConnection = await this.getDatabase().getConnection();
            connection.release();
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