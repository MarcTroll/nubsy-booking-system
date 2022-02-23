export class ValidationUtil {
    
    static isEmailAddress(email: string) : boolean {
        if(email.length > 256) {
            return false;
        }
        
        const validator = /^(?<local>(?:[^<>()[\]\.,;:\s@\"]+(?:\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(?<domain>(?:[^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        
        return email.match(validator) !== null;
    }
    
}