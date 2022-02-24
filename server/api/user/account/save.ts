import type { ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {useBody, useMethod} from "h3";
import {NubsyIncomingMessage} from "~/server/lib/system/web/NubsyIncomingMessage";
import {Form} from "~/server/lib/form/Form";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {SelectFormField} from "~/server/lib/form/field/SelectFormField";

interface AccountCreateRequestInterface {
    
    salutation?: string;
    forename?: string;
    surname?: string;
    
    city?: string;
    street?: string;
    
    phone?: string;
    
    isDefaultAccount?: boolean;
    
}

export default async (req: NubsyIncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "POST") {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
    
    if(!req.sessionID) {
        res.statusCode = 403;
        res.end("Forbidden");
        
        return;
    }
    
    const body = <AccountCreateRequestInterface>(await useBody(req));
    const form = Form.create()
        .addFormField(
            "salutation",
            new SelectFormField(body.salutation)
                .setOptions(["none", "male", "female"])
                .setRequired(true)
        )
        .addFormField(
            "forename",
            new TextFormField(body.forename)
                .setMinLength(2)
                .setMaxLength(64)
                .setRequired(true)
        )
        .addFormField(
            "surname",
            new TextFormField(body.surname)
                .setMinLength(2)
                .setMaxLength(64)
                .setRequired(true)
        )
        .addFormField(
            "city",
            new TextFormField(body.city)
                .setMinLength(8)
                .setMaxLength(64)
                .setRequired(true)
        )
        .addFormField(
            "street",
            new TextFormField(body.street)
                .setMinLength(3)
                .setMaxLength(64)
                .setRequired(true)
        )
        .addFormField(
            "phone",
            new TextFormField(body.phone)
                .setMinLength(3)
                .setMaxLength(24)
                .setRequired(true)
        )
    
    if(!form.validate()) {
        console.log(form)
        return {
            status: "error",
            code: "ERR_FORM_INVALID",
            formErrors: Object.fromEntries(form.getValidationErrors())
        }
    }
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [user, _] = await connection.execute<RowDataPacket[]>("SELECT userID FROM user_session WHERE sessionID=?", [
        req.sessionID
    ]);
    
    if(user.length === 0) {
        await connection.release();
        
        res.statusCode = 403;
        res.end("Forbidden");
    
        return;
    }
    
    const [update, _2] = await connection.execute<RowDataPacket[]>("INSERt INTO user_account (userID, salutation, forename, surname, city, street, phone, isDefaultAccount) VALUES (?, ?, ?, ?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE salutation=?, forename=?, surname=?, city=?, street=?, phone=?", [
        user[0].userID,
        form.getFormField("salutation").getValue(),
        form.getFormField("forename").getValue(),
        form.getFormField("surname").getValue(),
        form.getFormField("city").getValue(),
        form.getFormField("street").getValue(),
        form.getFormField("phone").getValue(),
        form.getFormField("salutation").getValue(),
        form.getFormField("forename").getValue(),
        form.getFormField("surname").getValue(),
        form.getFormField("city").getValue(),
        form.getFormField("street").getValue(),
        form.getFormField("phone").getValue()
    ]);
    
    const [userAccount, _3] = await connection.execute<RowDataPacket[]>("SELECT forename FROM user_account WHERE userID=?", [
        user[0].userID
    ]);
    
    await connection.release();
    
    return {
        status: "success",
        user: {
            id: user[0].userID,
            name: userAccount[0].forename
        }
    }
}