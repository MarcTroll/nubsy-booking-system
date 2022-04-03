import {IncomingMessage} from "http";

export class NubsyIncomingMessage extends IncomingMessage {
    
    sessionID? : string;
    userID?: number;
    
}
