"use client";

import { useEffect, useState } from "react";

interface TypingHeadlineProps {
  text: string;
  className?: string;
}

export function TypingHeadline({ text, className }: TypingHeadlineProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    let currentIndex = 0;

    const timer = window.setInterval(() => {
      currentIndex += 1;
      setValue(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        window.clearInterval(timer);
      }
    }, 42);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <h1 className={className}>
      {value}
      <span className="typing-caret" aria-hidden="true" />
    </h1>
  );
}
