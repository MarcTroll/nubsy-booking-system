import type { ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {useMethod} from "h3";
import {NubsyIncomingMessage} from "~/server/lib/system/web/NubsyIncomingMessage";
import {AccessDeniedError} from "~/server/lib/system/web/response/error/AccessDeniedError";
import {ApiPacketStatus, IApiPacket} from "~/server/lib/system/web/response/IApiPacket";

interface UserAccountGetResponsePacket extends IApiPacket {
    status: ApiPacketStatus.SUCCESS;
    user: Object;
}

export default async (req: NubsyIncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "GET") {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
    
    if(!req.sessionID || req.userID < 0) {
        return AccessDeniedError.generatePacket();
    }
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [user, _] = await connection.execute<RowDataPacket[]>("SELECT salutation, forename, surname, city, street, phone FROM user_account WHERE userID=? AND user_account.isDefaultAccount", [
        req.userID
    ]);
    
    if(user.length === 0) {
        await connection.release();
    
        return <UserAccountGetResponsePacket>{
            status: ApiPacketStatus.SUCCESS,
            user: null
        };
    }
    
    await connection.release();
    
    return <UserAccountGetResponsePacket>{
        status: ApiPacketStatus.SUCCESS,
        user: user[0]
    }
}