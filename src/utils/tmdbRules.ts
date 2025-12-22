// src/utils/tmdbRules.ts

import type { FlowValue } from "../types/flow";
import type { ToneValue } from "../types/tone";
import type { MoodValue } from "../types/mood";

export const getTone = (item: any): ToneValue => {
  const g: number[] = item.genre_ids ?? [];

  // 웃을 수 있는: 코미디, 가족
  if (g.some((id) => [35, 10751].includes(id))) {
    return "funny";
  }

  // 긴장감 있는: 스릴러, 범죄
  if (g.some((id) => [53, 80].includes(id))) {
    return "tense";
  }

  // 어두운: 공포, 미스터리
  if (g.some((id) => [27, 9648].includes(id))) {
    return "dark";
  }

  // 몽환적인: 판타지, SF
  if (g.some((id) => [14, 878].includes(id))) {
    return "dreamy";
  }

  // 따뜻한: 로맨스, 드라마
  if (g.some((id) => [10749, 18].includes(id))) {
    return "warm";
  }

  // 기본값
  return "calm";
};
/* flow 규칙 */
export const getFlow = (item: any): FlowValue => {
  const runtime =
    item.runtime ??
    (item.episode_run_time?.length ? item.episode_run_time[0] : null);

  if (runtime && runtime <= 90) return "light";
  if (item.vote_count > 4000) return "binge";
  if (item.vote_average >= 8) return "immersive";
  return "medium";
};

/* mood 규칙 (Step1 대응) */
export const getMood = (item: any): MoodValue => {
  if (item.genre_ids?.includes(18) && item.vote_average >= 7.5) return "deep";

  if (item.genre_ids?.includes(53) || item.genre_ids?.includes(27))
    return "stimulating";

  if (item.genre_ids?.includes(35)) return "calm";

  if (item.genre_ids?.includes(14) || item.genre_ids?.includes(878))
    return "escape";

  return "blank";
};
