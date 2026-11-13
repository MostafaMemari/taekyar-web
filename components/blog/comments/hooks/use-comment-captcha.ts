"use client";

import { useCallback, useState } from "react";

export type CaptchaStatus = "loading" | "refreshing" | "ready" | "unavailable";

const IMAGE_ENDPOINT = "/api/captcha/image";

export function useCommentCaptcha() {
  const [nonce, setNonce] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<CaptchaStatus>("loading");

  const refresh = useCallback(() => {
    setAnswer("");
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
