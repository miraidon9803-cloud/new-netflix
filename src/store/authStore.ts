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

/** Kakao SDK 타입 */
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

  /**  onAuthStateChanged 1번이라도 타면 true */
  authReady: boolean;

  /**  UI 로딩 */
  loading: boolean;

  /** 편의 상태 */
  isLogin: boolean;

  /**  멤버십까지 완료(온보딩 완료) */
  onboardingDone: boolean;
  tempMembership: MembershipInfo | null;

  /**  Join 단계에서 임시 저장(비밀번호 포함 → persist 금지) */
  tempJoin: JoinData | null;
  setTempJoin: (data: JoinData) => void;
  clearTempJoin: () => void;

  initAuth: () => () => void;

  /**
   *  (호환용) 기존 Join이 onMember를 호출해도 "회원생성" 안 되도록 변경
   * - 이제 회원생성은 Membership에서 finalizeJoinWithComplete로만 합니다.
   */
  onMember: (data: JoinData) => Promise<void>;

  /** 기존 로그인 */
  onLogin: (email: string, password: string) => Promise<void>;

  onGoogleLogin: () => Promise<void>;
  onKakaoLogin: (navigate?: (path: string) => void) => Promise<void>;

  onLogout: () => Promise<void>;

  /**  Complete에서 최종 회원가입 + 멤버십 저장 + 로그인 완료 */
  finalizeJoinWithComplete: (membership: MembershipInfo) => Promise<void>;

  /** 기존 로그인 유저의 멤버십 저장/변경 */
  saveMembership: (membership: MembershipInfo) => Promise<void>;
  cancelMembership: () => Promise<void>;
  updateProfile: (data: { phone: string }) => Promise<void>;

  setTempMembership: (m: MembershipInfo) => void;
  clearTempMembership: () => void;
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
      onboardingDone: false,

      tempJoin: null,
      tempMembership: null,
      setTempMembership: (m) => set({ tempMembership: m }),
      clearTempMembership: () => set({ tempMembership: null }),

      setTempJoin: (data) => set({ tempJoin: data }),
      clearTempJoin: () => set({ tempJoin: null }),

      initAuth: () => {
        set({ loading: true });

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (!firebaseUser) {
              set({
                user: null,
                isLogin: false,
                onboardingDone: false,
                authReady: true,
                loading: false,
              });
              useProfileStore.getState().resetProfiles();
              return;
            }

            const userRef = doc(db, "users", firebaseUser.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
              const data = snap.data() as AppUser;

              set({
                user: data,
                isLogin: true,
                onboardingDone: !!data.membership,
                authReady: true,
                loading: false,
              });
            } else {
              const newUser = buildDefaultUser(firebaseUser);
              await setDoc(userRef, newUser, { merge: true });

              set({
                user: newUser,
                isLogin: true,
                onboardingDone: !!newUser.membership,
                authReady: true,
                loading: false,
              });
            }

            await useProfileStore.getState().loadProfiles();
          } catch (e) {
            console.error("initAuth 실패:", e);
            set({
              user: null,
              isLogin: false,
              onboardingDone: false,
              authReady: true,
              loading: false,
            });
          }
        });

        return unsubscribe;
      },

      /**
       * ✅ 이제 onMember는 "임시 저장"만 합니다.
       * (기존 Join 코드가 아직 onMember를 호출해도 안전하게 동작)
       */
      onMember: async ({ email, password, phone }) => {
        set({ tempJoin: { email, password, phone } });
      },

      /**
       * ✅ Membership 화면에서 호출:
       * - tempJoin으로 Firebase 계정 생성
       * - Firestore users 문서 생성 (membership 포함)
       * - 로그인/온보딩 완료 처리
       */
      finalizeJoinWithComplete: async (membership) => {
        const temp = get().tempJoin;
        if (!temp)
          throw new Error("회원가입 정보가 없습니다. 다시 진행해주세요.");

        set({ loading: true });

        try {
          // 1) 회원 생성 (이 순간 Firebase가 자동 로그인 시킴)
          const cred = await createUserWithEmailAndPassword(
            auth,
            temp.email,
            temp.password
          );
          const firebaseUser = cred.user;

          // 2) Firestore 저장
          const userRef = doc(db, "users", firebaseUser.uid);

          const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || temp.email,
            phone: temp.phone,
            provider: "password",
            createdAt: serverTimestamp(),
            membership,
          };

          await setDoc(userRef, newUser, { merge: true });

          // ✅ 3) "로그인 상태로 두지 않기" → 즉시 로그아웃
          await signOut(auth);

          // ✅ 4) 전역 상태도 로그아웃 상태로 정리
          set({
            user: null,
            isLogin: false,
            onboardingDone: false, // 로그인 안 했으니 여기서는 false로 둠
            authReady: true,
            loading: false,
            tempJoin: null, // 비밀번호 포함 데이터 즉시 제거
          });

          useProfileStore.getState().resetProfiles();
        } catch (err) {
          console.error("finalizeJoinWithComplete 실패:", err);
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
            const data = snap.data() as AppUser;

            set({
              user: data,
              isLogin: true,
              onboardingDone: !!data.membership,
              authReady: true,
              loading: false,
            });
          } else {
            const defaultUser = buildDefaultUser(firebaseUser);
            await setDoc(userRef, defaultUser, { merge: true });

            set({
              user: defaultUser,
              isLogin: true,
              onboardingDone: !!defaultUser.membership,
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
            onboardingDone: !!userInfo.membership,
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

          let finalUser: AppUser = kakaoUser;

          if (!userSnap.exists()) {
            await setDoc(userRef, kakaoUser, { merge: true });
          } else {
            const data = userSnap.data() as AppUser;
            finalUser = { ...data, ...kakaoUser, provider: "kakao" };
          }

          set({
            user: finalUser,
            isLogin: true,
            onboardingDone: !!finalUser.membership,
            authReady: true,
            loading: false,
          });

          // ✅ 온보딩 여부에 따라 이동
          if (finalUser.membership) {
            navigate?.("/mypage/profile");
          } else {
            navigate?.("/auth");
          }
        } catch (err) {
          console.error("카카오 로그인 중 오류:", err);
          set({ loading: false });
          throw err;
        }
      },

      /**
       * ✅ 기존 로그인 유저가 멤버십 선택/변경할 때 사용
       * (신규 회원가입 플로우는 finalizeJoinWithComplete를 사용)
       */
      saveMembership: async (membership) => {
        const currentUser = auth.currentUser;
        const uid = currentUser?.uid ?? get().user?.uid;
        if (!uid) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { membership }, { merge: true });

        set((state) => ({
          user: state.user ? { ...state.user, membership } : state.user,
          onboardingDone: true,
        }));
      },

      cancelMembership: async () => {
        const currentUser = auth.currentUser;
        const uid = currentUser?.uid ?? get().user?.uid;
        if (!uid) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, { membership: deleteField() });

        set((state) => ({
          user: state.user
            ? (() => {
                const { membership, ...rest } = state.user;
                return rest;
              })()
            : state.user,
          onboardingDone: false,
        }));
      },

      updateProfile: async ({ phone }) => {
        const currentUser = auth.currentUser;
        const uid = currentUser?.uid ?? get().user?.uid;
        if (!uid) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { phone }, { merge: true });

        set((state) => ({
          user: state.user ? { ...state.user, phone } : state.user,
        }));
      },

      onLogout: async () => {
        await signOut(auth);
        set({
          user: null,
          isLogin: false,
          onboardingDone: false,
          loading: false,
          authReady: true,
          tempJoin: null,
        });
        useProfileStore.getState().resetProfiles();
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),

      /**
       * ✅ 보안상 tempJoin(비밀번호 포함)은 절대 저장하면 안 됩니다.
       * 그래서 partialize에서 제외합니다.
       */
      partialize: (state) => ({
        user: state.user,
        isLogin: state.isLogin,
        onboardingDone: state.onboardingDone,
      }),
    }
  )
);
