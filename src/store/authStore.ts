// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";

import { useProfileStore } from "./Profile";

interface KakaoSDK {
  isInitialized(): boolean;
  init(appKey: string): void;
  Auth: {
    login(options: {
      scope: string;
      success: (authObj: unknown) => void;
      fail: (err: unknown) => void;
    }): void;
  };
  API: {
    request(options: { url: string }): Promise<{
      id: number;
      kakao_account?: {
        email?: string;
        phone_number?: string;
        profile?: {
          nickname?: string;
          profile_image_url?: string;
        };
      };
    }>;
  };
}

export interface MembershipInfo {
  type: "adStandard" | "standard" | "premium";
  name: string;
  price: number;
}

export interface AppUser {
  uid: string;
  email: string;
  phone: string;
  name?: string;
  nickname?: string;
  photoURL?: string;
  provider?: string;
  createdAt: any;
  membership?: MembershipInfo;
}

export interface JoinData {
  email: string;
  password: string;
  phone: string;
}

interface AuthState {
  user: AppUser | null;

  /** ✅ onAuthStateChanged 1번이라도 타면 true */
  authReady: boolean;

  /** ✅ UI 로딩 */
  loading: boolean;

  /** 편의 상태 */
  isLogin: boolean;

  initAuth: () => () => void;

  onMember: (data: JoinData) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;

  onGoogleLogin: () => Promise<void>;
  onKakaoLogin: (navigate?: (path: string) => void) => Promise<void>;

  onLogout: () => Promise<void>;

  saveMembership: (membership: MembershipInfo) => Promise<void>;
  cancelMembership: () => Promise<void>;
  updateProfile: (data: { phone: string }) => Promise<void>;
}

const googleProvider = new GoogleAuthProvider();

const buildDefaultUser = (
  firebaseUser: FirebaseUser,
  extra?: Partial<AppUser>
): AppUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email || "",
  phone: "",
  provider: "password",
  createdAt: serverTimestamp(),
  ...extra,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      authReady: false,
      loading: true,
      isLogin: false,

      initAuth: () => {
        // ✅ init 시작할 때 로딩
        set({ loading: true });

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (!firebaseUser) {
              set({
                user: null,
                isLogin: false,
                authReady: true,
                loading: false,
              });
              useProfileStore.getState().resetProfiles();
              return;
            }

            const userRef = doc(db, "users", firebaseUser.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
              set({
                user: snap.data() as AppUser,
                isLogin: true,
                authReady: true,
                loading: false,
              });
            } else {
              const newUser = buildDefaultUser(firebaseUser);
              await setDoc(userRef, newUser, { merge: true });
              set({
                user: newUser,
                isLogin: true,
                authReady: true,
                loading: false,
              });
            }

            // ✅ 로그인 상태 확정 후 프로필 로드
            await useProfileStore.getState().loadProfiles();
          } catch (e) {
            console.error("initAuth 실패:", e);
            set({
              user: null,
              isLogin: false,
              authReady: true, // ✅ 실패해도 ready는 true로 (무한 로딩 방지)
              loading: false,
            });
          }
        });

        return unsubscribe;
      },

      onMember: async ({ email, password, phone }) => {
        set({ loading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;

          const userRef = doc(db, "users", firebaseUser.uid);

          const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            phone,
            provider: "password",
            createdAt: serverTimestamp(),
          };

          await setDoc(userRef, newUser, { merge: true });

          set({
            user: newUser,
            isLogin: true,
            authReady: true,
            loading: false,
          });

          await useProfileStore.getState().loadProfiles();
        } catch (err) {
          console.error("회원가입 실패:", err);
          set({ loading: false });
          throw err;
        }
      },

      onLogin: async (email, password) => {
        set({ loading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;

          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            set({
              user: snap.data() as AppUser,
              isLogin: true,
              authReady: true,
              loading: false,
            });
          } else {
            const defaultUser = buildDefaultUser(firebaseUser);
            await setDoc(userRef, defaultUser, { merge: true });
            set({
              user: defaultUser,
              isLogin: true,
              authReady: true,
              loading: false,
            });
          }

          await useProfileStore.getState().loadProfiles();
        } catch (err) {
          console.error("로그인 실패:", err);
          set({ loading: false });
          throw err;
        }
      },

      onGoogleLogin: async () => {
        set({ loading: true });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const gUser = result.user;

          const userRef = doc(db, "users", gUser.uid);
          const userSnap = await getDoc(userRef);

          let userInfo: AppUser;

          if (!userSnap.exists()) {
            userInfo = {
              uid: gUser.uid,
              email: gUser.email || "",
              phone: gUser.phoneNumber || "",
              name: gUser.displayName || "",
              photoURL: gUser.photoURL || "",
              provider: "google",
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, userInfo, { merge: true });
          } else {
            const data = userSnap.data() as AppUser;
            userInfo = { ...data, provider: data.provider ?? "google" };
          }

          set({
            user: userInfo,
            isLogin: true,
            authReady: true,
            loading: false,
          });

          await useProfileStore.getState().loadProfiles();
        } catch (err) {
          console.error("구글 로그인 실패:", err);
          set({ loading: false });
          throw err;
        }
      },

      onKakaoLogin: async (navigate) => {
        set({ loading: true });
        try {
          const Kakao = (window as unknown as { Kakao: KakaoSDK }).Kakao;

          if (!Kakao.isInitialized()) {
            Kakao.init("b3fc478b356ae6fee151857a00679e07");
          }

          await new Promise<unknown>((resolve, reject) => {
            Kakao.Auth.login({
              scope: "profile_nickname, profile_image",
              success: resolve,
              fail: reject,
            });
          });

          const res = await Kakao.API.request({ url: "/v2/user/me" });
          const uid: string = String(res.id);

          const kakaoUser: AppUser = {
            uid,
            email: res.kakao_account?.email ?? "",
            phone: res.kakao_account?.phone_number ?? "",
            name: res.kakao_account?.profile?.nickname ?? "카카오사용자",
            nickname: res.kakao_account?.profile?.nickname ?? "카카오사용자",
            photoURL: res.kakao_account?.profile?.profile_image_url ?? "",
            provider: "kakao",
            createdAt: serverTimestamp(),
          };

          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, kakaoUser, { merge: true });
          }

          set({
            user: kakaoUser,
            isLogin: true,
            authReady: true,
            loading: false,
          });

          // 카카오는 Firebase Auth가 아니라 rules에 막힐 수 있음 (기존 주석 유지)
          // await useProfileStore.getState().loadProfiles();

          navigate?.("/mypage/profile");
        } catch (err) {
          console.error("카카오 로그인 중 오류:", err);
          set({ loading: false });
          throw err;
        }
      },

      saveMembership: async (membership) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { membership }, { merge: true });

        set((state) => ({
          user: state.user ? { ...state.user, membership } : state.user,
        }));
      },

      cancelMembership: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { membership: deleteField() });

        set((state) => ({
          user: state.user
            ? (() => {
                const { membership, ...rest } = state.user;
                return rest;
              })()
            : state.user,
        }));
      },

      updateProfile: async ({ phone }) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { phone }, { merge: true });

        set((state) => ({
          user: state.user ? { ...state.user, phone } : state.user,
        }));
      },

      onLogout: async () => {
        await signOut(auth);
        set({ user: null, isLogin: false, loading: false, authReady: true });
        useProfileStore.getState().resetProfiles();
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLogin: state.isLogin, // ✅ 같이 저장 (첫 렌더 깜빡임 줄임)
      }),
    }
  )
);
