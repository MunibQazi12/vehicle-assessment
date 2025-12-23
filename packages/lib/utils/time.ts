/**
 * Time Formatting Utility
 * Converts 24-hour time format to 12-hour with AM/PM
 */

/**
 * Formats time from HH:mm format to h:mm AM/PM format
 * @param time - Time string in HH:mm format (e.g., "14:30")
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(time: string): string {
  const [hoursPart, minutes] = time.split(":");
  const hour = parseInt(hoursPart, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}
