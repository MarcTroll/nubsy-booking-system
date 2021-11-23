import {IncomingMessage, ServerResponse} from "http";
import {setCookie, useCookie} from "h3";
import {randomBytes} from "crypto";
import {CookieSerializeOptions} from "cookie-es";

export default async (req : IncomingMessage, res: ServerResponse) => {
    const options : CookieSerializeOptions = {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400 * 90 // 90 Tage
    };
    
    const cookieValue = useCookie(req, "sessionID");
    
    if(!cookieValue) {
        // set cookie
        setCookie(res, "sessionID", randomBytes(20).toString('base64'), options);
    } else {
        // update cookie to prolong expiry date
        if(!req.url.startsWith("/api/")) {
            setCookie(res, "sessionID", cookieValue, options);
        }
    }
    
    // TODO
    // Doesn't work for now. See https://github.com/nuxt/framework/issues/1042
    // @ts-ignore
    req.sessionID = useCookie(req, "sessionID");
}