import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { create } from "zustand";
import { auth, db, googleProvider } from "../firebase/firebase.ts";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AuthStore, UserData } from "../types/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isJoin: false,

  loginForm: { email: "", password: "" },

  setLoginForm: (fn) =>
    set((state) => ({
      loginForm: fn(state.loginForm),
    })),

  // 로그인 유지
  initAuth: () => {
    onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userRef = doc(db, "users", fbUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          set({ user: userDoc.data() as UserData });
        } else {
          const basicUser: UserData = {
            uid: fbUser.uid,
            name: fbUser.displayName || "",
            email: fbUser.email || "",
            phone: fbUser.phoneNumber || "",
          };

          await setDoc(userRef, basicUser);
          set({ user: basicUser });
        }
      } else {
        set({ user: null });
      }
    });
  },

  // 회원가입
  onMember: async ({ email, password, phone }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const fbUser = userCredential.user;

      const userData: UserData = {
        uid: fbUser.uid,
        email,
        password,
        phone,
        provider: "email",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", fbUser.uid), userData);
      set({ user: userData });

      console.log("회원가입 + Firestore 저장 성공");
    } catch (err: unknown) {
      const error = err as Error;
      console.log("회원가입 실패:", error.message);
      throw error;
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

      const fbUser = userCredential.user;

      const userRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        set({ user: userDoc.data() as UserData });
      } else {
        set({
          user: {
            uid: fbUser.uid,
            email: fbUser.email || "",
          },
        });
      }

      return fbUser;
    } catch (err: unknown) {
      const error = err as Error;
      console.log("로그인 실패:", error.message);
      throw error;
    }
  },

  // 구글 로그인
  onGoogleLogin: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const userInfo: UserData = {
          uid: user.uid,
          email: user.email || "",
          name: user.displayName || "",
          nickname: "",
          phone: user.phoneNumber || "",
          photoURL: user.photoURL || "",
          provider: "google",
        };

        await setDoc(userRef, userInfo);
        set({ user: userInfo });
      } else {
        set({ user: userDoc.data() as UserData });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.log(error.message);
    }
  },

  // 로그아웃
  onLogout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
