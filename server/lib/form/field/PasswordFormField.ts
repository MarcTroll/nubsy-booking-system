import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";

export class PasswordFormField extends AbstractFormField<string> {
    
    constructor(password: string) {
        super(password);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(this.getValue().length < 3) {
            return this.setValidationError("ERR_FORM_VALIDATION_PASSWORD_SHORT");
        }
        
        return true;
    }
    
}