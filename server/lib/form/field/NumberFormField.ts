import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";

export class NumberFormField extends AbstractFormField<number> {
    
    constructor(number: number) {
        super(number);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(isNaN(this.getValue())) {
            this.setValidationError("ERR_FORM_VALIDATION_NUMBER_INVALID")
            return false;
        }
        
        return true;
    }
    
}