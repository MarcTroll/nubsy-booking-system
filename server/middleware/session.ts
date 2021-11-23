import {IncomingMessage, ServerResponse} from "http";
import {setCookie, useCookie} from "h3";
import {randomBytes} from "crypto";
import {CookieSerializeOptions} from "cookie-es";

export default async (req : IncomingMessage, res: ServerResponse) => {
    const options : CookieSerializeOptions = {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400 * 180 // 180 Tage
    };
    
    if(!useCookie(req, "sessionID")) {
        setCookie(res, "sessionID", randomBytes(20).toString('base64'), options);
    }
    
    // Doesn't work for now. See https://github.com/nuxt/framework/issues/1042
    // @ts-ignore
    req.sessionID = useCookie(req, "sessionID");
}