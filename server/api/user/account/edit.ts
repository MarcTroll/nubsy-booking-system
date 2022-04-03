import {Form} from "~/server/lib/form/Form";
import {NumberFormField} from "~/server/lib/form/field/NumberFormField";
import {useBody, useMethod} from "h3";
import {SelectFormField} from "~/server/lib/form/field/SelectFormField";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {PoolConnection, RowDataPacket} from "mysql2/promise";
import {BookingLib} from "~/server/lib/BookingLib";

export default async (req: any, res: any) => {
    const salutations = new Map<string, string>();
    salutations.set("none", "keine Auswahl");
    salutations.set("male", "Herr");
    salutations.set("female", "Frau");
    
    const form = Form.create("accountEditForm")
        .addFormField(
            new SelectFormField("salutation", "none")
                // TODO: Options should be a key-value-map
                .setOptions(salutations)
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
    
    if(useMethod(req) === "GET") {
        // load data from database into fields
        const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
        const [user, _] = await connection.execute<RowDataPacket[]>("SELECT salutation, forename, surname, city, street, phone FROM user_account INNER JOIN user_session us ON user_account.userID = us.userID WHERE us.sessionID=? AND user_account.isDefaultAccount", [
            req.sessionID
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
        
        return {
            status: "success"
        }
    } else {
        res.statusCode = 405;
        res.end("Method not allowed");
        
        return;
    }
}