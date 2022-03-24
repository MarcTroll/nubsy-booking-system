export interface IClientFormField<ValueType> {
    
    id: string;
    label: string;
    type: string;
    value: ValueType;
    error: string;
    required: boolean;
    
}