import {Form} from "~/server/lib/form/Form";
import {useBody, useMethod} from "h3";
import {SelectFormField} from "~/server/lib/form/field/SelectFormField";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {BookingLib} from "~/server/lib/BookingLib";
import {AccessDeniedError} from "~/server/lib/system/web/response/error/AccessDeniedError";

export default async (req: any, res: any) => {
    const form = Form.create("reservationEditForm")
        .addFormField(
            new SelectFormField("endTime")
                .setLabel("Ende der Buchung")
                .setRequired(true)
        )
    
    if(!req.sessionID || req.userID <= 0) {
        return AccessDeniedError.generatePacket();
    }
    
    if(useMethod(req) === "GET") {
        // load data from database into fields
        (<SelectFormField>form.getFormField("endTime")).setOptions(["12:30", "13:00"]);
        
        return form.getClientForm();
    } else if(useMethod(req) === "POST") {
        const body = await useBody(req);
        form.applyBody(body);
        
        if(!form.validate()) {
            return form.getFormValidationErrorPacket();
        }
        
        return {
            status: "success",
            body: {
            
            }
        }
    } else {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
}