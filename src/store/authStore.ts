import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db, googleProvider } from "../firebase/firebase.ts";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AuthStore, UserData } from "../types/auth";

export const useAuthStore = create<AuthStore>()(
  persist((set) => ({
    user: null,

    // 로그인 폼
    loginForm: { email: "", password: "" },
    setLoginForm: (fn) => set((state) => ({ loginForm: fn(state.loginForm) })),

    // 회원가입 폼
    joinForm: { email: "", password: "", passwordConfirm: "", phone: "" },
    setJoinForm: (fn) => set((state) => ({ joinForm: fn(state.joinForm) })),
    resetJoinForm: () =>
      set({
        joinForm: { email: "", password: "", passwordConfirm: "", phone: "" },
      }),

    // 🔹 1️⃣ 앱 최초 마운트 시 로그인 상태 유지
    initAuth: () => {
      onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            set({ user: userDoc.data() as UserData });
          } else {
            const baseUser = {
              uid: fbUser.uid,
              name: fbUser.displayName || "",
              email: fbUser.email || "",
              phone: fbUser.phoneNumber || "",
            };
            await setDoc(userRef, baseUser);
            set({ user: baseUser });
          }
        } else {
          set({ user: null });
        }
      });
    },

    // 🔹 2️⃣ 회원가입 (자동 로그인 제거)
    onMember: async ({ email, password, phone }) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = cred.user;

      const userData: UserData = {
        uid: fbUser.uid,
        email,
        phone,
        provider: "email",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", fbUser.uid), userData);

      // 🔹 자동 로그인 방지 (회원가입 후 alert가 정상 작동)
      await signOut(auth);
    },

    // 🔹 3️⃣ 로그인
    onLogin: async (email, password) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = cred.user;

      const userRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) set({ user: userDoc.data() as UserData });
      else set({ user: { uid: fbUser.uid, email: fbUser.email || "" } });
    },

    // 🔹 4️⃣ 구글 로그인
    onGoogleLogin: async () => {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newUser: UserData = {
          uid: user.uid,
          email: user.email || "",
          name: user.displayName || "",
          phone: user.phoneNumber || "",
          provider: "google",
          photoURL: user.photoURL || "",
        };
        await setDoc(userRef, newUser);
        set({ user: newUser });
      } else {
        set({ user: userDoc.data() as UserData });
      }
    },

    // 🔹 5️⃣ 로그아웃
    onLogout: async () => {
      await signOut(auth);
      set({ user: null });
    },
  }))
);
