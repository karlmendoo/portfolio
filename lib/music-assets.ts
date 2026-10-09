import { statSync } from "node:fs";
import path from "node:path";
import { tracks, type AvailableTrack } from "./music";

// Evaluated by the static build, never by a runtime server or the browser.
function hasAsset(asset: string) {
  try {
    const file = statSync(
      path.join(process.cwd(), "public", asset.replace(/^\//, "")),
    );
    return file.isFile() && file.size > 0;
  } catch {
    return false;
  }
}

export function getMusicTracks(): AvailableTrack[] {
  return tracks.map((track) => ({
    ...track,
    audioAvailable: hasAsset(track.audio),
    coverAvailable: hasAsset(track.cover),
  }));
}
