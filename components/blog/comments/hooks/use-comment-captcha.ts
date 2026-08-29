"use client";

import { useCallback, useState } from "react";

export type CaptchaStatus = "loading" | "refreshing" | "ready" | "unavailable";

const IMAGE_ENDPOINT = "/api/captcha/image";

/**
 * The image endpoint mints a brand new challenge on every request, so "refreshing" is just
 * asking for the endpoint again. The counter only exists to change the `src` attribute:
 * React will not re-request an identical URL, and some browsers reuse a cached subresource
 * even under `no-store` unless the URL differs. The server ignores it and never reuses output.
 */
export function useCommentCaptcha() {
  const [nonce, setNonce] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<CaptchaStatus>("loading");

  const refresh = useCallback(() => {
    setAnswer("");
    // Keep the previous frame visible while a new one is fetched, unless there is none.
    setStatus((previous) => (previous === "ready" ? "refreshing" : "loading"));
    setNonce((previous) => previous + 1);
  }, []);

  const handleImageLoad = useCallback(() => {
    setStatus("ready");
  }, []);

  const handleImageError = useCallback(() => {
    setStatus("unavailable");
  }, []);

  return {
    imageUrl: `${IMAGE_ENDPOINT}?v=${nonce}`,
    answer,
    setAnswer,
    refresh,
    status,
    isReady: status === "ready",
    isBusy: status === "loading" || status === "refreshing",
    onImageLoad: handleImageLoad,
    onImageError: handleImageError,
  };
}
