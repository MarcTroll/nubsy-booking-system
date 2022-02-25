import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";

export class SelectFormField extends AbstractFormField<string> {
    
    private availableOptions: string[] = [];
    
    constructor(id: string, selection: string = "") {
        super(id, selection);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(!this.getOptions().includes(this.getValue())) {
            this.setValidationError("ERR_FORM_VALIDATION_SELECTION_UNKNOWN_OPTION");
            return false;
        }
        
        return true;
    }
    
    setOptions(options: string[]) {
        this.availableOptions = options;
        
        return this;
    }
    
    getOptions() {
        return this.availableOptions;
    }
    
}