import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {ValidationUtil} from "~/server/lib/util/ValidationUtil";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

interface IClientNumberFormField extends IClientFormField<number> {
    
    validation: RegExp;
    
}

export class NumberFormField extends AbstractFormField<string, number> {
    
    private decimals: number;
    
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
        return {
            id: this.getId(),
            type: "number",
            value: this.getSafeValue(),
            error: this.getValidationError(),
            validation: ValidationUtil.getNumberValidator(this.getDecimals())
        };
    }
    
}