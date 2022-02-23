import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";

export class Form {
    
    private formFields : Map<string, AbstractFormField<any>> = new Map<string, AbstractFormField<any>>();
    private validationErrors : Map<string, string> = new Map<string, string>();

    /**
     * Creates a new form instance. Could be used as shorthand instead of creating a new object by yourself.
     *
     * @returns {Form} A new form instance.
     * */
    static create() {
        return new Form();
    }
    
    /**
     * Adds a form field to the form field list. Each form field must provide an id by which it can be accessed and
     * identified.
     *
     * @returns {Form} Returns the form instance.
     * */
    addFormField(id : string, formField : AbstractFormField<any>) : Form {
        this.formFields.set(id, formField);
        
        return this;
    }
    
    /**
     * Get a form field by its id.
     *
     * @returns {AbstractFormField|null} Returns the form field if it exists. Otherwise null.
     * */
    getFormField(id : string) : AbstractFormField<any> {
        return this.formFields.get(id) || null;
    }
    
    /**
     * Returns a key-value map containing all field errors that happened during validation. If form fields haven't been
     * validated yet, the Map will be empty, so don't miss to call {@link Form#validate} before.
     *
     * @returns {Map<string, string>} The map keys are the form field ids. The corresponding value is the error-code.
     * */
    getValidationErrors() : Map<string, string> {
        return this.validationErrors;
    }
    
    /**
     * Validates all form fields. A form field is valid if its value is valid. If a form field is invalid, its
     * corresponding error will be logged in a map, which can be accessed using {@link Form#getValidationErrors}.
     *
     * @returns {boolean} Returns true if all values are valid. Otherwise, it will return false.
     * */
    validate() : boolean {
        this.formFields.forEach((field, id) => {
            if(!field.validate()) {
                this.validationErrors.set(id, field.getValidationError());
            }
        });
        
        return this.validationErrors.size === 0;
    }
    
}