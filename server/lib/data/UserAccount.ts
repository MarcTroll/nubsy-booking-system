import {RowDataPacket} from "mysql2/promise";

export interface UserAccountObject extends RowDataPacket {
    
    accountID: number;
    /**
     * Number referencing to the original user.
     * */
    userID: number;
    username: string;
    
    /**
     * Boolean indicating whether the account is the user's default account.
     * */
    isDefaultAccount: boolean;
    
}