export interface Hospital {
    id?: number;
    hospital_name: string;
    address: string;
    hospital_contact_no: string;
    about: string;
    service_offer: any[];
    archived: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}

export const initHospital: Hospital = {
    id: 0,
    hospital_name: '',
    address: '',
    hospital_contact_no: '',
    about: '',
    service_offer: [],
    archived: 0,
    created_by: 0,
    updated_by: 0,
    created_at: '',
    updated_at: '',
};
