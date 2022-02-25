import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

interface IClientSelectFormField extends IClientFormField<string> {
    
    options: string[];
    
}

export class SelectFormField extends AbstractFormField<string, string> {
    
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
    
    getSafeValue(): string {
        return this.getValue();
    }
    
    getClientField(): IClientSelectFormField {
        return {
            id: this.getId(),
            type: "select",
            label: this.getLabel(),
            value: this.getSafeValue(),
            error: this.getValidationError(),
            options: this.getOptions()
        };
    }
    
}