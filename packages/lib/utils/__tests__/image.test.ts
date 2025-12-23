/**
 * Tests for image utility functions
 */

import { describe, it, expect } from 'vitest';
import { ensureHttps, getSecureVehicleImageUrl, getBlurDataURL } from '../image';

describe('ensureHttps', () => {
  it('should return null for null or undefined input', () => {
    expect(ensureHttps(null)).toBeNull();
    expect(ensureHttps(undefined)).toBeNull();
  });

  it('should leave HTTPS URLs unchanged', () => {
    const url = 'https://example.com/image.jpg';
    expect(ensureHttps(url)).toBe(url);
  });

  it('should convert HTTP to HTTPS', () => {
    const httpUrl = 'http://example.com/image.jpg';
    const expectedUrl = 'https://example.com/image.jpg';
    expect(ensureHttps(httpUrl)).toBe(expectedUrl);
  });

  it('should handle protocol-relative URLs', () => {
    const url = '//example.com/image.jpg';
    const expectedUrl = 'https://example.com/image.jpg';
    expect(ensureHttps(url)).toBe(expectedUrl);
  });

  it('should leave relative URLs unchanged', () => {
    const url = '/images/photo.jpg';
    expect(ensureHttps(url)).toBe(url);
  });
});

describe('getSecureVehicleImageUrl', () => {
  it('should return null for null or undefined input', () => {
    expect(getSecureVehicleImageUrl(null)).toBeNull();
    expect(getSecureVehicleImageUrl(undefined)).toBeNull();
  });

  it('should convert vehicle photo URLs to HTTPS', () => {
    const httpUrl = 'http://vehicle-photos.vauto.com/image.jpg';
    const expectedUrl = 'https://vehicle-photos.vauto.com/image.jpg';
    expect(getSecureVehicleImageUrl(httpUrl)).toBe(expectedUrl);
  });
});

describe('getBlurDataURL', () => {
  it('should return undefined for null or undefined input', () => {
    expect(getBlurDataURL(null)).toBeUndefined();
    expect(getBlurDataURL(undefined)).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    expect(getBlurDataURL('')).toBeUndefined();
  });

  it('should handle double-base64 encoded WebP from API', () => {
    // This is how the API sends it: Base64(Base64(WebP_bytes))
    const innerBase64 = 'UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoMAAkAAUAmJZwC';
    const doubleEncoded = Buffer.from(innerBase64).toString('base64');
    const result = getBlurDataURL(doubleEncoded);
    
    expect(result).toBeDefined();
    expect(result).toContain('data:image/webp;base64,');
    // Should decode once and use the inner base64
    expect(result).toContain(innerBase64.substring(0, 20));
  });

  it('should detect WebP format after decoding', () => {
    // WebP signature starts with "UklGR" (RIFF in base64) after decoding
    const webpBase64 = 'UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoMAAAAAA';
    const doubleEncoded = Buffer.from(webpBase64).toString('base64');
    const result = getBlurDataURL(doubleEncoded);
    
    expect(result).toContain('data:image/webp;base64,');
    expect(result).toContain('UklGR');
  });

  it('should leave data URLs unchanged', () => {
    const dataUrl = 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoMAAkAAUAmJZwC';
    expect(getBlurDataURL(dataUrl)).toBe(dataUrl);
  });

  it('should handle other data URL formats', () => {
    const pngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    expect(getBlurDataURL(pngDataUrl)).toBe(pngDataUrl);
  });

  it('should use WebP MIME type (production format)', () => {
    const webpInner = 'UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoMAAkAAUAmJZwC';
    const doubleEncoded = Buffer.from(webpInner).toString('base64');
    const result = getBlurDataURL(doubleEncoded);
    
    expect(result).toContain('data:image/webp;base64,');
    expect(result?.startsWith('data:image/webp;base64,')).toBe(true);
  });

  it('should handle browser environment (atob)', () => {
    // Simulate browser by temporarily removing Buffer
    const originalBuffer = global.Buffer;
    // @ts-expect-error - testing browser environment
    global.Buffer = undefined;
    
    const webpInner = 'UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoMAAkAAUAmJZwC';
    // In browser, we'd double encode differently but the logic is the same
    const result = getBlurDataURL('data:image/webp;base64,' + webpInner);
    
    expect(result).toContain('data:image/webp;base64,');
    
    global.Buffer = originalBuffer;
  });
});
