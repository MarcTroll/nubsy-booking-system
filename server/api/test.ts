import {Form} from "~/server/lib/form/Form";
import {useBody, useMethod, useQuery} from "h3";
import {NumberFormField} from "~/server/lib/form/field/NumberFormField";
import {EmailFormField} from "~/server/lib/form/field/EmailFormField";

export default async (req: any, res: any) => {
    const form = Form.create("testForm")
        .addFormField(
            new EmailFormField("name", "ch@nge.me")
                .setLabel("Email-Label")
                .setRequired(true)
        ).addFormField(
            new NumberFormField("number", "9")
                .setLabel("Füllmenge")
                .setDecimals(2)
                .setRequired(true)
        )
    
    console.log(useQuery(req))
    
    if(useMethod(req) === "GET") {
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