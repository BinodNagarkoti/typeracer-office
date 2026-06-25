"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface TextTypeProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
}

export function TextType({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  className,
  cursorClassName,
}: TextTypeProps) {
  const [displayText, setDisplayText] = useState("");
  const stateRef = useRef({
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    isPaused: false,
  });

  useEffect(() => {
    if (texts.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const s = stateRef.current;
      const currentText = texts[s.textIndex] || "";

      if (s.isPaused) {
        s.isPaused = false;
        s.isDeleting = true;
        timeoutId = setTimeout(tick, pauseDuration);
        return;
      }

      if (!s.isDeleting) {
        if (s.charIndex < currentText.length) {
          s.charIndex++;
          setDisplayText(currentText.slice(0, s.charIndex));
          timeoutId = setTimeout(tick, typingSpeed);
        } else {
          s.isPaused = true;
          timeoutId = setTimeout(tick, 0);
        }
      } else {
        if (s.charIndex > 0) {
          s.charIndex--;
          setDisplayText(currentText.slice(0, s.charIndex));
          timeoutId = setTimeout(tick, deletingSpeed);
        } else {
          s.isDeleting = false;
          const nextIndex = (s.textIndex + 1) % texts.length;
          if (!loop && nextIndex === 0) return;
          s.textIndex = nextIndex;
          timeoutId = setTimeout(tick, 0);
        }
      }
    };

    timeoutId = setTimeout(tick, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [texts, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={cn("inline-flex", className)}>
      <span>{displayText}</span>
      <span
        className={cn(
          "inline-block w-[3px] h-[1em] bg-current ml-0.5 animate-pulse",
          cursorClassName
        )}
      />
    </span>
  );
}
