import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const timeZoneOffset = -date.getTimezoneOffset() / 60;
  const timeZoneString = `UTC${
    timeZoneOffset >= 0 ? "+" : ""
  }${timeZoneOffset}`;

  return `${date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })} ${date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })} (${timeZoneString})`;
}

export function getCurrentEpoch(
  currentTimestamp: number,
  epochStartTimestamp: number
): number {
  const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
  return Math.floor((currentTimestamp - epochStartTimestamp) / WEEK_IN_SECONDS);
}

export function getEpochBoundaries(currentTimestamp: number): {
  start: number;
  end: number;
} {
  // Find the most recent Thursday midnight UTC
  const date = new Date(currentTimestamp * 1000);
  date.setUTCHours(0, 0, 0, 0);

  // Get the day of the week (0 = Sunday, 4 = Thursday)
  const day = date.getUTCDay();

  // Calculate days to subtract to get to the most recent Thursday
  const daysToThursday = day < 4 ? -day - 3 : 4 - day;

  // Set the date to the most recent Thursday
  date.setUTCDate(date.getUTCDate() + daysToThursday);

  // Get the start timestamp
  const start = Math.floor(date.getTime() / 1000);

  // Add one week to get the end timestamp
  const end = start + 7 * 24 * 60 * 60;

  return { start, end };
}

export async function copyToClipboard(text: string) {
  if (typeof window === "undefined") return;

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    // Fallback copy method
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed: ", err);
    }
    document.body.removeChild(textarea);
  }
}
