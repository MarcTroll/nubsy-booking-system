export interface IClientFormField<ValueType> {
    
    id: string;
    type: string;
    value: ValueType;
    error: string;
    
}