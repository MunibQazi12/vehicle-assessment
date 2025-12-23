/**
 * Time Formatting Utility Tests
 */

import { describe, it, expect } from 'vitest';
import { formatTime } from '../time';

describe('formatTime', () => {
  it('should format morning times correctly', () => {
    expect(formatTime('09:00')).toBe('9:00 AM');
    expect(formatTime('08:30')).toBe('8:30 AM');
    expect(formatTime('11:45')).toBe('11:45 AM');
  });

  it('should format afternoon times correctly', () => {
    expect(formatTime('13:00')).toBe('1:00 PM');
    expect(formatTime('14:30')).toBe('2:30 PM');
    expect(formatTime('17:45')).toBe('5:45 PM');
  });

  it('should format noon correctly', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('12:30')).toBe('12:30 PM');
  });

  it('should format midnight correctly', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
    expect(formatTime('00:30')).toBe('12:30 AM');
  });

  it('should handle edge cases', () => {
    expect(formatTime('23:59')).toBe('11:59 PM');
    expect(formatTime('01:00')).toBe('1:00 AM');
  });
});
