import {Config} from "~/server/lib/system/config/Config";
import {Database} from "~/server/lib/system/database/Database";
import {PoolConnection} from "mysql2/promise";
import {Formatting} from "~/server/lib/system/log/Formatting";
import {SessionHandler} from "~/server/lib/system/session/SessionHandler";

class BookingLibSingleton {
    
    private readonly db: Database;
    private readonly config: Config;
    private readonly sessionHandler: SessionHandler;
    
    constructor() {
        this.config = new Config();
        this.db = new Database(this.config.getDatabaseConfigOptions());
        this.sessionHandler = new SessionHandler();
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
    
    getSessionHandler() {
        return this.sessionHandler;
    }
    
}

export const BookingLib = new BookingLibSingleton();