export interface Medicine {
    id?: number;
    medicine_name: string;
    expiration_date: string;
    type_of_medicine_id: string;
    type_of_medicine_description: string;
    qty: number;
    created_by: number;
    updated_by: number;
    date_created?: any;
    date_updated?: any;
}
