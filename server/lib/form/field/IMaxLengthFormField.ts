/**
 * Adds form field support for setting maximum length of a text form field.
 * */
export interface IMaxLengthFormField {
    
    /**
     * storing the maximum length a text form field may have. May be null.
     * */
    maxLength: number;
    
    /**
     * Returns the maximum length for the form field.
     *
     * @returns {number} maximum length if set. Otherwise null
     * */
    getMaxLength();
    
    /**
     * Sets the maximum length for the form field.
     *
     * @param length {number} new maximum length of the form field
     * @returns instance of the form field
     * */
    setMaxLength(length : number);
    
    /**
     * Validates the maximum length for the form field.
     *
     * @returns {boolean} true if text length of form field is shorter than the provided maximum length or the maximum
     * length is not set. false otherwise.
     * */
    validateMaxLength() : boolean;
    
}