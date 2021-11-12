import {Config} from "~/server/lib/system/config/Config";
import {Database} from "~/server/lib/system/database/Database";

class BookingLibSingleton {
    
    private readonly db: Database;
    private config: Config;
    
    constructor() {
        this.config = new Config();
        this.db = new Database();
    }
    
    getConfig() {
        return this.config;
    }
    
    getDatabase() {
        return this.db;
    }
    
}

export const BookingLib = new BookingLibSingleton();