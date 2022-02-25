import {Form} from "~/server/lib/form/Form";
import {TextFormField} from "~/server/lib/form/field/TextFormField";
import {NumberFormField} from "~/server/lib/form/field/NumberFormField";
import {useMethod} from "h3";

const form = Form.create("testForm")
    .addFormField(
        new TextFormField("name", "")
            .setValue("Test")
            .setLabel("Test-Label")
            .setMinLength(3)
            .setMaxLength(16)
            .setRequired(false)
    ).addFormField(
        new NumberFormField("number", "9")
            .setDecimals(4)
            .setRequired(true)
    )

export default async (req: any, res: any) => {
    if(useMethod(req) === "GET") {
        console.log("received GET-request to load form");
    
        return form.getClientForm();
    }
}