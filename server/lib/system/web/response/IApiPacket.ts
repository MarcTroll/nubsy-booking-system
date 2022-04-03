export enum ApiPacketStatus {
    SUCCESS = "success",
    ERROR = "error"
}

export interface IApiPacket {
    
    status: ApiPacketStatus;
    
}