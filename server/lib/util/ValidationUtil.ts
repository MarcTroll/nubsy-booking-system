export class ValidationUtil {
    
    static getEmailValidator() : RegExp {
        return new RegExp(/^(?<local>(?:[^<>()[\]\.,;:\s@\"]+(?:\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(?<domain>(?:[^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    }
    
    static isEmailAddress(email: string) : boolean {
        if(email.length > 256) {
            return false;
        }
        
        return email.match(this.getEmailValidator()) !== null;
    }
    
    static getNumberValidator() : RegExp {
        return new RegExp(/^(?<integer>[1-9]\d*)(\.(?<decimal>\d+)?)?$/);
    }
    
    static isNumber(number : string, decimals: number = 0) {
        number = number.replaceAll(",", ".");
        
        let numberValidator = this.getNumberValidator().exec(number);
        if(numberValidator === null) {
            return false;
        }
        
        if(numberValidator.groups.decimal !== undefined) {
            if(numberValidator.groups.decimal.length > decimals) {
                return false;
            }
        }
        return true;
    }
    
}