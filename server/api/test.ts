import {Form} from "~/server/lib/form/Form";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {useBody, useMethod} from "h3";

export default async (req: any, res: any) => {
    const form = Form.create("testForm")
        .addFormField(
            new TextFormField("name", "")
                .setValue("Test")
                .setLabel("Test-Label")
                .setMinLength(3)
                .setMaxLength(16)
                .setRequired(false)
        ).addFormField(
            new TextFormField("number", "9")
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