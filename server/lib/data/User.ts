import {RowDataPacket} from "mysql2/promise";

export interface UserObject extends RowDataPacket {
    
    userID: number;
    email: string;
    password: string;
    
    /**
     * Unix Timestamp of when the user was created.
     * */
    registrationDate: number;
    
    /**
     * Boolean indicating whether the user has confirmed its email-address or not.
     * */
    emailConfirmed: boolean;
    
}