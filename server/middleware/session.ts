import {IncomingMessage, ServerResponse} from "http";
import {setCookie, useCookie} from "h3";
import {CookieSerializeOptions} from "cookie-es";
import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {NubsyIncomingMessage} from "~/server/lib/system/web/NubsyIncomingMessage";

export default async (req : NubsyIncomingMessage, res: ServerResponse) => {
    const options : CookieSerializeOptions = {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 86400 * 30 // 30 Tage
    };
    
    let cookieValue = useCookie(req, "sessionID");
    
    // throws an error on failure
    let connection : PoolConnection = await BookingLib.getDatabase().getConnection();

    if(!cookieValue || !await BookingLib.getSessionHandler().isSession(cookieValue)) {
        const sessionID = await BookingLib.getSessionHandler().createSession(req.socket.remoteAddress, req.headers["user-agent"]);
        
        // set cookie
        cookieValue = sessionID;
        setCookie(res, "sessionID", sessionID, options);
    } else {
        // TODO: Think about updating session only on non-API-Route-Requests.
        // update cookie (prolong)
        await BookingLib.getSessionHandler().updateSession(cookieValue, req.socket.remoteAddress, req.headers["user-agent"]);
        setCookie(res, "sessionID", cookieValue, options);
    }
    
    const [user, _] = await connection.execute<RowDataPacket[]>("SELECT userID FROM user_session WHERE sessionID=?", [
        cookieValue
    ]);
    await connection.release();
    
    if(user[0].userID !== null) {
        req.userID = user[0].userID
    } else {
        req.userID = -1;
    }
    
    req.sessionID = cookieValue;
}