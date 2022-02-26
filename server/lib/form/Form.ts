import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {AbstractFormFieldIdentifier} from "~/server/lib/form/AbstractFormFieldIdentifier";
import {Formatting} from "~/server/lib/system/log/Formatting";

export class Form extends AbstractFormFieldIdentifier {
    
    private formFields : Map<string, AbstractFormField<any, any>> = new Map<string, AbstractFormField<any, any>>();
    private validationErrors : Map<string, string> = new Map<string, string>();

    private constructor(id: string) {
        super(id);
    }
    
    /**
     * Creates a new form instance. Could be used as shorthand instead of creating a new object by yourself.
     *
     * @returns {Form} A new form instance.
     * */
    static create(id: string) {
        return new Form(id);
    }
    
    /**
     * Adds a form field to the form field list. Each form field must provide an id by which it can be accessed and
     * identified.
     *
     * @returns {Form} Returns the form instance.
     * */
    addFormField(formField : AbstractFormField<any, any>) : Form {
        if(this.getFormField(formField.getId()) !== null) {
            throw new Error(`Form field with id ${formField.getId()} already exists. Use another identifier.`)
        }
        
        this.formFields.set(formField.getId(), formField);
        
        return this;
    }
    
    /**
     * Get a form field by its id.
     *
     * @returns {AbstractFormField|null} Returns the form field if it exists. Otherwise null.
     * */
    getFormField(id : string) : AbstractFormField<any, any> {
        return this.formFields.get(id) || null;
    }
    
    /**
     * Apply all body values to form input fields. If applying a body value is not possible, it will be logged in the
     * console. There won't be an error, because of the reason, that the body may (but shouldn't) be larger than the
     * regarding form.
     *
     * @param body The body of the request.
     * */
    applyBody(body) {
        Object.keys(body).forEach(key => {
            let formField = this.getFormField(key);
            
            if(formField === null) {
                console.log(`${Formatting.COLOR_RED}Error:${Formatting.RESET} Failed to apply form body key '${key}' to form '${this.getId()}'`);
            } else {
                formField.setValue(body[key]);
            }
        })
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
     * Returns the packet that should be sent by default if the form encounters any errors regarding form field
     * validation.
     *
     * @returns {Object} The response packet that is used to handle errors in the frontend.
     * */
    getFormValidationErrorPacket() {
        return {
            status: "error",
            code: "ERR_FORM_INVALID",
            formErrors: Object.fromEntries(this.getValidationErrors())
        }
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
    
    getClientForm() {
        const clientFormFields = {};
        
        this.formFields.forEach((formField, key) => {
            clientFormFields[key] = formField.getClientField()
        });
        
        return clientFormFields;
    }
    
}