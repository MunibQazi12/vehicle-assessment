import { describe, it, expect } from 'vitest';
import { transformWorkHours, type DepartmentHours } from '../hours';
import type { DealerWorkHours } from '@dealertower/lib/api/dealer';

describe('transformWorkHours', () => {
  it('should return all closed hours for empty input', () => {
    const result = transformWorkHours([]);
    
    const expectedHours: DepartmentHours = {
      monday: "Closed",
      tuesday: "Closed",
      wednesday: "Closed",
      thursday: "Closed",
      friday: "Closed",
      saturday: "Closed",
      sunday: "Closed",
    };

    expect(result.salesHours).toEqual(expectedHours);
    expect(result.serviceHours).toEqual(expectedHours);
    expect(result.partsHours).toEqual(expectedHours);
  });

  it('should transform sales hours correctly', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Sales",
        value: [
          { label: "Monday", from: "9:00am", to: "6:00pm", is_open: true },
          { label: "Tuesday", from: "9:00am", to: "6:00pm", is_open: true },
        ],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.salesHours.monday).toBe("9:00am - 6:00pm");
    expect(result.salesHours.tuesday).toBe("9:00am - 6:00pm");
    expect(result.salesHours.wednesday).toBe("Closed");
  });

  it('should transform service hours correctly', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Service",
        value: [
          { label: "Monday", from: "7:00am", to: "5:00pm", is_open: true },
        ],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.serviceHours.monday).toBe("7:00am - 5:00pm");
    expect(result.serviceHours.tuesday).toBe("Closed");
  });

  it('should transform parts hours correctly', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Parts",
        value: [
          { label: "Friday", from: "8:00am", to: "4:00pm", is_open: true },
        ],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.partsHours.friday).toBe("8:00am - 4:00pm");
    expect(result.partsHours.monday).toBe("Closed");
  });

  it('should handle multiple departments simultaneously', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Sales",
        value: [{ label: "Monday", from: "9:00am", to: "6:00pm", is_open: true }],
      },
      {
        label: "Service",
        value: [{ label: "Tuesday", from: "7:00am", to: "5:00pm", is_open: true }],
      },
      {
        label: "Parts",
        value: [{ label: "Wednesday", from: "8:00am", to: "4:00pm", is_open: true }],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.salesHours.monday).toBe("9:00am - 6:00pm");
    expect(result.serviceHours.tuesday).toBe("7:00am - 5:00pm");
    expect(result.partsHours.wednesday).toBe("8:00am - 4:00pm");
  });

  it('should handle case-insensitive department labels', () => {
    const input: DealerWorkHours[] = [
      {
        label: "SALES DEPARTMENT",
        value: [{ label: "Monday", from: "9:00am", to: "6:00pm", is_open: true }],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.salesHours.monday).toBe("9:00am - 6:00pm");
  });

  it('should handle case-insensitive day labels', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Sales",
        value: [{ label: "MONDAY", from: "9:00am", to: "6:00pm", is_open: true }],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.salesHours.monday).toBe("9:00am - 6:00pm");
  });

  it('should ignore unknown departments', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Unknown Department",
        value: [{ label: "Monday", from: "9:00am", to: "6:00pm", is_open: true }],
      },
    ];

    const result = transformWorkHours(input);
    
    // All should remain closed since department is unknown
    expect(result.salesHours.monday).toBe("Closed");
    expect(result.serviceHours.monday).toBe("Closed");
    expect(result.partsHours.monday).toBe("Closed");
  });

  it('should handle closed day (is_open: false)', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Sales",
        value: [{ label: "Sunday", from: "", to: "", is_open: false }],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.salesHours.sunday).toBe("Closed");
  });

  it('should handle all days of the week', () => {
    const input: DealerWorkHours[] = [
      {
        label: "Sales",
        value: [
          { label: "Monday", from: "9:00am", to: "6:00pm", is_open: true },
          { label: "Tuesday", from: "9:00am", to: "6:00pm", is_open: true },
          { label: "Wednesday", from: "9:00am", to: "6:00pm", is_open: true },
          { label: "Thursday", from: "9:00am", to: "6:00pm", is_open: true },
          { label: "Friday", from: "9:00am", to: "8:00pm", is_open: true },
          { label: "Saturday", from: "9:00am", to: "5:00pm", is_open: true },
          { label: "Sunday", from: "10:00am", to: "4:00pm", is_open: true },
        ],
      },
    ];

    const result = transformWorkHours(input);
    
    expect(result.salesHours.monday).toBe("9:00am - 6:00pm");
    expect(result.salesHours.friday).toBe("9:00am - 8:00pm");
    expect(result.salesHours.saturday).toBe("9:00am - 5:00pm");
    expect(result.salesHours.sunday).toBe("10:00am - 4:00pm");
  });
});
