export type PlaybackStatus =
  "idle" | "loading" | "playing" | "paused" | "ended" | "unavailable" | "error";

export type PlaybackState = {
  trackId: string;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  hasStarted: boolean;
};

export type PlaybackAction =
  | { type: "select"; trackId: string; available: boolean }
  | { type: "status"; status: PlaybackStatus }
  | { type: "time"; currentTime: number }
  | { type: "metadata"; duration: number }
  | { type: "volume"; volume: number; muted: boolean };

export function initialPlayback(
  trackId: string,
  available: boolean,
): PlaybackState {
  return {
    trackId,
    status: available ? "idle" : "unavailable",
    currentTime: 0,
    duration: 0,
    volume: 0.65,
    muted: false,
    hasStarted: false,
  };
}

export function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction,
): PlaybackState {
  switch (action.type) {
    case "select":
      return {
        ...initialPlayback(action.trackId, action.available),
        volume: state.volume,
        muted: state.muted,
      };
    case "status":
      return {
        ...state,
        status: action.status,
        hasStarted: state.hasStarted || action.status === "playing",
      };
    case "time":
      return { ...state, currentTime: Math.max(0, action.currentTime) };
    case "metadata":
      return {
        ...state,
        duration: Number.isFinite(action.duration)
          ? Math.max(0, action.duration)
          : 0,
      };
    case "volume":
      return { ...state, volume: action.volume, muted: action.muted };
  }
}
