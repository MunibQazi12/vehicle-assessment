/**
 * Hours Formatting Utilities
 * Combines consecutive weekdays with identical hours into ranges
 */

export interface DayHours {
  day: string;
  hours: string;
}

export interface DayRangeHours {
  dayRange: string;
  hours: string;
}

/**
 * Combines consecutive weekdays with the same hours into ranges
 * 
 * Examples:
 * - "Monday 9-5", "Tuesday 9-5", "Wednesday 9-5" → "Monday - Wednesday 9-5"
 * - "Monday 9-5", "Wednesday 9-5" → "Monday 9-5", "Wednesday 9-5" (non-consecutive)
 * - "Saturday 9-5", "Sunday Closed" → "Saturday 9-5", "Sunday Closed" (different hours)
 * 
 * @param dayHours Array of day/hours objects
 * @returns Array with consecutive days combined into ranges
 */
export function combineConsecutiveDays(dayHours: DayHours[]): DayRangeHours[] {
  if (dayHours.length === 0) return [];
  if (dayHours.length === 1) {
    return [{ dayRange: dayHours[0].day, hours: dayHours[0].hours }];
  }

  const result: DayRangeHours[] = [];
  let rangeStart = 0;
  let rangeEnd = 0;

  for (let i = 1; i < dayHours.length; i++) {
    if (dayHours[i].hours === dayHours[rangeEnd].hours) {
      // Same hours, extend range
      rangeEnd = i;
    } else {
      // Different hours, push previous range and start new one
      result.push(createRange(dayHours, rangeStart, rangeEnd));
      rangeStart = i;
      rangeEnd = i;
    }
  }

  // Push the last range
  result.push(createRange(dayHours, rangeStart, rangeEnd));

  return result;
}

/**
 * Helper function to create a day range string
 */
function createRange(
  dayHours: DayHours[],
  startIndex: number,
  endIndex: number
): DayRangeHours {
  if (startIndex === endIndex) {
    // Single day
    return {
      dayRange: dayHours[startIndex].day,
      hours: dayHours[startIndex].hours
    };
  }

  // Range of days
  return {
    dayRange: `${dayHours[startIndex].day} - ${dayHours[endIndex].day}`,
    hours: dayHours[startIndex].hours
  };
}

/**
 * Formats work hours sections by combining consecutive days
 * 
 * @param sections Array of work hours sections (Sales, Service, Parts)
 * @returns Formatted sections with combined day ranges
 */
export function formatWorkHoursSections(sections: {
  label: string;
  hours: DayHours[];
}[]): {
  label: string;
  hours: DayRangeHours[];
}[] {
  return sections.map(section => ({
    label: section.label,
    hours: combineConsecutiveDays(section.hours)
  }));
}
