import { create } from "zustand";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthStore } from "./authStore";
import { useProfileStore } from "./Profile";

export type MediaType = "tv" | "movie";

export interface DownloadItem {
  id: number;
  mediaType: MediaType;
  title?: string; // movie
  name?: string; // tv
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string; // movie
  first_air_date?: string; // tv
  runtime?: number; // movie
  season_number?: number; // tv
  episode_number?: number; // tv
  episode_name?: string; // tv
  downloadedAt?: number;
}

interface DownloadState {
  downloads: DownloadItem[];
  onAddDownload: (item: DownloadItem) => Promise<void>;
  onRemoveDownload: (profileId: string, item: DownloadItem) => Promise<void>;
  onFetchDownloads: (profileId?: string) => Promise<void>;
  onResetDownloads: () => void;
  isDownloaded: (
    contentId: number,
    mediaType: MediaType,
    seasonNumber?: number,
    episodeNumber?: number
  ) => boolean;
}

const getUidOrThrow = () => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error("로그인이 필요합니다.");
  return user.uid;
};

const getActiveProfileIdOrThrow = () => {
  const pid = useProfileStore.getState().activeProfileId;
  if (!pid) throw new Error("프로필을 선택해주세요.");
  return pid;
};

const makeDocId = (item: DownloadItem) => {
  if (item.mediaType === "tv" && item.season_number && item.episode_number) {
    return `tv-${item.id}-s${item.season_number}-e${item.episode_number}`;
  }
  return `${item.mediaType}-${item.id}`;
};

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloads: [],

  onAddDownload: async (item) => {
    if (!item || (item.mediaType !== "tv" && item.mediaType !== "movie"))
      return;

    const hasThumb = !!(item.backdrop_path || item.poster_path);
    if (!hasThumb) return;

    const uid = getUidOrThrow();
    const profileId = getActiveProfileIdOrThrow();

    // 중복 체크
    const exists = get().downloads.some((d) => {
      if (item.mediaType === "movie") {
        return d.mediaType === "movie" && d.id === item.id;
      }
      return (
        d.mediaType === "tv" &&
        d.id === item.id &&
        d.season_number === item.season_number &&
        d.episode_number === item.episode_number
      );
    });
    if (exists) return;

    const docId = makeDocId(item);
    const ref = doc(
      db,
      "users",
      uid,
      "profiles",
      profileId,
      "downloads",
      docId
    );

    const payload: DownloadItem = {
      ...item,
      downloadedAt: Date.now(),
    };

    await setDoc(ref, payload, { merge: true });
    set({ downloads: [payload, ...get().downloads] });
  },

  onRemoveDownload: async (profileId, item) => {
    const uid = getUidOrThrow();
    const docId = makeDocId(item);

    await deleteDoc(
      doc(db, "users", uid, "profiles", profileId, "downloads", docId)
    );

    set({
      downloads: get().downloads.filter((d) => makeDocId(d) !== docId),
    });
  },

  onFetchDownloads: async (profileIdParam) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const profileId =
      profileIdParam ?? useProfileStore.getState().activeProfileId;
    if (!profileId) {
      set({ downloads: [] });
      return;
    }

    const snap = await getDocs(
      collection(db, "users", user.uid, "profiles", profileId, "downloads")
    );

    const data = snap.docs.map((d) => d.data() as DownloadItem);
    data.sort((a, b) => (b.downloadedAt ?? 0) - (a.downloadedAt ?? 0));

    set({ downloads: data });
  },

  onResetDownloads: () => set({ downloads: [] }),

  isDownloaded: (contentId, mediaType, seasonNumber, episodeNumber) => {
    return get().downloads.some((d) => {
      if (mediaType === "movie") {
        return d.mediaType === "movie" && d.id === contentId;
      }
      return (
        d.mediaType === "tv" &&
        d.id === contentId &&
        d.season_number === seasonNumber &&
        d.episode_number === episodeNumber
      );
    });
  },
}));
