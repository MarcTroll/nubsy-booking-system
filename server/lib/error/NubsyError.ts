export class NubsyError extends Error {
    
    readonly key: string;
    
    constructor(message: string, key: string) {
        super(message);
        this.key = key;
    }
    
}
