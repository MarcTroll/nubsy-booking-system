import {Form} from "~/server/lib/form/Form";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {useBody, useMethod} from "h3";
import {NumberFormField} from "~/server/lib/form/field/NumberFormField";
import {EmailFormField} from "~/server/lib/form/field/EmailFormField";

export default async (req: any, res: any) => {
    const form = Form.create("testForm")
        .addFormField(
            new EmailFormField("name", "")
                .setValue("Test")
                .setLabel("Test-Label")
                .setMaxLength(16)
                .setRequired(true)
        ).addFormField(
            new NumberFormField("number", "9")
                .setRequired(true)
        )
    
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