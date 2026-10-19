const KEY = "sh2-trainer-v1";

export type Progress = {
  lessons: Record<string, boolean>;
  bestScore: number;
  attempts: number;
  lastScore: number;
};

const empty: Progress = { lessons: {}, bestScore: 0, attempts: 0, lastScore: 0 };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty, lessons: {} };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty, lessons: {} };
  }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
