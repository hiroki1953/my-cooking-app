import { UserGroup } from "@/types/group";

export interface LoginResponse {
  user: User;
  groups: UserGroup[];
  access_token: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Session {
  access_token: string;
}

export interface UserAuthResponse {
  user: User;
  session: Session;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      display_name?: string;
    } | null;
  };
}
