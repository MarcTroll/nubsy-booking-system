/**
 * Adds form field support for setting minimum length of a text input.
 * */
export interface IMinLengthFormField {
    
    minLength: number;
    
    getMinLength();
    setMinLength(length : number);
    validateMinLength();
    
}