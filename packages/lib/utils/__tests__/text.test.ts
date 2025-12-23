/**
 * Tests for text normalization utilities
 */

import { describe, it, expect } from 'vitest';
import { normalizeForUrl, buildUrlPath, standardizeBrandName, standardizeBrandNames } from '../text';

describe('normalizeForUrl', () => {
  it('handles basic lowercase conversion', () => {
    expect(normalizeForUrl('Ford')).toBe('ford');
    expect(normalizeForUrl('GMC')).toBe('gmc');
    expect(normalizeForUrl('SUV')).toBe('suv');
  });

  it('replaces spaces with hyphens', () => {
    expect(normalizeForUrl('Ford F-150')).toBe('ford-f-150');
    expect(normalizeForUrl('Alfa Romeo')).toBe('alfa-romeo');
    expect(normalizeForUrl('GMC Sierra 1500')).toBe('gmc-sierra-1500');
    expect(normalizeForUrl('4 Door')).toBe('4-door');
  });

  it('removes accents and diacritics (ASCII folding)', () => {
    expect(normalizeForUrl('Café Racer')).toBe('cafe-racer');
    expect(normalizeForUrl('Coupé')).toBe('coupe');
    expect(normalizeForUrl('Citroën')).toBe('citroen');
    expect(normalizeForUrl('Porsche 911 Carrera')).toBe('porsche-911-carrera');
  });

  it('converts special characters to hyphens', () => {
    expect(normalizeForUrl('F-150')).toBe('f-150');
    expect(normalizeForUrl('Q5/Q7')).toBe('q5-q7');
    expect(normalizeForUrl('3-Series')).toBe('3-series');
    expect(normalizeForUrl('C&C')).toBe('c-c');
    expect(normalizeForUrl('Model X (Electric)')).toBe('model-x-electric');
  });

  it('removes multiple consecutive hyphens', () => {
    expect(normalizeForUrl('Ford  F-150')).toBe('ford-f-150');
    expect(normalizeForUrl('GMC---Sierra')).toBe('gmc-sierra');
    expect(normalizeForUrl('Test   Multiple   Spaces')).toBe('test-multiple-spaces');
  });

  it('strips leading and trailing hyphens', () => {
    expect(normalizeForUrl('-Ford-')).toBe('ford');
    expect(normalizeForUrl('--GMC--')).toBe('gmc');
    expect(normalizeForUrl('---Test---')).toBe('test');
  });

  it('handles empty and whitespace strings', () => {
    expect(normalizeForUrl('')).toBe('');
    expect(normalizeForUrl('   ')).toBe('');
    expect(normalizeForUrl('---')).toBe('');
  });

  it('preserves numbers', () => {
    expect(normalizeForUrl('F-150')).toBe('f-150');
    expect(normalizeForUrl('Sierra 1500')).toBe('sierra-1500');
    expect(normalizeForUrl('911')).toBe('911');
    expect(normalizeForUrl('4Runner')).toBe('4runner');
  });

  it('handles complex vehicle names', () => {
    expect(normalizeForUrl('Mercedes-Benz S-Class')).toBe('mercedes-benz-s-class');
    expect(normalizeForUrl('Land Rover Range Rover')).toBe('land-rover-range-rover');
    expect(normalizeForUrl('Ram 2500 Heavy Duty')).toBe('ram-2500-heavy-duty');
  });

  it('matches OpenSearch lowercase_asciifolding_hyphen_normalizer behavior', () => {
    // Real-world examples from vehicle data
    expect(normalizeForUrl('F-150 SuperCrew')).toBe('f-150-supercrew');
    expect(normalizeForUrl('Alfa Romeo Giulia')).toBe('alfa-romeo-giulia');
    expect(normalizeForUrl('BMW 3 Series')).toBe('bmw-3-series');
    expect(normalizeForUrl('Chevrolet Silverado 1500')).toBe('chevrolet-silverado-1500');
  });
});

