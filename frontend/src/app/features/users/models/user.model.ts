import { Permission } from '../../roles/models/permission.model';

export interface User {
  id: string;
  username: string;
  email: string;
  role_id?: number;
  role_name?: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  last_edited_at?: string | null;
  last_edited_by_username?: string | null;
  permissions: Permission[];
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  password?: string;
  roleId: number;
  isActive: boolean;
}
