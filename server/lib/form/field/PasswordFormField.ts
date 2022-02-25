import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {IMinLengthFormField} from "~/server/lib/form/field/IMinLengthFormField";

export class PasswordFormField extends AbstractFormField<string> implements IMinLengthFormField {
    
    constructor(id : string, password : string) {
        super(id, password);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(!this.validateMinLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_PASSWORD_TOO_SHORT");
        }
        
        return true;
    }
    
    //<editor-fold desc="Implementation of IMinLengthFormField">
    minLength: number = null;
    
    getMinLength() {
        return this.minLength;
    }
    
    setMinLength(length: number) {
        this.minLength = length;
        
        return this;
    }
    
    validateMinLength() {
        return this.minLength === null || this.getValue().length >= this.getMinLength();
    }
    //</editor-fold>
    
}