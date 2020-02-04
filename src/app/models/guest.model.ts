export interface Guest {
    id?: number;
    guest_name: string;
    contact_no: string;
    address: string;
    relationship_id: string;
    relationship_description: string;
    elder_id: number;
    time_in: string;
    time_out: string;
    created_by: string;
    updated_by: string;
    date_created?: any;
    date_updated?: any;
}
