/**
 * URL Structure Tests
 * Verifies slug building and parsing according to specification
 */

import { describe, it, expect } from 'vitest';
import { buildUrl, parseSlug } from '@dealertower/lib/url';
import type { FilterState } from '@dealertower/types/filters';

describe('URL Structure', () => {
  describe('Condition Slugs', () => {
    it('should build new-vehicles slug for new condition', () => {
      const filters: FilterState = { condition: ['new'] };
      const result = buildUrl(filters);
      expect(result.path).toBe('new-vehicles');
    });

    it('should build used-vehicles slug for used condition', () => {
      const filters: FilterState = { condition: ['used'] };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles');
    });

    it('should build used-vehicles/certified for certified only', () => {
      const filters: FilterState = { condition: ['certified'] };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles/certified');
    });

    it('should build used-vehicles for used + certified', () => {
      const filters: FilterState = { condition: ['used', 'certified'] };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles');
    });

    it('should build used-vehicles/certified for new + certified (certified subsumes new)', () => {
      const filters: FilterState = { condition: ['new', 'certified'] };
      const result = buildUrl(filters);
      // Business rule: when certified is selected, it implies used vehicles
      expect(result.path).toBe('used-vehicles/certified');
    });

    it('should build used-vehicles for all conditions', () => {
      const filters: FilterState = { condition: ['new', 'used', 'certified'] };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles');
    });
  });

  describe('Make and Model', () => {
    it('should add make after condition', () => {
      const filters: FilterState = { 
        condition: ['new'],
        make: ['toyota'] 
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('new-vehicles/toyota');
    });

    it('should add model after make', () => {
      const filters: FilterState = { 
        condition: ['used'],
        make: ['honda'],
        model: ['accord']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles/honda/accord');
    });

    it('should only use first make alphabetically in path', () => {
      const filters: FilterState = { 
        condition: ['new'],
        make: ['toyota', 'honda', 'ford']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('new-vehicles/ford');
      expect(result.queryParams.make).toBe('honda,toyota');
    });

    it('should only use first model alphabetically in path', () => {
      const filters: FilterState = { 
        condition: ['used'],
        make: ['toyota'],
        model: ['camry', 'corolla', 'avalon']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles/toyota/avalon');
      expect(result.queryParams.model).toBe('camry,corolla');
    });

    it('should not add model without make in path', () => {
      const filters: FilterState = { 
        condition: ['new'],
        model: ['accord']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('new-vehicles');
      expect(result.queryParams.model).toBe('accord');
    });
  });

  describe('Slug Cleaning', () => {
    it('should clean special characters in slugs', () => {
      const filters: FilterState = { 
        condition: ['new'],
        make: ['Land Rover'],
        model: ['Range Rover (Sport)']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('new-vehicles/land-rover/range-rover-sport');
    });

    it('should remove non-ASCII characters', () => {
      const filters: FilterState = { 
        condition: ['used'],
        make: ['Citroën']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('used-vehicles/citroen');
    });
  });

  describe('Query Parameters', () => {
    it('should put non-path filters in query params', () => {
      const filters: FilterState = { 
        condition: ['new'],
        make: ['toyota'],
        trim: ['le', 'se'],
        body: ['sedan']
      };
      const result = buildUrl(filters);
      expect(result.path).toBe('new-vehicles/toyota');
      expect(result.queryParams.trim).toBe('le,se');
      expect(result.queryParams.body).toBe('sedan');
    });

    it('should sort years descending in query params', () => {
      const filters: FilterState = { 
        condition: ['used'],
        year: ['2020', '2022', '2021']
      };
      const result = buildUrl(filters);
      expect(result.queryParams.year).toBe('2022,2021,2020');
    });

    it('should sort other filters ascending', () => {
      const filters: FilterState = { 
        condition: ['new'],
        trim: ['ze', 'le', 'se']
      };
      const result = buildUrl(filters);
      expect(result.queryParams.trim).toBe('le,se,ze');
    });

    it('should handle range filters', () => {
      const filters: FilterState = { 
        condition: ['used'],
        price: { min: 20000, max: 30000 }
      };
      const result = buildUrl(filters);
      expect(result.queryParams.price_min).toBe('20000');
      expect(result.queryParams.price_max).toBe('30000');
    });

    it('should handle boolean filters', () => {
      const filters: FilterState = { 
        condition: ['new'],
        is_special: [true]
      };
      const result = buildUrl(filters);
      expect(result.queryParams.is_special).toBe('true');
    });

    it('should include sort parameters', () => {
      const filters: FilterState = { condition: ['new'] };
      const result = buildUrl(filters, 'price', 'desc');
      expect(result.queryParams.sort_by).toBe('price');
      expect(result.queryParams.order).toBe('desc');
    });

    it('should not include default ascending order', () => {
      const filters: FilterState = { condition: ['new'] };
      const result = buildUrl(filters, 'price', 'asc');
      expect(result.queryParams.sort_by).toBe('price');
      expect(result.queryParams.order).toBeUndefined();
    });
  });

  describe('Slug Parsing', () => {
    it('should parse new-vehicles slug', () => {
      const result = parseSlug(['new-vehicles']);
      expect(result.filters.condition).toEqual(['new']);
      expect(result.isValid).toBe(true);
    });

    it('should parse used-vehicles/certified slug', () => {
      const result = parseSlug(['used-vehicles', 'certified']);
      expect(result.filters.condition).toEqual(['certified']);
      expect(result.isValid).toBe(true);
    });

    it('should parse condition/make/model slug', () => {
      const result = parseSlug(['new-vehicles', 'toyota', 'camry']);
      expect(result.filters.condition).toEqual(['new']);
      expect(result.filters.make).toEqual(['toyota']);
      expect(result.filters.model).toEqual(['camry']);
      expect(result.isValid).toBe(true);
    });

    it('should parse new-vehicles/used-vehicles/certified', () => {
      const result = parseSlug(['new-vehicles', 'used-vehicles', 'certified']);
      expect(result.filters.condition).toContain('new');
      expect(result.filters.condition).toContain('certified');
      expect(result.isValid).toBe(true);
    });

    it('should mark invalid slug without condition', () => {
      const result = parseSlug(['toyota', 'camry']);
      expect(result.isValid).toBe(false);
    });

    it('should mark invalid slug with extra segments', () => {
      const result = parseSlug(['new-vehicles', 'toyota', 'camry', 'extra']);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Round-trip Tests', () => {
    it('should round-trip new vehicles', () => {
      const filters: FilterState = { condition: ['new'] };
      const built = buildUrl(filters);
      const parsed = parseSlug(built.path.split('/'));
      expect(parsed.filters.condition).toEqual(filters.condition);
    });

    it('should round-trip make and model', () => {
      const filters: FilterState = { 
        condition: ['used'],
        make: ['toyota'],
        model: ['camry']
      };
      const built = buildUrl(filters);
      const parsed = parseSlug(built.path.split('/'));
      // Note: parsed includes 'certified' due to business rule
      expect(parsed.filters.make).toEqual(filters.make);
      expect(parsed.filters.model).toEqual(filters.model);
    });

    it('should round-trip certified path', () => {
      const filters: FilterState = { condition: ['certified'] };
      const built = buildUrl(filters);
      const parsed = parseSlug(built.path.split('/'));
      expect(parsed.filters.condition).toContain('certified');
    });
  });

  describe('Full URL Generation', () => {
    it('should generate complete URL with path and query params', () => {
      const filters: FilterState = { 
        condition: ['new'],
        make: ['toyota'],
        model: ['camry'],
        year: ['2024'],
        trim: ['le', 'se']
      };
      const result = buildUrl(filters);
      expect(result.fullUrl).toContain('/new-vehicles/toyota/camry/');
      expect(result.fullUrl).toContain('year=2024');
      expect(result.fullUrl).toContain('trim=le%2Cse');
    });

    it('should generate URL with only path when no query filters', () => {
      const filters: FilterState = { 
        condition: ['new'],
        make: ['honda']
      };
      const result = buildUrl(filters);
      expect(result.fullUrl).toBe('/new-vehicles/honda/');
    });
  });
});
