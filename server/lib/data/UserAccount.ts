import {RowDataPacket} from "mysql2/promise";

export interface UserAccountObject extends RowDataPacket {
    
    accountID: number;
    /**
     * Number referencing to the original user.
     * */
    userID: number;
    
    forename: string;
    surname: string;
    
    postcode: number;
    city: string;
    street: string;
    
    tel: string;
    
    /**
     * Boolean indicating whether the account is the user's default account.
     * */
    isDefaultAccount: boolean;
    
}