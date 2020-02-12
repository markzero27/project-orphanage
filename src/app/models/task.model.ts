export interface Task {
    id?: number;
    elder_id: number;
    elder_name: string;
    medicine_id: number;
    medicine_description: string;
    qty: number;
    time: string;
    date: string;
    status: string;
    task_description: string;
    task_owner_id: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updatedAt?: string;
}

export const initialTask: Task = {
    elder_id: 0,
    elder_name: '',
    medicine_id: 0,
    medicine_description: '',
    qty: 0,
    time: '',
    date: '',
    status: '',
    task_description: '',
    task_owner_id: 0,
    created_by: 0,
    updated_by: 0,
};
