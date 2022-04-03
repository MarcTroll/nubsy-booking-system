import {ApiPacketStatus, IApiPacket} from "~/server/lib/system/web/response/IApiPacket";

export interface IApiErrorPacket extends IApiPacket {

    status: ApiPacketStatus.ERROR;
    code: string;

}