"use client";

import { useCallback, useEffect, useState } from "react";

import { createCommentCaptcha, type CommentCaptchaChallenge } from "@/lib/comment-actions";

export function useCommentCaptcha() {
  const [challenge, setChallenge] = useState<CommentCaptchaChallenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setAnswer("");
    createCommentCaptcha()
      .then(setChallenge)
      .catch(() => setChallenge(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    createCommentCaptcha()
      .then((next) => {
        if (!cancelled) setChallenge(next);
      })
      .catch(() => {
        if (!cancelled) setChallenge(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { challenge, answer, setAnswer, refresh, isLoading };
}