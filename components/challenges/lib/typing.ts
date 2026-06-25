export function calculateWPM(charsTyped: number, timeElapsedMs: number): number {
  if (timeElapsedMs === 0) return 0;
  const minutes = timeElapsedMs / 60000;
  const words = charsTyped / 5;
  return Math.round(words / minutes);
}

export function calculateAccuracy(
  correctChars: number,
  totalTyped: number
): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getCharStatus(
  index: number,
  currentIndex: number,
  inputChars: string[],
  targetText: string
): "correct" | "incorrect" | "current" | "upcoming" {
  if (index < currentIndex) {
    return inputChars[index] === targetText[index] ? "correct" : "incorrect";
  }
  if (index === currentIndex) return "current";
  return "upcoming";
}
