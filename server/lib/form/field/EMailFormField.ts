import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {ValidationUtil} from "~/server/lib/util/ValidationUtil";

export class EMailFormField extends AbstractFormField<string> {
    
    constructor(emailAddress: string) {
        super(emailAddress);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(!ValidationUtil.isEmailAddress(this.getValue())) {
            return this.setValidationError("ERR_FORM_VALIDATION_EMAIL_INVALID");
        }
        
        return true;
    }
    
}