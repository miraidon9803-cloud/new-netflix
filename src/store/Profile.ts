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

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      resetProfiles: () => set({ profiles: [], activeProfileId: null }),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        if (!activeProfileId) return null;
        return profiles.find((p) => p.id === activeProfileId) ?? null;
      },

      loadProfiles: async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          set({ profiles: [], activeProfileId: null });
          return;
        }

        // 1) profiles 가져오기 (생성순)
        const colRef = collection(db, "users", currentUser.uid, "profiles");
        const q = query(colRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);

        const profiles: UserProfile[] = snap.docs.map((d) => {
          const data = d.data() as Omit<UserProfile, "id">;
          return { id: d.id, ...data };
        });

        // 2) activeProfileId 가져오기 (users/{uid} 문서)
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        const activeProfileId = userSnap.exists()
          ? (userSnap.data() as any).activeProfileId ?? null
          : null;

        // 3) activeProfileId가 더 이상 존재하지 않으면 보정
        const isValid =
          activeProfileId && profiles.some((p) => p.id === activeProfileId);

        const nextActive = isValid ? activeProfileId : profiles[0]?.id ?? null;

        set({ profiles, activeProfileId: nextActive });

        // 보정이 일어났다면 서버에도 반영(선택)
        if (nextActive !== activeProfileId) {
          await setDoc(
            doc(db, "users", currentUser.uid),
            { activeProfileId: nextActive },
            { merge: true }
          );
        }
      },

      createProfile: async (input) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const nowProfiles = get().profiles;

        // 로컬 state 기준으로 제한
        if (nowProfiles.length >= MAX_PROFILES) {
          throw new Error("프로필은 최대 5개까지 만들 수 있어요.");
        }

        const id = crypto.randomUUID();
        const profileRef = doc(db, "users", currentUser.uid, "profiles", id);

        const payload = {
          title: input.title,
          avatarKey: input.avatarKey,
          poster: input.poster,
          createdAt: serverTimestamp(),
        };

        await setDoc(profileRef, payload);

        const prevActive = get().activeProfileId;

        const nextProfiles: UserProfile[] = [
          ...nowProfiles,
          { id, ...input, createdAt: payload.createdAt },
        ];

        // 첫 프로필 생성 시 자동 선택(원하시면 제거 가능)
        const nextActive = prevActive ?? id;

        set({
          profiles: nextProfiles,
          activeProfileId: nextActive,
        });

        // 서버(users/{uid})에도 activeProfileId 저장
        if (!prevActive) {
          await setDoc(
            doc(db, "users", currentUser.uid),
            { activeProfileId: nextActive },
            { merge: true }
          );
        }
      },

      deleteProfile: async (profileId) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        await deleteDoc(
          doc(db, "users", currentUser.uid, "profiles", profileId)
        );

        const nextProfiles = get().profiles.filter((p) => p.id !== profileId);

        let nextActive = get().activeProfileId;

        // activeProfileId가 삭제된 프로필이면 재설정
        if (nextActive === profileId) {
          nextActive = nextProfiles[0]?.id ?? null;

          await setDoc(
            doc(db, "users", currentUser.uid),
            { activeProfileId: nextActive },
            { merge: true }
          );
        }

        set({ profiles: nextProfiles, activeProfileId: nextActive });
      },

      updateProfile: async (profileId, input) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const exists = get().profiles.some((p) => p.id === profileId);
        if (!exists) throw new Error("존재하지 않는 프로필입니다.");

        // Firestore update(merge)
        await setDoc(
          doc(db, "users", currentUser.uid, "profiles", profileId),
          {
            ...input,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // state 반영
        const nextProfiles = get().profiles.map((p) =>
          p.id === profileId ? ({ ...p, ...input } as any) : p
        );

        set({ profiles: nextProfiles });
      },

      setActiveProfile: async (profileId) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        const exists = get().profiles.some((p) => p.id === profileId);
        if (!exists) throw new Error("존재하지 않는 프로필입니다.");

        await setDoc(
          doc(db, "users", currentUser.uid),
          { activeProfileId: profileId },
          { merge: true }
        );

        set({ activeProfileId: profileId });
      },
    }),

    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),
      // 전부 저장해도 되지만, 원하시면 activeProfileId만 저장하도록 줄일 수도 있어요.
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);
