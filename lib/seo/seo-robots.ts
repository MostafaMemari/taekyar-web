export interface RobotsUiState {
  indexing: "index" | "noindex";
  following: "follow" | "nofollow";
  imagePreview: "default" | "standard" | "large" | "none";
  maxSnippet: RobotsValueState;
  maxVideoPreview: RobotsValueState;
}

export interface RobotsValueState {
  mode: "default" | "unlimited" | "custom";
  value: string;
}

export const DEFAULT_ROBOTS_UI_STATE: RobotsUiState = {
  indexing: "index",
  following: "follow",
  imagePreview: "default",
  maxSnippet: { mode: "default", value: "" },
  maxVideoPreview: { mode: "default", value: "" },
};

function parseValueDirective(raw: string | undefined): RobotsValueState {
  if (raw === undefined) return { mode: "default", value: "" };
  const parsed = Number(raw);
  if (raw === "-1") return { mode: "unlimited", value: "" };
  if (Number.isInteger(parsed) && parsed >= 0) return { mode: "custom", value: String(parsed) };
  return { mode: "default", value: "" };
}

export function parseRobotsUiState(value: string | null | undefined): RobotsUiState {
  const state: RobotsUiState = {
    ...DEFAULT_ROBOTS_UI_STATE,
    maxSnippet: { ...DEFAULT_ROBOTS_UI_STATE.maxSnippet },
    maxVideoPreview: { ...DEFAULT_ROBOTS_UI_STATE.maxVideoPreview },
  };
  if (!value) return state;

  for (const raw of value.split(/[،,]/)) {
    const entry = raw.trim().toLowerCase();
    if (!entry) continue;

    const separatorIndex = entry.indexOf(":");
    const key = separatorIndex === -1 ? entry : entry.slice(0, separatorIndex).trim();
    const rawValue = separatorIndex === -1 ? undefined : entry.slice(separatorIndex + 1).trim();

    if (key === "index") state.indexing = "index";
    else if (key === "noindex") state.indexing = "noindex";
    else if (key === "follow") state.following = "follow";
    else if (key === "nofollow") state.following = "nofollow";
    else if (key === "max-image-preview" && (rawValue === "standard" || rawValue === "large" || rawValue === "none")) {
      state.imagePreview = rawValue;
    } else if (key === "max-snippet") {
      state.maxSnippet = parseValueDirective(rawValue);
    } else if (key === "max-video-preview") {
      state.maxVideoPreview = parseValueDirective(rawValue);
    }
  }

  return state;
}

function isDefault(state: RobotsUiState): boolean {
  return (
    state.indexing === "index" &&
    state.following === "follow" &&
    state.imagePreview === "default" &&
    state.maxSnippet.mode === "default" &&
    state.maxVideoPreview.mode === "default"
  );
}

function valueDirectivePart(key: "max-snippet" | "max-video-preview", directive: RobotsValueState): string | null {
  if (directive.mode === "unlimited") return `${key}:-1`;
  if (directive.mode === "custom") {
    const parsed = Number(directive.value.trim());
    if (Number.isInteger(parsed) && parsed >= 0) return `${key}:${parsed}`;
  }
  return null;
}

export function composeRobotsTags(state: RobotsUiState): string {
  if (isDefault(state)) return "";

  const parts: string[] = [state.indexing, state.following];
  if (state.imagePreview !== "default") parts.push(`max-image-preview:${state.imagePreview}`);

  const snippet = valueDirectivePart("max-snippet", state.maxSnippet);
  if (snippet) parts.push(snippet);

  const video = valueDirectivePart("max-video-preview", state.maxVideoPreview);
  if (video) parts.push(video);

  return parts.join(",");
}
