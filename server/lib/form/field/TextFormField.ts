import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {IMinLengthFormField} from "~/server/lib/form/field/IMinLengthFormField";
import {IMaxLengthFormField} from "~/server/lib/form/field/IMaxLengthFormField";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

interface IClientTextFormField extends IClientFormField<string> {

    minLength: number;
    maxLength: number;
    
}

export class TextFormField extends AbstractFormField<string, string> implements IMinLengthFormField, IMaxLengthFormField {
    
    constructor(id: string, text: string = "") {
        super(id, text);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(this.isRequired() && this.getSafeValue().length === 0) {
            return this.setValidationError("ERR_FORM_VALIDATION_VALUE_UNDEFINED");
        }
        
        if(!this.validateMinLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_TEXT_TOO_SHORT");
        }
        if(!this.validateMaxLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_TEXT_TOO_LONG");
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
        return this.getMinLength() === null || this.getSafeValue().length >= this.getMinLength();
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
        return this.getMaxLength() === null || this.getSafeValue().length <= this.getMaxLength();
    }
    //</editor-fold>
    
    getSafeValue(): string {
        return this.getValue().trim();
    }
    
    getClientField(): IClientTextFormField {
        return {
            id: this.getId(),
            type: "text",
            label: this.getLabel(),
            value: this.getSafeValue(),
            error: this.getValidationError(),
            minLength: this.getMinLength(),
            maxLength: this.getMaxLength()
        };
    }
    
}