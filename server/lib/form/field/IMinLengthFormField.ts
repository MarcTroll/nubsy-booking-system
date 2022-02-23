/**
 * Adds form field support for setting minimum length of a text form field.
 * */
export interface IMinLengthFormField {
    
    /**
     * storing the minimum length a text form field must have. May be null.
     * */
    minLength: number;
    
    /**
     * Returns the minimum length for the form field.
     *
     * @returns {number} minimum length if set. Otherwise null
     * */
    getMinLength();
    
    /**
     * Sets the minimum length for the form field.
     *
     * @param length {number} new maximum length of the form field
     * @returns instance of the form field
     * */
    setMinLength(length : number);
    
    /**
     * Validates the minimum length for the form field.
     *
     * @returns {boolean} true if text length of form field is longer than the provided minimum length or the minimum
     * length is not set. false otherwise.
     * */
    validateMinLength() : boolean;
    
}