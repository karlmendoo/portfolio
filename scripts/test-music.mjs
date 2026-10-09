import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { initialPlayback, playbackReducer } from "../lib/playback.ts";
import {
  tracks,
  featuredTrackId,
  defaultMood,
  formatTime,
} from "../lib/music.ts";
assert(tracks.some((track) => track.id === featuredTrackId));
assert.equal(
  new Set(tracks.map((track) => track.id)).size,
  tracks.length,
  "Track IDs must be unique",
);
for (const palette of [
  defaultMood,
  ...tracks.map((track) => track.moodPalette),
])
  for (const color of Object.values(palette))
    assert.match(color, /^#[\da-f]{6}$/i);

const css = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
for (const [key, variable] of Object.entries({
  primary: "ambient-primary",
  secondary: "ambient-secondary",
  accent: "ambient-accent",
  detail: "mood-detail",
}))
  assert(
    css.includes(`--${variable}: ${defaultMood[key]};`),
    "Static and active default palettes must match",
  );

let state = initialPlayback("wonderwall", true);
assert.equal(state.status, "idle", "Selecting a track does not start playback");
state = playbackReducer(state, { type: "metadata", duration: 258 });
assert.equal(state.status, "idle", "Loading metadata does not start playback");
state = playbackReducer(state, { type: "status", status: "loading" });
assert.equal(
  state.hasStarted,
  false,
  "A pending play request cannot claim success",
);
state = playbackReducer(state, { type: "status", status: "error" });
assert.equal(state.hasStarted, false, "Rejected playback cannot claim success");

state = playbackReducer(state, { type: "status", status: "playing" });
state = playbackReducer(state, { type: "time", currentTime: 42 });
assert.equal(state.hasStarted, true);
for (const status of ["paused", "loading", "ended", "error", "unavailable"]) {
  const stopped = playbackReducer(state, { type: "status", status });
  assert.notEqual(
    stopped.status,
    "playing",
    `${status} must stop active playback`,
  );
  assert.equal(stopped.currentTime, 42, `${status} should preserve progress`);
}
state = playbackReducer(state, { type: "status", status: "paused" });
state = playbackReducer(state, { type: "status", status: "playing" });
assert.equal(state.currentTime, 42, "Resume preserves the position");
state = playbackReducer(state, { type: "volume", volume: 0.3, muted: true });
state = playbackReducer(state, {
  type: "select",
  trackId: "another-track",
  available: true,
});
assert.equal(
  state.status,
  "idle",
  "A new selection must not inherit the old playing state",
);
assert.equal(state.currentTime, 0);
assert.equal(state.duration, 0);
assert.equal(state.volume, 0.3);
assert.equal(state.muted, true);
assert.equal(initialPlayback("wonderwall", false).status, "unavailable");
assert.equal(
  playbackReducer(state, { type: "metadata", duration: Infinity }).duration,
  0,
);
assert.equal(formatTime(258), "4:18");
assert.equal(formatTime(NaN), "0:00");
console.log(
  "Music checks passed: selection, metadata, failed start, play, pause, buffering, resume, end, error, track change, volume, and configuration.",
);
