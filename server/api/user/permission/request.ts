import type { ServerResponse } from "http";

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
    
    if(req.userID < 0) {
        res.statusCode = 403;
        res.end("Forbidden");
    
        return;
    }
    
    // TODO: Check Permissions
    return {
        status: "success",
        value: true
    }
}