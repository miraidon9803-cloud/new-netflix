// src/store/profileStore.ts
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
  title: string; // 프로필 이름 (ex. "오겜1")
  avatarKey: string; // 아바타 키 (ex. "default1", "오겜1")
  poster: string; // 실제 이미지 경로(/images/...)
  createdAt?: unknown; // serverTimestamp
};

type CreateProfileInput = {
  title: string;
  avatarKey: string;
  poster: string;
};

interface ProfileState {
  profiles: UserProfile[];
  activeProfileId: string | null;

  loadProfiles: () => Promise<void>;
  createProfile: (input: CreateProfileInput) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  setActiveProfile: (profileId: string) => Promise<void>;
  resetProfiles: () => void; // 로그아웃/계정변경 시 초기화용
}

const MAX_PROFILES = 5;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      resetProfiles: () => set({ profiles: [], activeProfileId: null }),

      loadProfiles: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          set({ profiles: [], activeProfileId: null });
          return;
        }

        // profiles 가져오기 (생성순)
        const colRef = collection(db, "users", currentUser.uid, "profiles");
        const q = query(colRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);

        const profiles: UserProfile[] = snap.docs.map((d) => {
          const data = d.data() as Omit<UserProfile, "id">;
          return { id: d.id, ...data };
        });

        // activeProfileId 가져오기 (users/{uid} 문서)
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        const activeProfileId = userSnap.exists()
          ? (userSnap.data() as any).activeProfileId ?? null
          : null;

        set({ profiles, activeProfileId });
      },

      createProfile: async (input) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        // 로컬 state 기준으로 1차 제한
        const nowProfiles = get().profiles;
        if (nowProfiles.length >= MAX_PROFILES) {
          throw new Error("프로필은 최대 5개까지 만들 수 있어요.");
        }

        // Firestore doc id 생성 (브라우저 crypto)
        const id = crypto.randomUUID();

        const profileRef = doc(db, "users", currentUser.uid, "profiles", id);

        const payload = {
          title: input.title,
          avatarKey: input.avatarKey,
          poster: input.poster,
          createdAt: serverTimestamp(),
        };

        await setDoc(profileRef, payload);

        // state 반영
        const nextProfiles: UserProfile[] = [
          ...nowProfiles,
          { id, ...input, createdAt: payload.createdAt },
        ];

        set({
          profiles: nextProfiles,
          // 첫 프로필 생성 시 자동 선택(원하시면 제거 가능)
          activeProfileId: get().activeProfileId ?? id,
        });

        // 첫 프로필이면 users/{uid}에 activeProfileId도 저장
        if (!get().activeProfileId) {
          await setDoc(
            doc(db, "users", currentUser.uid),
            { activeProfileId: id },
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

        // activeProfileId가 삭제된 프로필이면 재설정
        let nextActive = get().activeProfileId;
        if (nextActive === profileId) {
          nextActive = nextProfiles[0]?.id ?? null;

          // users/{uid} 업데이트
          await setDoc(
            doc(db, "users", currentUser.uid),
            { activeProfileId: nextActive },
            { merge: true }
          );
        }

        set({ profiles: nextProfiles, activeProfileId: nextActive });
      },

      setActiveProfile: async (profileId) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("로그인이 필요합니다.");

        // 존재하는 프로필인지 체크(옵션)
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
      // 굳이 전부 저장 안 해도 되지만, UX 위해 유지 추천
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);
