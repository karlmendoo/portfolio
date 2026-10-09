"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { assetPath } from "@/lib/paths";
import { formatTime } from "@/lib/music";
import { useMusic } from "./music-provider";

function PlaybackIcon({ paused }: { paused: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paused ? (
        <path d="M8 4v16l13-8Z" />
      ) : (
        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
      )}
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4Z" />
      {muted ? (
        <path d="m17 9 5 6m0-6-5 6" />
      ) : (
        <path d="M17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
      )}
    </svg>
  );
}

function PlayButton({ compact = false }: { compact?: boolean }) {
  const { track, status, isPlaying, play, pause } = useMusic();
  const loading = status === "loading";
  const label = loading
    ? "Cancel playback"
    : `${isPlaying ? "Pause" : "Play"} ${track.title} by ${track.artist}`;
  return (
    <button
      className={compact ? "mini-play" : "music-play"}
      type="button"
      aria-label={label}
      disabled={!track.audioAvailable}
      data-cursor={
        track.audioAvailable
          ? isPlaying || loading
            ? "PAUSE"
            : "PLAY"
          : undefined
      }
      onClick={() => (isPlaying || loading ? pause() : void play())}
    >
      <PlaybackIcon paused={!isPlaying && !loading} />
      {!compact && (
        <span className="mono">
          {loading ? "CANCEL" : isPlaying ? "PAUSE" : "PLAY"}
        </span>
      )}
    </button>
  );
}

function MusicArtwork() {
  const { track } = useMusic();
  const [failedCover, setFailedCover] = useState<string | null>(null);
  const hasCover = track.coverAvailable && failedCover !== track.cover;
  return (
    <figure className="music-art-reveal">
      <div className="music-art-object">
        {hasCover ? (
          <img
            className="music-cover"
            src={assetPath(track.cover)}
            alt={`${track.title} artwork`}
            width={640}
            height={640}
            loading="lazy"
            decoding="async"
            onError={() => setFailedCover(track.cover)}
          />
        ) : (
          <div
            className="music-cover-placeholder"
            role="img"
            aria-label="Abstract blue artwork, a personal listening note"
          >
            <span className="music-cover-top mono">NKM / LISTENING NOTES</span>
            <div className="music-cover-orbit" aria-hidden="true" />
            <div className="music-cover-window" aria-hidden="true" />
            <span className="music-cover-word" aria-hidden="true">
              a little
              <br />
              <em>feeling.</em>
            </span>
            <span className="music-cover-bottom mono">
              SOUNDTRACK TO THE EVERYDAY <span>01</span>
            </span>
          </div>
        )}
      </div>
      <figcaption className="mono">
        {hasCover
          ? "A PERSONAL LISTENING NOTE"
          : "PERSONAL LISTENING NOTE / ARTWORK PLACEHOLDER"}
      </figcaption>
    </figure>
  );
}

const statusLabels = {
  idle: "READY WHEN YOU ARE",
  loading: "LOADING",
  playing: "PLAYING",
  paused: "PAUSED",
  ended: "FINISHED",
  unavailable: "A LISTENING NOTE, FOR NOW",
  error: "PLAYBACK UNAVAILABLE",
};

