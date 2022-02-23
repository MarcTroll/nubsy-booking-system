import type { ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection} from "mysql2/promise";
import {useMethod} from "h3";
import {UserObject} from "~/server/lib/data/User";
import {TimeUtil} from "~/server/lib/util/TimeUtil";
import {UserAccountObject} from "~/server/lib/data/UserAccount";
import {NubsyIncomingMessage} from "~/server/lib/system/web/NubsyIncomingMessage";

export default async (req: NubsyIncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "POST") {
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
    const [user, _] = await connection.execute<(UserObject & UserAccountObject)[]>("SELECT user.userID, ua.forename FROM user LEFT JOIN user_account ua on user.userID = ua.userID AND ua.isDefaultAccount = 1 INNER JOIN user_session us on user.userID = us.userID WHERE us.sessionID=?", [
        req.sessionID
    ]);
    
    if(user.length === 0) {
        await connection.release();
        return {
            status: "error"
        }
    }
    
    const currentTime = TimeUtil.getUnixTime();
    
    const [session, _2] = await connection.execute<UserObject[]>("UPDATE user_session SET userID=?, lastActivity=? WHERE sessionID=?", [
        user[0].userID,
        currentTime,
        // @ts-ignore
        req.sessionID
    ]);
    
    await connection.release();
    
    return {
        status: "success",
        user: {
            id: user[0].userID,
            name: user[0].forename
        }
    }
}