describe('buildUrlPath', () => {
  it('builds path from multiple parts', () => {
    expect(buildUrlPath('Ford', 'F-150')).toBe('ford/f-150');
    expect(buildUrlPath('Alfa Romeo', 'Giulia')).toBe('alfa-romeo/giulia');
    expect(buildUrlPath('GMC', 'Sierra 1500', 'SLE')).toBe('gmc/sierra-1500/sle');
  });

  it('filters out undefined and null values', () => {
    expect(buildUrlPath('Ford', undefined, 'F-150')).toBe('ford/f-150');
    expect(buildUrlPath('GMC', null, 'Sierra')).toBe('gmc/sierra');
    expect(buildUrlPath(undefined, 'Test', null)).toBe('test');
  });

  it('filters out empty strings after normalization', () => {
    expect(buildUrlPath('Ford', '', 'F-150')).toBe('ford/f-150');
    expect(buildUrlPath('', 'Test', '')).toBe('test');
    expect(buildUrlPath('   ', 'GMC', '   ')).toBe('gmc');
  });

  it('handles all undefined/null/empty values', () => {
    expect(buildUrlPath()).toBe('');
    expect(buildUrlPath(undefined, null, '')).toBe('');
    expect(buildUrlPath('', '', '')).toBe('');
  });

  it('normalizes each part independently', () => {
    expect(buildUrlPath('Ford F-150', 'SuperCrew')).toBe('ford-f-150/supercrew');
    expect(buildUrlPath('Café', 'Racer')).toBe('cafe/racer');
    expect(buildUrlPath('Mercedes-Benz', 'S-Class', 'AMG S63')).toBe('mercedes-benz/s-class/amg-s63');
  });
});

describe('standardizeBrandName', () => {
  it('converts lowercase to Title Case', () => {
    expect(standardizeBrandName('nissan')).toBe('Nissan');
    expect(standardizeBrandName('ford')).toBe('Ford');
    expect(standardizeBrandName('bmw')).toBe('Bmw');
  });

  it('replaces underscores with spaces', () => {
    expect(standardizeBrandName('land_rover')).toBe('Land Rover');
    expect(standardizeBrandName('mercedes_benz')).toBe('Mercedes Benz');
    expect(standardizeBrandName('alfa_romeo')).toBe('Alfa Romeo');
  });

  it('handles single word brands', () => {
    expect(standardizeBrandName('toyota')).toBe('Toyota');
    expect(standardizeBrandName('honda')).toBe('Honda');
    expect(standardizeBrandName('mazda')).toBe('Mazda');
  });

  it('handles multiple underscores', () => {
    expect(standardizeBrandName('aston_martin')).toBe('Aston Martin');
    expect(standardizeBrandName('rolls_royce')).toBe('Rolls Royce');
  });

  it('handles empty and falsy values', () => {
    expect(standardizeBrandName('')).toBe('');
    expect(standardizeBrandName(null as unknown as string)).toBe(null);
    expect(standardizeBrandName(undefined as unknown as string)).toBe(undefined);
  });

  it('handles already formatted brands gracefully', () => {
    expect(standardizeBrandName('Nissan')).toBe('Nissan');
    expect(standardizeBrandName('FORD')).toBe('Ford');
  });
});

describe('standardizeBrandNames', () => {
  it('standardizes an array of brand names', () => {
    const input = ['nissan', 'land_rover', 'mercedes_benz'];
    const expected = ['Nissan', 'Land Rover', 'Mercedes Benz'];
    expect(standardizeBrandNames(input)).toEqual(expected);
  });

  it('handles empty array', () => {
    expect(standardizeBrandNames([])).toEqual([]);
  });

  it('handles mixed format brands', () => {
    const input = ['nissan', 'ford', 'land_rover', 'bmw', 'alfa_romeo'];
    const expected = ['Nissan', 'Ford', 'Land Rover', 'Bmw', 'Alfa Romeo'];
    expect(standardizeBrandNames(input)).toEqual(expected);
  });
});

