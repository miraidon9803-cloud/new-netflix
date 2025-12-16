// src/store/authStore.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { create } from "zustand";
import { GoogleAuthProvider } from "firebase/auth";
import { persist, createJSONStorage } from "zustand/middleware";

// Kakao SDK 타입 정의
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

// 커스텀 유저 타입 정의
export interface AppUser {
  uid: string;
  email: string;
  phone: string;
  name?: string;
  nickname?: string;
  photoURL?: string;
  provider?: string;
  createdAt: Date;
  membership?: MembershipInfo;
}

// 회원가입 데이터 타입
export interface JoinData {
  email: string;
  password: string;
  phone: string;
}

export interface MembershipInfo {
  type: "adStandard" | "standard" | "premium";
  name: string;
  price: number;
}

// Zustand 상태 타입
interface AuthState {
  user: AppUser | null;
  loading: boolean;
  initAuth: () => () => void; // unsubscribe 반환

  onMember: (data: JoinData) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onKakaoLogin: (navigate: (path: string) => void) => Promise<void>;
  onLogout: () => Promise<void>;
  saveMembership: (membership: MembershipInfo) => Promise<void>;

  updateProfile: (data: { phone: string }) => Promise<void>;
  cancelMembership: () => Promise<void>;
}

const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      initAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (!firebaseUser) {
              set({ user: null, loading: false });
              return;
            }

            // Firestore에 저장된 유저 데이터 가져오기
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

            if (userDoc.exists()) {
              set({ user: userDoc.data() as AppUser, loading: false });
            } else {
              // 문서 없으면 기본 유저 구성
              const defaultUser: AppUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                phone: "",
                createdAt: new Date(),
              };
              set({ user: defaultUser, loading: false });
            }
          } catch (e) {
            console.error("initAuth 실패:", e);
            set({ user: null, loading: false });
          }
        });

        return unsubscribe;
      },

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

          await setDoc(doc(db, "users", firebaseUser.uid), newUser);

          set({ user: newUser });
          alert("회원가입 완료");
        } catch (err) {
          console.error("회원가입 실패:", err);
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
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            set({ user: userDoc.data() as AppUser });
          } else {
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
          console.error("로그인 실패:", err);
          alert("로그인 실패");
        }
      },

      // 구글 로그인
      onGoogleLogin: async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;

          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          let userInfo: AppUser;

          if (!userSnap.exists()) {
            userInfo = {
              uid: user.uid,
              email: user.email || "",
              phone: user.phoneNumber || "",
              name: user.displayName || "",
              photoURL: user.photoURL || "",
              provider: "google",
              createdAt: new Date(),
            };

            await setDoc(userRef, userInfo);
          } else {
            const data = userSnap.data() as AppUser;
            userInfo = {
              ...data,
              provider: data.provider ?? "google",
            };
          }

          set({ user: userInfo });
          alert("구글 로그인 성공!");
        } catch (err) {
          console.error("구글 로그인 실패:", err);
        }
      },

      // 카카오 로그인
      onKakaoLogin: async (navigate: (path: string) => void) => {
        try {
          const Kakao = (window as unknown as { Kakao: KakaoSDK }).Kakao;

          if (!Kakao.isInitialized()) {
            Kakao.init("b3fc478b356ae6fee151857a00679e07");
            console.log("Kakao SDK 초기화 완료");
          }

          const authObj = await new Promise<unknown>((resolve, reject) => {
            Kakao.Auth.login({
              scope: "profile_nickname, profile_image",
              success: resolve,
              fail: reject,
            });
          });

          console.log("카카오 로그인 성공:", authObj);

          const res = await Kakao.API.request({
            url: "/v2/user/me",
          });

          console.log("카카오 사용자 정보:", res);

          const uid: string = String(res.id);

          const kakaoUser: AppUser = {
            uid,
            email: res.kakao_account?.email ?? "",
            phone: res.kakao_account?.phone_number ?? "",
            name: res.kakao_account?.profile?.nickname ?? "카카오사용자",
            nickname: res.kakao_account?.profile?.nickname ?? "카카오사용자",
            photoURL: res.kakao_account?.profile?.profile_image_url ?? "",
            provider: "kakao",
            createdAt: new Date(),
          };

          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, kakaoUser);
            console.log("신규 카카오 회원 Firestore에 등록 완료");
          } else {
            console.log("기존 카카오 회원 Firestore 데이터 있음");
          }

          set({ user: kakaoUser });

          alert(`${kakaoUser.nickname}님, 카카오 로그인 성공!`);

          if (navigate) {
            navigate("/mypage");
          }
        } catch (err) {
          console.error("카카오 로그인 중 오류:", err);
        }
      },

      cancelMembership: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", currentUser.uid);

        await updateDoc(userRef, {
          membership: deleteField(),
        });

        set((state) => ({
          user: state.user
            ? (() => {
                const { membership, ...rest } = state.user;
                return rest;
              })()
            : state.user,
        }));
      },

      // 로그아웃
      onLogout: async () => {
        await signOut(auth);
        set({ user: null });
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

      //멤버쉽저장
      //멤버쉽저장
      saveMembership: async (membership) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const userRef = doc(db, "users", currentUser.uid);

        await setDoc(userRef, { membership }, { merge: true });

        set((state) => ({
          user: state.user ? { ...state.user, membership } : state.user,
        }));
      },
    }),
    {
      name: "auth-store", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // user만 저장
    }
  )
);
