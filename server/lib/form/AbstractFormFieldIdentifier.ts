export abstract class AbstractFormFieldIdentifier {
    
    private readonly formFieldId: string;
    
    protected constructor(formFieldId: string) {
        this.formFieldId = formFieldId;
    }
    
    getId() {
        return this.formFieldId;
    }
    
}