import {AbstractFormFieldIdentifier} from "~/server/lib/form/AbstractFormFieldIdentifier";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

export abstract class AbstractFormField<ValueType, SafeValueType> extends AbstractFormFieldIdentifier {
    
    private value : ValueType;
    private required: boolean = false;
    private validationError : string = "";
    
    protected constructor(formFieldId : string, formFieldValue : ValueType) {
        super(formFieldId);
        this.value = formFieldValue;
    }
    
    setRequired(required: boolean) : AbstractFormField<ValueType, SafeValueType> {
        this.required = required;
        
        return this;
    }
    
    isRequired() : boolean {
        return this.required;
    }
    
    setValue(value : ValueType) {
        this.value = value;
        
        return this;
    }
    
    getValue() : ValueType {
        return this.value;
    }
    
    abstract getSafeValue() : SafeValueType;
    
    setValidationError(validationError : string) : boolean {
        this.validationError = validationError;
        return false;
    }
    
    getValidationError() : string {
        return this.validationError;
    }
    
    validate() : boolean {
        if(this.isRequired()) {
            if(typeof this.value === "undefined" || this.value === null) {
                return this.setValidationError("ERR_FORM_VALIDATION_VALUE_UNDEFINED");
            }
        }
        
        return true;
    }
    
    abstract getClientField() : IClientFormField<any>;
    
}