export class ValidationUtil {
    
    static isEmailAddress(email: string) : boolean {
        if(email.length > 256) {
            return false;
        }
        
        const validator = /^(?<local>(?:[^<>()[\]\.,;:\s@\"]+(?:\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(?<domain>(?:[^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        
        return email.match(validator) !== null;
    }
    
    static isNumber(number : string, decimals: number = 0) {
        number = number.replaceAll(",", ".");
    
        let validator;
        if(decimals <= 0) {
            validator = /^(?<integer>[1-9]\d*)$/;
        } else {
            validator = /^(?<integer>[1-9]\d*)(?<decimal>\.\d{1,2})?$/;
        }
        
        return number.match(validator) !== null;
    }
    
}