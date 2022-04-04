import {Form} from "~/server/lib/form/Form";
import {useBody, useMethod} from "h3";
import {SelectFormField} from "~/server/lib/form/field/SelectFormField";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {BookingLib} from "~/server/lib/BookingLib";
import {AccessDeniedError} from "~/server/lib/system/web/response/error/AccessDeniedError";

export default async (req: any, res: any) => {
    const form = Form.create("accountEditForm")
        .addFormField(
            new SelectFormField("salutation", "none")
                // TODO: Translate these when nuxt-i18n is available.
                .setOptions(["none", "male", "female", "other"])
                .setLabel("Anrede")
                .setRequired(true)
        ).addFormField(
            new TextFormField("forename", "")
                .setLabel("Vorname")
                .setMaxLength(64)
                .setRequired(true)
        ).addFormField(
            new TextFormField("surname", "")
                .setLabel("Nachname")
                .setMaxLength(64)
                .setRequired(true)
        ).addFormField(
            new TextFormField("city", "")
                .setLabel("PLZ und Stadt")
                .setMaxLength(64)
                .setRequired(true)
        ).addFormField(
            new TextFormField("street", "")
                .setLabel("Straße und Hausnummer")
                .setMaxLength(64)
                .setRequired(true)
        ).addFormField(
            new TextFormField("phone", "")
                .setLabel("Telefon-/ Handynummer")
                .setMaxLength(64)
                .setRequired(true)
        )
    
    if(!req.sessionID || req.userID <= 0) {
        return AccessDeniedError.generatePacket();
    }
    
    if(useMethod(req) === "GET") {
        // load data from database into fields
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
        const [user, _] = await connection.execute<RowDataPacket[]>("SELECT salutation, forename, surname, city, street, phone FROM user_account WHERE userID=? AND user_account.isDefaultAccount", [
            req.userID
        ]);
    
        await connection.release();
        
        if(user.length > 0) {
            form.getFormField("salutation").setValue(user[0].salutation);
            form.getFormField("forename").setValue(user[0].forename);
            form.getFormField("surname").setValue(user[0].surname);
            form.getFormField("city").setValue(user[0].city);
            form.getFormField("street").setValue(user[0].street);
            form.getFormField("phone").setValue(user[0].phone);
        }
        
        return form.getClientForm();
    } else if(useMethod(req) === "POST") {
        const body = await useBody(req);
        form.applyBody(body);
        
        if(!form.validate()) {
            return form.getFormValidationErrorPacket();
        }
        
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    
        const [update, _] = await connection.execute<RowDataPacket[]>("INSERT INTO user_account (userID, salutation, forename, surname, city, street, phone, alias, isDefaultAccount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE salutation=?, forename=?, surname=?, city=?, street=?, phone=?, alias=IF(isCustomAlias=0, ?, alias)", [
            req.userID,
            form.getFormField("salutation").getSafeValue(),
            form.getFormField("forename").getSafeValue(),
            form.getFormField("surname").getSafeValue(),
            form.getFormField("city").getSafeValue(),
            form.getFormField("street").getSafeValue(),
            form.getFormField("phone").getSafeValue(),
            form.getFormField("forename").getSafeValue() + " " + form.getFormField("surname").getSafeValue(),
            form.getFormField("salutation").getSafeValue(),
            form.getFormField("forename").getSafeValue(),
            form.getFormField("surname").getSafeValue(),
            form.getFormField("city").getSafeValue(),
            form.getFormField("street").getSafeValue(),
            form.getFormField("phone").getSafeValue(),
            form.getFormField("forename").getSafeValue() + " " + form.getFormField("surname").getSafeValue()
        ]);
    
        const [userAccount, _3] = await connection.execute<RowDataPacket[]>("SELECT userID, alias FROM user_account WHERE userID=?", [
            req.userID
        ]);
    
        await connection.release();
        
        return {
            status: "success",
            body: {
                user: {
                    id: userAccount[0].userID,
                    name: userAccount[0].alias
                }
            }
        }
    } else {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
}