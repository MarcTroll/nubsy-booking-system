import type { IncomingMessage, ServerResponse } from "http";

import {BookingLib} from "~/server/lib/BookingLib";
import {PoolConnection} from "mysql2/promise";
import {useBody, useMethod} from "h3";
import {CryptoUtil} from "~/server/lib/util/CryptoUtil";
import {UserObject} from "~/server/lib/data/User";
import {TimeUtil} from "~/server/lib/util/TimeUtil";
import {UserAccountObject} from "~/server/lib/data/UserAccount";
import {Form} from "~/server/lib/form/Form";
import {EmailFormField} from "~/server/lib/form/field/EmailFormField";
import {PasswordFormField} from "~/server/lib/form/field/PasswordFormField";

interface LoginRequestBody {
    emailAddress?: string;
    password?: string;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    if(useMethod(req) !== "POST") {
        res.statusCode = 405;
        res.end("Method not allowed");
    
        return;
    }
    
    const body = <LoginRequestBody>(await useBody(req));
    const form = Form.create()
        .addFormField(
            new EmailFormField("emailAddress", body.emailAddress)
                .setMaxLength(256)
                .setRequired(true)
        )
        .addFormField(
            new PasswordFormField("password", body.password)
                .setMinLength(3)
                .setRequired(true)
        );
    
    // error when validation fails
    if(!form.validate()) {
        return {
            status: "error",
            code: "ERR_FORM_INVALID",
            formErrors: Object.fromEntries(form.getValidationErrors())
        }
    }
    
    const connection : PoolConnection = await BookingLib.getDatabase().getConnection();
    const [user, _] = await connection.execute<(UserObject & UserAccountObject)[]>("SELECT user.userID, email, password, emailConfirmed, ua.forename FROM user LEFT JOIN user_account ua on user.userID = ua.userID AND ua.isDefaultAccount = 1 WHERE email=?", [
        body.emailAddress
    ]);
    
    if(user.length === 0) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_USER_DOESNT_EXIST"
        }
    }
    
    if(!(await CryptoUtil.verify(user[0].password, body.password))) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_PASSWORD_INVALID"
        }
    }
    
    if(!user[0].emailConfirmed) {
        await connection.release();
        return {
            status: "error",
            code: "ERR_EMAIL_NOT_CONFIRMED"
        }
    }
    
    const currentTime = TimeUtil.getUnixTime();
    
    console.log(user[0]);
    
    const [session, _2] = await connection.execute<UserObject[]>("UPDATE user_session SET userID=?, lastActivity=? WHERE sessionID=?", [
        user[0].userID,
        currentTime,
        // @ts-ignore
        req.sessionID
    ]);
    
    await connection.release();
    
    return {
        status: "success",
        user: {
            id: user[0].userID,
            name: user[0].forename
        }
    }
}