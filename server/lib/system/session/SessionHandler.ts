import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {BookingLib} from "~/server/lib/BookingLib";
import {randomBytes} from "crypto";

export class SessionHandler {
    
    /**
     * Creates a new session and returns its sessionID
     * */
    public async createSession(ipAddress : string, userAgent : string) : Promise<string> {
        const unixTime = Math.floor(new Date().getTime() / 1000);
        
        let sessionID;
        let searchSessionID = true;
        
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
        //
        do {
            sessionID = randomBytes(20).toString('base64');
            
            const [rows, _] = await connection.execute<RowDataPacket[]>("SELECT * FROM sessions WHERE sessionID=?", [sessionID]);
            if(rows.length == 0) {
                searchSessionID = false;
            }
        } while(searchSessionID);
        
        await connection.execute(
            "INSERT INTO sessions(sessionID, userID, ipAddress, userAgent, lastActivity) VALUES (?, ?, ?, ?)",
            [sessionID, 0, ipAddress, userAgent, unixTime]);
        await connection.release();
        
        return sessionID;
    }
    
    /**
     * Creates a new session and returns its sessionID
     * */
    public async updateSession(sessionID : string, ipAddress : string, userAgent : string) : Promise<string> {
        const unixTime = Math.floor(new Date().getTime() / 1000);
        
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
        // update session information
        await connection.execute("UPDATE sessions SET ipAddress = ?, userAgent = ?, lastActivity = ? WHERE sessionID = ?",
            [ipAddress, userAgent, unixTime, sessionID]);
        
        await connection.release();
        
        return sessionID;
    }
    
    /**
     * Links the provided sessionID to a specific user provided by its userID.
     * */
    public async login(sessionID : string, userID : number) {
        const unixTime = Math.floor(new Date().getTime() / 1000);
        
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
        const [rows, _] = await connection.execute<RowDataPacket[]>("SELECT * FROM sessions WHERE sessionID=?", [sessionID]);
        // no such session exists
        if(rows.length == 0) {
            await connection.release();
            return;
        }
    
        await connection.execute("UPDATE sessions SET userID = ?, lastActivity = ? WHERE sessionID = ?", [userID, unixTime, sessionID]);
        await connection.release();
    }
    
    /**
     * Returns the userID of the user the provided sessionID is linked to. Returns 0 if no user is linked to the
     * provided sessionID (e.g. active session is not logged in)
     * */
    public async getUserID(sessionID : string) : Promise<number> {
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
        const [rows, _] = await connection.execute<RowDataPacket[]>("SELECT userID FROM sessions WHERE sessionID=?", [sessionID]);
        await connection.release();
        
        return rows[0].userID || 0;
    }
    
}