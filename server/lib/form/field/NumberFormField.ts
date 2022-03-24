import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {ValidationUtil} from "~/server/lib/util/ValidationUtil";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

interface IClientNumberFormField extends IClientFormField<string> {
    
    validation: string[];
    decimals: number;
    
}

export class NumberFormField extends AbstractFormField<string, number> {
    
    private decimals: number | null = null;
    
    constructor(id, number: string) {
        super(id, number);
    }
    
    setDecimals(decimals : number) : NumberFormField {
        this.decimals = decimals;
        
        return this;
    }
    
    getDecimals() {
        return this.decimals;
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(ValidationUtil.isNumber(this.getValue(), this.getDecimals())) {
            this.setValidationError("ERR_FORM_VALIDATION_NUMBER_INVALID");
            return false;
        }
        
        return true;
    }
    
    getSafeValue(): number {
        return parseInt(this.getValue());
    }
    
    getClientField(): IClientNumberFormField {
        let validationParts = /\/(.*)\/(.*)/.exec(ValidationUtil.getNumberValidator(this.getDecimals()).toString());
        
        return {
            id: this.getId(),
            type: "number",
            label: this.getLabel(),
            value: this.getSafeValue().toString(),
            error: this.getValidationError(),
            decimals: this.getDecimals(),
            validation: [validationParts[1], validationParts[2]]
        };
    }
    
}