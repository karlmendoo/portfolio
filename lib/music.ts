export type MoodPalette = {
  primary: string;
  secondary: string;
  accent: string;
  detail: string;
};

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  audio: string;
  cover: string;
  mood: string;
  moodPalette: MoodPalette;
};

export type AvailableTrack = MusicTrack & {
  audioAvailable: boolean;
  coverAvailable: boolean;
};

export const defaultMood: MoodPalette = {
  primary: "#eaf3ff",
  secondary: "#d4e8fb",
  accent: "#bdd6ee",
  detail: "#386c96",
};

export const featuredTrackId = "wonderwall";

export const tracks: MusicTrack[] = [
  {
    id: "wonderwall",
    title: "Wonderwall",
    artist: "Oasis",
    audio: "/music/wonderwall.mp3",
    cover: "/music/wonderwall-cover.webp",
    mood: "Nostalgic",
    moodPalette: {
      primary: "#e9eff5",
      secondary: "#efe6d4",
      accent: "#d8c7a5",
      detail: "#806d51",
    },
  },
];

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
