// src/store/Profile.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export type UserProfile = {
  id: string; // profileId (doc id)
  title: string; // 프로필 이름
  avatarKey: string; // 아바타 키
  poster: string; // 이미지 경로(/images/...)
  createdAt?: unknown; // serverTimestamp
  updatedAt?: unknown;

  // 확장 필드(선택)
  adultOnly?: boolean;
  ageLimit?: number;
  profileLock?: boolean;
  language?: string;
  pin?: string;
};

type CreateProfileInput = {
  title: string;
  avatarKey: string;
  poster: string;

  adultOnly?: boolean;
  ageLimit?: number;
  profileLock?: boolean;
  language?: string;
  pin?: string;
};

interface ProfileState {
  profiles: UserProfile[];
  activeProfileId: string | null;

  // ✅ 새로고침 튕김 방지용(서버/스토리지 복원 끝날 때까지 Gate에서 대기)
  profilesLoading: boolean;

  // helpers
  getActiveProfile: () => UserProfile | null;

  // actions
  loadProfiles: () => Promise<void>;
  createProfile: (input: CreateProfileInput) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  setActiveProfile: (profileId: string) => Promise<void>;
  resetProfiles: () => void; // 로그아웃/계정변경 시 초기화
  updateProfile: (
    profileId: string,
    input: CreateProfileInput
  ) => Promise<void>;
}

const MAX_PROFILES = 5;

// ✅ 카카오 유저 uid 가져오는 헬퍼 함수
const getUid = (): string | null => {
  // Firebase 유저 먼저 체크
  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }

  // 카카오 유저 체크 (localStorage에서)
  try {
    const stored = localStorage.getItem("auth-store");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.user?.uid) {
        return parsed.state.user.uid;
      }
    }
  } catch (e) {
    console.error("getUid 에러:", e);
  }

  return null;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      profilesLoading: false,

      resetProfiles: () =>
        set({ profiles: [], activeProfileId: null, profilesLoading: false }),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        if (!activeProfileId) return null;
        return profiles.find((p) => p.id === activeProfileId) ?? null;
      },

      loadProfiles: async () => {
        const uid = getUid();

        // ✅ 로딩 시작
        set({ profilesLoading: true });

        try {
          if (!uid) {
            set({
              profiles: [],
              activeProfileId: null,
              profilesLoading: false,
            });
            return;
          }

          // 1) profiles 가져오기 (생성순)
          const colRef = collection(db, "users", uid, "profiles");
          const q = query(colRef, orderBy("createdAt", "asc"));
          const snap = await getDocs(q);

          const profiles: UserProfile[] = snap.docs.map((d) => {
            const data = d.data() as Omit<UserProfile, "id">;
            return { id: d.id, ...data };
          });

          // 2) activeProfileId 가져오기 (users/{uid} 문서)
          const userSnap = await getDoc(doc(db, "users", uid));
          const serverActive: string | null = userSnap.exists()
            ? (userSnap.data() as any).activeProfileId ?? null
            : null;

          // 3) localStorage에 저장된 activeProfileId (persist 복원 값)
          const localActive = get().activeProfileId;

          // 우선순위: 서버 active → 로컬 active → 첫 프로필
          const candidate = serverActive ?? localActive ?? null;

          const isValid = candidate && profiles.some((p) => p.id === candidate);

          const nextActive = isValid ? candidate : profiles[0]?.id ?? null;

          set({
            profiles,
            activeProfileId: nextActive,
            profilesLoading: false,
          });

          // 4) 보정이 일어났으면 서버(users/{uid})에도 반영(선택)
          // - 서버에 값이 없거나 잘못된 값이면 정리
          if (nextActive !== serverActive) {
            await setDoc(
              doc(db, "users", uid),
              { activeProfileId: nextActive },
              { merge: true }
            );
          }
        } catch (e) {
          console.error("loadProfiles 실패:", e);
          set({ profilesLoading: false });
        }
      },

      createProfile: async (input) => {
        const uid = getUid();
        if (!uid) throw new Error("로그인이 필요합니다.");

        const nowProfiles = get().profiles;

        if (nowProfiles.length >= MAX_PROFILES) {
          throw new Error("프로필은 최대 5개까지 만들 수 있어요.");
        }

        // Firestore doc id 생성(브라우저 지원 OK)
        const id = crypto.randomUUID();
        const profileRef = doc(db, "users", uid, "profiles", id);

        const payload = {
          ...input,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(profileRef, payload);

        const prevActive = get().activeProfileId;

        const nextProfiles: UserProfile[] = [
          ...nowProfiles,
          {
            id,
            ...input,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
          },
        ];

        // 첫 프로필 생성 시 자동 선택
        const nextActive = prevActive ?? id;

        set({
          profiles: nextProfiles,
          activeProfileId: nextActive,
        });

        // 서버(users/{uid})에도 activeProfileId 저장
        if (!prevActive) {
          await setDoc(
            doc(db, "users", uid),
            { activeProfileId: nextActive },
            { merge: true }
          );
        }
      },

      deleteProfile: async (profileId) => {
        const uid = getUid();
        if (!uid) throw new Error("로그인이 필요합니다.");

        await deleteDoc(doc(db, "users", uid, "profiles", profileId));

        const nextProfiles = get().profiles.filter((p) => p.id !== profileId);

        let nextActive = get().activeProfileId;

        // activeProfileId가 삭제된 프로필이면 재설정
        if (nextActive === profileId) {
          nextActive = nextProfiles[0]?.id ?? null;

          await setDoc(
            doc(db, "users", uid),
            { activeProfileId: nextActive },
            { merge: true }
          );
        }

        set({ profiles: nextProfiles, activeProfileId: nextActive });
      },

      updateProfile: async (profileId, input) => {
        const uid = getUid();
        if (!uid) throw new Error("로그인이 필요합니다.");

        const exists = get().profiles.some((p) => p.id === profileId);
        if (!exists) throw new Error("존재하지 않는 프로필입니다.");

        // Firestore update(merge)
        await setDoc(
          doc(db, "users", uid, "profiles", profileId),
          { ...input, updatedAt: serverTimestamp() },
          { merge: true }
        );

        // state 반영
        const nextProfiles = get().profiles.map((p) =>
          p.id === profileId ? ({ ...p, ...input } as UserProfile) : p
        );

        set({ profiles: nextProfiles });
      },

      setActiveProfile: async (profileId) => {
        const uid = getUid();
        if (!uid) throw new Error("로그인이 필요합니다.");

        const exists = get().profiles.some((p) => p.id === profileId);
        if (!exists) throw new Error("존재하지 않는 프로필입니다.");

        await setDoc(
          doc(db, "users", uid),
          { activeProfileId: profileId },
          { merge: true }
        );

        set({ activeProfileId: profileId });
      },
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),

      // 진짜 필요한 것만 저장(계정 꼬임 방지)
      partialize: (state) => ({
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);
