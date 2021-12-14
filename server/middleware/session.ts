import {IncomingMessage, ServerResponse} from "http";
import {setCookie, useCookie} from "h3";
import {CookieSerializeOptions} from "cookie-es";
import {BookingLib} from "~/server/lib/BookingLib";

export default async (req : IncomingMessage, res: ServerResponse) => {
    const options : CookieSerializeOptions = {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 86400 * 30 // 30 Tage
    };
    
    let cookieValue = useCookie(req, "sessionID");
    
    if(!cookieValue) {
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
    
    // TODO
    // Doesn't work for now. See https://github.com/nuxt/framework/issues/1042
    // @ts-ignore
    req.sessionID = cookieValue;
}