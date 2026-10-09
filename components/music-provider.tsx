"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { assetPath } from "@/lib/paths";
import { defaultMood, featuredTrackId, type AvailableTrack } from "@/lib/music";
import {
  initialPlayback,
  playbackReducer,
  type PlaybackState,
} from "@/lib/playback";

type MusicContextValue = PlaybackState & {
  track: AvailableTrack;
  isPlaying: boolean;
  canChangeTrack: boolean;
  play: () => Promise<void>;
  pause: () => void;
  seek: (seconds: number) => void;
  changeTrack: (direction: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("Music controls need the MusicProvider.");
  return context;
}

function MoodController() {
  const { track, isPlaying, status } = useMusic();
  const hasActivatedMood = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.musicPlayback = status;
  }, [status]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.musicMood = isPlaying ? track.id : "default";
    // The initial CSS palette is already correct; leave the hero's first render alone.
    if (!isPlaying && !hasActivatedMood.current) return;
    hasActivatedMood.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = isPlaying ? track.moodPalette : defaultMood;
    const apply = () =>
      gsap.to(root, {
        "--ambient-primary": palette.primary,
        "--ambient-secondary": palette.secondary,
        "--ambient-accent": palette.accent,
        "--mood-detail": palette.detail,
        duration: reduced.matches ? 0.1 : 1.65,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    let transition = apply();
    const onPreferenceChange = () => {
      transition.kill();
      transition = apply();
    };
    reduced.addEventListener("change", onPreferenceChange);
    return () => {
      transition.kill();
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, [isPlaying, track.id, track.moodPalette]);

  useEffect(
    () => () => {
      const root = document.documentElement;
      for (const name of [
        "--ambient-primary",
        "--ambient-secondary",
        "--ambient-accent",
        "--mood-detail",
      ])
        root.style.removeProperty(name);
      delete root.dataset.musicMood;
      delete root.dataset.musicPlayback;
    },
    [],
  );

  return null;
}

export function MusicProvider({
  tracks,
  children,
}: {
  tracks: AvailableTrack[];
  children: ReactNode;
}) {
  const initial =
    tracks.find((track) => track.id === featuredTrackId) ?? tracks[0];
  const [state, dispatch] = useReducer(
    playbackReducer,
    initialPlayback(initial.id, initial.audioAvailable),
  );
  const track = tracks.find((item) => item.id === state.trackId) ?? initial;
  const selected = useRef(track);
  const audio = useRef<HTMLAudioElement>(null);
  const playIntent = useRef(false);
  const playRequest = useRef(0);
  const continueAfterSwitch = useRef(false);
  const audibleVolume = useRef(0.65);

  const play = useCallback(async () => {
    const element = audio.current;
    if (!element || !selected.current.audioAvailable) return;
    const request = ++playRequest.current;
    playIntent.current = true;
    if (element.error) element.load();
    if (element.ended) element.currentTime = 0;
    dispatch({ type: "status", status: "loading" });
    try {
      await element.play();
      // A cancelled or superseded request must never start a new mood.
      if (request !== playRequest.current && !playIntent.current)
        element.pause();
    } catch {
      if (request !== playRequest.current) return;
      playIntent.current = false;
      dispatch({ type: "status", status: "error" });
    }
  }, []);

  const pause = useCallback(() => {
    playIntent.current = false;
    ++playRequest.current;
    audio.current?.pause();
    if (selected.current.audioAvailable)
      dispatch({ type: "status", status: "paused" });
  }, []);

  useEffect(() => {
    if (continueAfterSwitch.current) {
      continueAfterSwitch.current = false;
      void play();
    }
  }, [track.id, play]);

  useEffect(() => {
    const element = audio.current;
    if (element) {
      try {
        element.volume = 0.65;
      } catch {
        /* Some devices use system volume only. */
      }
      dispatch({
        type: "volume",
        volume: element.volume,
        muted: element.muted,
      });
    }
    return () => {
      playIntent.current = false;
      ++playRequest.current;
      element?.pause();
    };
  }, []);

  const changeTrack = useCallback(
    (direction: number) => {
      if (tracks.length < 2) return;
      const index = tracks.findIndex((item) => item.id === selected.current.id);
      const next = tracks[(index + direction + tracks.length) % tracks.length];
      continueAfterSwitch.current =
        !!audio.current && !audio.current.paused && next.audioAvailable;
      playIntent.current = false;
      ++playRequest.current;
      audio.current?.pause();
      selected.current = next;
      dispatch({
        type: "select",
        trackId: next.id,
        available: next.audioAvailable,
      });
    },
    [tracks],
  );

  const seek = useCallback((seconds: number) => {
    const element = audio.current;
    if (!element || !Number.isFinite(element.duration)) return;
    element.currentTime = Math.max(0, Math.min(seconds, element.duration));
    dispatch({ type: "time", currentTime: element.currentTime });
  }, []);

  const setVolume = useCallback((volume: number) => {
    const element = audio.current;
    if (!element) return;
    try {
      element.volume = Math.max(0, Math.min(volume, 1));
    } catch {
      /* Keep the actual device value. */
    }
    if (volume > 0) {
      audibleVolume.current = volume;
      element.muted = false;
    }
    dispatch({ type: "volume", volume: element.volume, muted: element.muted });
  }, []);

  const toggleMute = useCallback(() => {
    const element = audio.current;
    if (!element) return;
    if (element.volume === 0) {
      try {
        element.volume = audibleVolume.current;
      } catch {
        /* Keep the actual device value. */
      }
      element.muted = false;
    } else element.muted = !element.muted;
    dispatch({ type: "volume", volume: element.volume, muted: element.muted });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      track,
      isPlaying: state.status === "playing",
      canChangeTrack: tracks.length > 1,
      play,
      pause,
      seek,
      changeTrack,
      setVolume,
      toggleMute,
    }),
    [
      state,
      track,
      tracks.length,
      play,
      pause,
      seek,
      changeTrack,
      setVolume,
      toggleMute,
    ],
  );

  const actualPlaying = () => {
    const element = audio.current;
    if (!element || element.paused || element.ended || !playIntent.current)
      return;
    const expected = new URL(
      assetPath(selected.current.audio),
      document.baseURI,
    ).href;
    if (element.currentSrc === expected && element.readyState >= 2)
      dispatch({ type: "status", status: "playing" });
  };

  return (
    <MusicContext.Provider value={value}>
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-light" />
        <div className="ambient-grain" />
      </div>
      <audio
        ref={audio}
        src={track.audioAvailable ? assetPath(track.audio) : undefined}
        preload="none"
        onPlay={() => {
          if (audio.current && !audio.current.paused) {
            playIntent.current = true;
            dispatch({ type: "status", status: "loading" });
          }
        }}
        onPlaying={actualPlaying}
        onPause={() => {
          const element = audio.current;
          if (element?.error) {
            playIntent.current = false;
            dispatch({ type: "status", status: "error" });
          } else if (selected.current.audioAvailable && element?.paused)
            dispatch({
              type: "status",
              status: audio.current?.ended ? "ended" : "paused",
            });
        }}
        onWaiting={() => dispatch({ type: "status", status: "loading" })}
        onSeeking={() => {
          if (!audio.current?.paused)
            dispatch({ type: "status", status: "loading" });
        }}
        onEnded={() => {
          playIntent.current = false;
          dispatch({ type: "status", status: "ended" });
        }}
        onError={() => {
          playIntent.current = false;
          dispatch({ type: "status", status: "error" });
        }}
        onLoadedMetadata={() =>
          dispatch({ type: "metadata", duration: audio.current?.duration ?? 0 })
        }
        onDurationChange={() =>
          dispatch({ type: "metadata", duration: audio.current?.duration ?? 0 })
        }
        onTimeUpdate={() =>
          dispatch({
            type: "time",
            currentTime: audio.current?.currentTime ?? 0,
          })
        }
        onVolumeChange={() =>
          dispatch({
            type: "volume",
            volume: audio.current?.volume ?? 0.65,
            muted: audio.current?.muted ?? false,
          })
        }
      />
      <MoodController />
      {children}
    </MusicContext.Provider>
  );
}
