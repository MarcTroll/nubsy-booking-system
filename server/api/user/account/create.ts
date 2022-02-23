import type { ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {useBody, useMethod} from "h3";
import {NubsyIncomingMessage} from "~/server/lib/system/web/NubsyIncomingMessage";
import {Form} from "~/server/lib/form/Form";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {NumberFormField} from "~/server/lib/form/field/NumberFormField";

interface AccountCreateRequestInterface {
    
    forename?: string;
    surname?: string;
    
    postcode?: number;
    city?: string;
    street?: string;
    
    tel?: string;
    
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
            "postcode",
            new NumberFormField(body.postcode)
                .setRequired(true)
        )
        .addFormField(
            "city",
            new TextFormField(body.city)
                .setMinLength(2)
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
            "tel",
            new TextFormField(body.tel)
                .setMinLength(3)
                .setMaxLength(64)
                .setRequired(true)
        )
    
    if(!form.validate()) {
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
    
    await connection.release();
    
    return {
        status: "success",
        user: {
            id: user[0].userID,
            name: user[0].username
        }
    }
}