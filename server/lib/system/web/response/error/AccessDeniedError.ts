import {IApiErrorPacket} from "~/server/lib/system/web/response/error/IApiErrorPacket";
import {ApiPacketStatus} from "~/server/lib/system/web/response/IApiPacket";

export class AccessDeniedError {
    
    static generatePacket() : IApiErrorPacket {
        return {
            status: ApiPacketStatus.ERROR,
            code: "FORBIDDEN"
        }
    }
    
}