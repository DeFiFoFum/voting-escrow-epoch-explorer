import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const timeZoneOffset = -date.getTimezoneOffset() / 60;
  const timeZoneString = `UTC${timeZoneOffset >= 0 ? '+' : ''}${timeZoneOffset}`;

  return `${date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })} ${date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })} (${timeZoneString})`;
}

export function formatRelativeTime(targetTimestamp: number, currentTimestamp: number): string {
  const diffSeconds = targetTimestamp - currentTimestamp;
  const isInFuture = diffSeconds > 0;
  const absDiff = Math.abs(diffSeconds);

  const days = Math.floor(absDiff / (24 * 60 * 60));
  const hours = Math.floor((absDiff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((absDiff % (60 * 60)) / 60);
  const seconds = Math.floor(absDiff % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return `${parts.join(' ')} ${isInFuture ? 'until' : 'since'}`;
}

export function getTimeDifferenceInSeconds(
  targetTimestamp: number,
  currentTimestamp: number
): number {
  return targetTimestamp - currentTimestamp;
}

export function getCurrentEpoch(currentTimestamp: number, epochStartTimestamp: number): number {
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

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    // Fallback copy method
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!success) throw new Error('execCommand copy failed');
      return true;
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      return false;
    }
  }
}
