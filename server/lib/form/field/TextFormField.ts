import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {IMinLengthFormField} from "~/server/lib/form/field/IMinLengthFormField";
import {IMaxLengthFormField} from "~/server/lib/form/field/IMaxLengthFormField";

export class TextFormField extends AbstractFormField<string> implements IMinLengthFormField, IMaxLengthFormField {
    
    constructor(id: string, text: string = "") {
        super(id, text);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(!this.validateMinLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_TEXT_TOO_SHORT:" + this.getMinLength());
        }
        if(!this.validateMaxLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_TEXT_TOO_LONG:" + this.getMaxLength());
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
        return this.getMinLength() === null || this.getValue().length >= this.getMinLength();
    }
    //</editor-fold>
    
    //<editor-fold desc="Implementation of IMaxLengthFormField">
    maxLength: number = null;
    
    getMaxLength() {
        return this.maxLength;
    }
    
    setMaxLength(length: number) {
        this.maxLength = length;
        
        return this;
    }
    
    validateMaxLength() {
        return this.getMaxLength() === null || this.getValue().length <= this.getMaxLength();
    }
    //</editor-fold>
    
}