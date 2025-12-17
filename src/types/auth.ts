// types/auth.ts

import type { JoinData } from "../store/authStore";

export interface LoginForm {
  email: string;
  password: string;
}

// Firestore 사용자 정보 타입
export interface UserData {
  uid: string;
  email: string;
  name?: string;
  password?: string;
  phone?: string;
  nickname?: string;
  photoURL?: string;
  provider?: "password" | "google" | "kakao";
  createdAt?: Date;
}
// 회원가입용 타입
export interface JoinForm {
  email: string;
  password: string;
  phone: string;
}

export type NavigateFn = (path: string) => void;

export type MembershipType = "adStandard" | "standard" | "premium";

export interface MembershipInfo {
  type: MembershipType;
  name: string;
  price: number;
}

export interface AuthStore {
  // 상태
  user: UserData | null;
  isJoin: boolean;
  loginForm: LoginForm;

  setLoginForm: (fn: (prev: LoginForm) => LoginForm) => void;
  initAuth: () => void;
  onMember: (data: JoinData) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onKakaoLogin: (navigate: (path: string) => void) => Promise<void>;
  onLogout: () => Promise<void>;
  saveMembership: (membership: MembershipInfo) => Promise<void>;
  cancelMembership: () => Promise<void>;
  updateProfile: (data: { phone: string }) => Promise<void>;
}
