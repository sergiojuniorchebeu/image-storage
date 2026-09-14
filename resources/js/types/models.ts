export type StoredFile = {
    id: number;
    uuid: string;
    user_id: number;
    original_name: string;
    path: string;
    disk: string;
    mime_type: string;
    type: 'image' | 'pdf';
    size: number;
    url: string;
    created_at: string;
    updated_at: string;
};

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'admin';
    storage_quota_mb: number;
    is_suspended: boolean;
    files_count: number;
    used_bytes: number;
    has_api_token: boolean;
    created_at: string;
    files: StoredFile[];
};
