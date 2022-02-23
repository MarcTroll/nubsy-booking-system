export abstract class AbstractFormField<T> {
    
    private value : T;
    private required: boolean = false;
    private validationError : string = "";
    
    protected constructor(formFieldValue : T) {
        this.value = formFieldValue;
    }
    
    setRequired(required: boolean) : AbstractFormField<T> {
        this.required = required;
        
        return this;
    }
    
    isRequired() : boolean {
        return this.required;
    }
    
    setValue(value : T) : AbstractFormField<T> {
        this.value = value;
        
        return this;
    }
    
    getValue() : T {
        return this.value;
    }
    
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
    
}