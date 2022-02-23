import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";

export class NumberFormField extends AbstractFormField<string> {
    
    constructor(number: string) {
        super(number);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(isNaN(parseInt(this.getValue()))) {
            this.setValidationError("ERR_FORM_VALIDATION_NUMBER_INVALID")
            return false;
        }
        
        return true;
    }
    
}