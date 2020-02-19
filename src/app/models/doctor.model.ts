export interface Doctor {
    doctor_name: any;
    id?: number;
    doc_name: string;
    contact_no: string;
    schedules: string;
    specialization: string;
    archived: string;
    created_by: number;
    updated_by: number;
    created_at?: string;
    updated_at?: string;
}

export const initDoc = {
    doc_name: '',
    contact_no: '',
    schedules: '',
    specialization: '',
    archived: 0,
    created_by: 0,
    updated_by: 0,
};