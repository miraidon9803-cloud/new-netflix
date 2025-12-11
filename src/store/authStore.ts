import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase.ts";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { create } from "zustand";

// 커스텀 유저 타입 정의
export interface AppUser {
  uid: string;
  email: string;
  phone: string;
  createdAt: Date;
}

// 회원가입 데이터 타입
export interface JoinData {
  email: string;
  password: string;
  phone: string;
}

// Zustand 상태 타입
interface AuthState {
  user: AppUser | null;
  onMember: (data: JoinData) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // 회원가입
  onMember: async ({ email, password, phone }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        phone,
        createdAt: new Date(),
      };

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);

      set({ user: newUser });
      alert("회원가입 완료");
    } catch (err) {
      if (err instanceof Error) {
        console.error("회원가입 실패:", err.message);
      } else {
        console.error("회원가입 실패:", err);
      }
      alert("회원가입 실패");
    }
  },

  // 로그인
  onLogin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Firestore에서 정보 불러오기
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        set({ user: userDoc.data() as AppUser });
      } else {
        // Firestore에 사용자 정보가 없으면 기본 정보만 저장
        const defaultUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          phone: "",
          createdAt: new Date(),
        };

        set({ user: defaultUser });
      }

      alert("로그인 성공");
    } catch (err) {
      if (err instanceof Error) {
        console.error("로그인 실패:", err.message);
      } else {
        console.error("로그인 실패:", err);
      }
      alert("로그인 실패");
    }
  },

  // 로그아웃
  onLogout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
