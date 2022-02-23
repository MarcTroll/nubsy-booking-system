import type { IncomingMessage, ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {useBody, useMethod} from "h3";
import {CryptoUtil} from "~/server/lib/util/CryptoUtil";
import {TimeUtil} from "~/server/lib/util/TimeUtil";

interface RegisterRequestBody {
    emailAddress?: string;
    password?: string;
    
    // TODO: Account information
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "POST") {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
    
    const body = <RegisterRequestBody>(await useBody(req));
    
    // TODO: error handling
    if(!body.emailAddress || !body.password) {
        return {
            status: "error",
            code: "ERR_REQUEST_BODY_INVALID"
        }
    }
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [user, _] = await connection.execute<RowDataPacket[]>("SELECT * FROM user WHERE email=?", [
        body.emailAddress
    ]);
    
    if(user.length > 0) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_USER_ALREADY_EXISTS"
        }
    }
    
    const passwordHash = await CryptoUtil.hash(body.password);
    const currentTime = TimeUtil.getUnixTime();
    
    const [newUser, _2] = await connection.execute("INSERT INTO user (email, password, registrationDate, emailConfirmed) VALUES (?, ?, ?, ?)", [
        body.emailAddress,
        passwordHash,
        currentTime,
        false
    ]);
    
    await connection.release();
    
    return {
        status: "success"
    }
}