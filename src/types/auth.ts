// types/auth.ts

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
  provider?: string;
  createdAt?: Date;
}
// 회원가입용 타입
export interface JoinForm {
  email: string;
  password: string;
  phone: string;
}

export type NavigateFn = (path: string) => void;

export interface AuthStore {
  // 상태
  user: UserData | null;
  isJoin: boolean;
  loginForm: LoginForm;

  setLoginForm: (fn: (prev: LoginForm) => LoginForm) => void;
  initAuth: () => void;
  onMember: (data: JoinForm) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<UserData>;
  onGoogleLogin: () => Promise<void>;
  onKakaoLogin: (navigate?: NavigateFn) => Promise<void>;
  onLogout: () => Promise<void>;
}
