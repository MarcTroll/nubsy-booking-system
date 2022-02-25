import type { ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {useMethod} from "h3";
import {NubsyIncomingMessage} from "~/server/lib/system/web/NubsyIncomingMessage";

export default async (req: NubsyIncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "GET") {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
    
    if(!req.sessionID) {
        res.statusCode = 403;
        res.end("Forbidden");
        
        return;
    }
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [user, _] = await connection.execute<RowDataPacket[]>("SELECT salutation, forename, surname, city, street, phone FROM user_account INNER JOIN user_session us ON user_account.userID = us.userID WHERE us.sessionID=? AND user_account.isDefaultAccount", [
        req.sessionID
    ]);
    
    if(user.length === 0) {
        await connection.release();
    
        return {
            status: "success",
            fields: []
        };
    }
    
    await connection.release();
    
    return {
        status: "success",
        fields: {
            user: user[0]
        }
    }
}