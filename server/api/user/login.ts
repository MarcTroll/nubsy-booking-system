import type { IncomingMessage, ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection} from "mysql2/promise";
import {useBody, useMethod} from "h3";
import {CryptoUtil} from "~/server/lib/util/CryptoUtil";
import {UserObject} from "~/server/lib/data/User";
import {TimeUtil} from "~/server/lib/util/TimeUtil";
import {UserAccountObject} from "~/server/lib/data/UserAccount";

interface LoginRequestBody {
    emailAddress?: string;
    password?: string;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "POST") {
        res.statusCode = 405;
        res.end("Method not allowed");
    
        return;
    }
    
    const body = <LoginRequestBody>(await useBody(req));
    
    // TODO: error handling
    if(!body.emailAddress || !body.password) {
        return {
            status: "error",
            code: "ERR_REQUEST_BODY_INVALID"
        }
    }
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [user, _] = await connection.execute<(UserObject & UserAccountObject)[]>("SELECT * FROM user INNER JOIN user_account ua on user.userID = ua.userID AND ua.isDefaultAccount = 1 WHERE email=?", [
        body.emailAddress
    ]);
    
    if(user.length === 0) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_USER_DOESNT_EXIST"
        }
    }
    
    if(!(await CryptoUtil.verify(user[0].password, body.password))) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_PASSWORD_INVALID"
        }
    }
    
    if(!user[0].emailConfirmed) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_EMAIL_NOT_CONFIRMED"
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
            name: user[0].username
        }
    }
}