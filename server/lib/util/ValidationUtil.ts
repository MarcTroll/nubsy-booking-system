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
    
    static getNumberValidator(decimals: number = 0) : RegExp {
        if(decimals <= 0) {
            return new RegExp(/^(?<integer>[1-9]\d*)$/);
        } else {
            return new RegExp("/^(?<integer>[1-9]\d*)(?<decimal>\.\d{1," + decimals + "})?$/");
        }
    }
    
    static isNumber(number : string, decimals: number = 0) {
        number = number.replaceAll(",", ".");
        
        return number.match(this.getNumberValidator(decimals)) !== null;
    }
    
}