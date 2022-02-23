/**
 * Adds form field support for setting maximum length of a text input.
 * */
export interface IMaxLengthFormField {
    
    maxLength: number;
    
    getMaxLength();
    setMaxLength(length : number);
    validateMaxLength();
    
}