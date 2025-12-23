/**
 * Tests for hours utility functions
 * Run with: npm test hours.test.ts
 */

import { combineConsecutiveDays, formatWorkHoursSections, type DayHours } from '../hours';

describe('combineConsecutiveDays', () => {
  it('should combine consecutive days with same hours', () => {
    const input: DayHours[] = [
      { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
    ];

    const result = combineConsecutiveDays(input);

    expect(result).toEqual([
      { dayRange: 'Monday - Wednesday', hours: '9:00 AM - 7:00 PM' }
    ]);
  });

  it('should not combine non-consecutive days', () => {
    const input: DayHours[] = [
      { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
    ];

    const result = combineConsecutiveDays(input);

    expect(result).toEqual([
      { dayRange: 'Monday', hours: '9:00 AM - 7:00 PM' },
      { dayRange: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
      { dayRange: 'Wednesday', hours: '9:00 AM - 7:00 PM' }
    ]);
  });

  it('should handle mixed consecutive and non-consecutive days', () => {
    const input: DayHours[] = [
      { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 7:00 PM' },
      { day: 'Sunday', hours: '10:00 AM - 7:00 PM' },
    ];

    const result = combineConsecutiveDays(input);

    expect(result).toEqual([
      { dayRange: 'Monday - Saturday', hours: '9:00 AM - 7:00 PM' },
      { dayRange: 'Sunday', hours: '10:00 AM - 7:00 PM' }
    ]);
  });

  it('should handle closed days', () => {
    const input: DayHours[] = [
      { day: 'Monday', hours: '7:00 AM - 6:00 PM' },
      { day: 'Tuesday', hours: '7:00 AM - 6:00 PM' },
      { day: 'Wednesday', hours: '7:00 AM - 6:00 PM' },
      { day: 'Thursday', hours: '7:00 AM - 6:00 PM' },
      { day: 'Friday', hours: '7:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '8:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' },
    ];

    const result = combineConsecutiveDays(input);

    expect(result).toEqual([
      { dayRange: 'Monday - Friday', hours: '7:00 AM - 6:00 PM' },
      { dayRange: 'Saturday', hours: '8:00 AM - 4:00 PM' },
      { dayRange: 'Sunday', hours: 'Closed' }
    ]);
  });

  it('should handle single day', () => {
    const input: DayHours[] = [
      { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
    ];

    const result = combineConsecutiveDays(input);

    expect(result).toEqual([
      { dayRange: 'Monday', hours: '9:00 AM - 7:00 PM' }
    ]);
  });

  it('should handle empty array', () => {
    const input: DayHours[] = [];
    const result = combineConsecutiveDays(input);
    expect(result).toEqual([]);
  });
});

describe('formatWorkHoursSections', () => {
  it('should format multiple sections with combined days', () => {
    const input = [
      {
        label: 'Sales',
        hours: [
          { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Tuesday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Thursday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Friday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Saturday', hours: '9:00 AM - 7:00 PM' },
          { day: 'Sunday', hours: '10:00 AM - 7:00 PM' },
        ]
      },
      {
        label: 'Service',
        hours: [
          { day: 'Monday', hours: '7:00 AM - 6:00 PM' },
          { day: 'Tuesday', hours: '7:00 AM - 6:00 PM' },
          { day: 'Wednesday', hours: '7:00 AM - 6:00 PM' },
          { day: 'Thursday', hours: '7:00 AM - 6:00 PM' },
          { day: 'Friday', hours: '7:00 AM - 6:00 PM' },
          { day: 'Saturday', hours: '8:00 AM - 4:00 PM' },
          { day: 'Sunday', hours: 'Closed' },
        ]
      }
    ];

    const result = formatWorkHoursSections(input);

    expect(result).toEqual([
      {
        label: 'Sales',
        hours: [
          { dayRange: 'Monday - Saturday', hours: '9:00 AM - 7:00 PM' },
          { dayRange: 'Sunday', hours: '10:00 AM - 7:00 PM' }
        ]
      },
      {
        label: 'Service',
        hours: [
          { dayRange: 'Monday - Friday', hours: '7:00 AM - 6:00 PM' },
          { dayRange: 'Saturday', hours: '8:00 AM - 4:00 PM' },
          { dayRange: 'Sunday', hours: 'Closed' }
        ]
      }
    ]);
  });
});
