/**
 * Filter-specific type definitions
 */

import type { FilterType, FilterValue, AvailableFilter, SelectedFilter } from "./api";

export type { FilterType, FilterValue, AvailableFilter, SelectedFilter };

export interface FilterState {
  // Vehicle attributes
  condition?: string[];
  year?: string[];
  make?: string[];
  model?: string[];
  trim?: string[];
  body?: string[];

  // Technical specifications
  fuel_type?: string[];
  transmission?: string[];
  engine?: string[];
  drive_train?: string[];
  doors?: (string | number)[];

  // Colors
  ext_color?: string[];
  int_color?: string[];

  // Location filters
  dealer?: string[];
  state?: string[];
  city?: string[];

  // Features
  key_features?: string[];

  // Range filters
  price?: {
    min?: number;
    max?: number;
    max_payment?: number;
  };
  mileage?: {
    min?: number;
    max?: number;
  };

  // Status flags
  is_special?: boolean[];
  is_new_arrival?: boolean[];
  is_in_transit?: boolean[];
  is_sale_pending?: boolean[];
  is_commercial?: boolean[];

  // Search
  search?: string;
}

export interface FilterGroupConfig {
  name: string;
  label: string;
  type: FilterType;
  options?: FilterValue[];
  range?: [number, number];
}

export interface SortOption {
  label: string;
  value: string;
  sortBy: string;
  order: "asc" | "desc";
}