export function MusicPlayer() {
  const music = useMusic();
  const { track, currentTime, duration, volume, muted, isPlaying, status } =
    music;
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const quiet = muted || volume === 0;

  return (
    <section
      id="listening"
      className={`music section${isPlaying ? " is-playing" : ""}`}
      aria-labelledby="music-heading"
    >
      <div className="section-label">
        <span>07 / ON REPEAT</span>
        <span className="label-line" />
        <span>A PERSONAL LISTENING NOTE</span>
      </div>
      <div className="music-heading">
        <h2 id="music-heading">
          What I’m
          <br />
          <em>feeling.</em>
        </h2>
        <p className="music-mood mono">
          CURRENT FEELING <span>{track.mood}</span>
        </p>
      </div>
      <div className="music-layout">
        <MusicArtwork />
        <div className="music-controls">
          <div className="music-track-top mono">
            <span>CURRENTLY ON REPEAT</span>
            <span className="music-equalizer" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <h3 className="music-title">{track.title}</h3>
          <p className="music-artist mono">{track.artist}</p>
          <div className="music-seek">
            <input
              type="range"
              className="music-range"
              aria-label={`Seek in ${track.title}`}
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              min={0}
              max={duration || 1}
              step={0.1}
              value={Math.min(currentTime, duration || 1)}
              disabled={!track.audioAvailable || duration === 0}
              onChange={(event) => music.seek(Number(event.target.value))}
              style={{ "--range-progress": `${progress}%` } as CSSProperties}
            />
            <div className="music-time mono" aria-live="off">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : "—:——"}</span>
            </div>
          </div>
          <div className="music-transport">
            <button
              className="music-skip"
              type="button"
              aria-label="Previous track"
              disabled={!music.canChangeTrack}
              onClick={() => music.changeTrack(-1)}
              data-cursor="PREV"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5h2v14H5zM19 5v14L8 12Z" />
              </svg>
            </button>
            <PlayButton />
            <button
              className="music-skip"
              type="button"
              aria-label="Next track"
              disabled={!music.canChangeTrack}
              onClick={() => music.changeTrack(1)}
              data-cursor="NEXT"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 5h2v14h-2zM5 5v14l11-7Z" />
              </svg>
            </button>
          </div>
          <div className="music-bottom">
            <span
              id="music-status"
              className="music-status mono"
              role="status"
              aria-live="polite"
            >
              {statusLabels[status]}
            </span>
            <div className="music-volume">
              <button
                className="music-mute"
                type="button"
                aria-label={quiet ? "Unmute audio" : "Mute audio"}
                disabled={!track.audioAvailable}
                onClick={music.toggleMute}
              >
                <VolumeIcon muted={quiet} />
              </button>
              <input
                type="range"
                className="music-range volume-range"
                aria-label="Audio volume"
                aria-valuetext={`${Math.round(volume * 100)} percent${muted ? ", muted" : ""}`}
                min={0}
                max={1}
                step={0.01}
                value={volume}
                disabled={!track.audioAvailable}
                onChange={(event) =>
                  music.setVolume(Number(event.target.value))
                }
                style={
                  { "--range-progress": `${volume * 100}%` } as CSSProperties
                }
              />
            </div>
          </div>
          {status === "unavailable" && (
            <p className="music-note">The soundtrack will be here soon.</p>
          )}
          {status === "error" && (
            <p className="music-note">
              The track couldn’t start. You can try again, or enjoy the quiet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function MiniPlayer() {
  const { track, status, hasStarted, isPlaying } = useMusic();
  const [inView, setInView] = useState(true);
  const [dock, setDock] = useState<HTMLElement | null>(null);
  const mainPlayer = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainPlayer.current = document.getElementById("listening");
    setDock(document.getElementById("music-dock"));
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    if (mainPlayer.current) observer.observe(mainPlayer.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "music-mini-visible",
      hasStarted && !inView,
    );
    return () =>
      document.documentElement.classList.remove("music-mini-visible");
  }, [hasStarted, inView]);

  if (!hasStarted || inView || !dock) return null;
  return createPortal(
    <aside className="mini-player" aria-label="Music player">
      <span
        className={`mini-indicator${isPlaying ? " active" : ""}`}
        aria-hidden="true"
      />
      <a href="#listening" className="mini-track">
        <span className="mono">
          {isPlaying
            ? "NOW PLAYING"
            : status === "ended"
              ? "FINISHED"
              : "ON REPEAT"}
        </span>
        <span>
          {track.title} <small>— {track.artist}</small>
        </span>
      </a>
      <PlayButton compact />
    </aside>,
    dock,
  );
}
