import { describe, it, expect } from 'vitest';
import { addBaseIfRelative, isExternalUrl } from '../url';

describe('isExternalUrl', () => {
  it('should return false for null input', () => {
    expect(isExternalUrl(null)).toBe(false);
  });

  it('should return false for undefined input', () => {
    expect(isExternalUrl(undefined)).toBe(false);
  });

  it('should return true for http:// URLs', () => {
    expect(isExternalUrl('http://example.com')).toBe(true);
  });

  it('should return true for https:// URLs', () => {
    expect(isExternalUrl('https://example.com')).toBe(true);
  });

  it('should return false for relative paths', () => {
    expect(isExternalUrl('/about')).toBe(false);
    expect(isExternalUrl('about')).toBe(false);
  });
});

describe('addBaseIfRelative', () => {
  const baseUrl = 'https://example.com';

  it('should return null for null input', () => {
    expect(addBaseIfRelative(null, baseUrl)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(addBaseIfRelative(undefined, baseUrl)).toBeNull();
  });

  it('should return absolute HTTP URL unchanged', () => {
    const absoluteUrl = 'http://other.com/page';
    expect(addBaseIfRelative(absoluteUrl, baseUrl)).toBe(absoluteUrl);
  });

  it('should return absolute HTTPS URL unchanged', () => {
    const absoluteUrl = 'https://other.com/page';
    expect(addBaseIfRelative(absoluteUrl, baseUrl)).toBe(absoluteUrl);
  });

  it('should prepend base URL to relative path starting with /', () => {
    expect(addBaseIfRelative('/about', baseUrl)).toBe('https://example.com/about');
  });

  it('should prepend base URL to relative path without leading /', () => {
    expect(addBaseIfRelative('about', baseUrl)).toBe('https://example.com/about');
  });

  it('should handle base URL with trailing slash', () => {
    expect(addBaseIfRelative('/about', 'https://example.com/')).toBe('https://example.com/about');
  });

  it('should handle base URL without trailing slash', () => {
    expect(addBaseIfRelative('/about', 'https://example.com')).toBe('https://example.com/about');
  });

  it('should handle relative path with trailing slash', () => {
    expect(addBaseIfRelative('/about/', baseUrl)).toBe('https://example.com/about/');
  });

  it('should handle nested relative paths', () => {
    expect(addBaseIfRelative('/section/page', baseUrl)).toBe('https://example.com/section/page');
  });
});
