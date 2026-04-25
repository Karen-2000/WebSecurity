export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface SessionResponse {
  user: SessionUser | null;
}
