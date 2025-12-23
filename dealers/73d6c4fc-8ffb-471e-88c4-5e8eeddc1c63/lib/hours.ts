/**
 * Work hours transformation utilities
 * @module lib/hours
 */

import type { DealerWorkHours } from '@dealertower/lib/api/dealer';

/**
 * Department hours structure for display
 */
export interface DepartmentHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

/**
 * Result of transforming dealer work hours
 */
export interface TransformedWorkHours {
  salesHours: DepartmentHours;
  serviceHours: DepartmentHours;
  partsHours: DepartmentHours;
}

/**
 * Creates a default hours object with all days closed
 */
function createDefaultHours(): DepartmentHours {
  return {
    monday: "Closed",
    tuesday: "Closed",
    wednesday: "Closed",
    thursday: "Closed",
    friday: "Closed",
    saturday: "Closed",
    sunday: "Closed",
  };
}

/**
 * Transforms API work hours data into department-specific hours objects
 * 
 * @param workHours - Array of work hours from the dealer API
 * @returns Object containing hours for sales, service, and parts departments
 * 
 * @example
 * const hours = transformWorkHours(dealerData.work_hours);
 * console.log(hours.salesHours.monday); // "9:00am - 6:00pm"
 */
export function transformWorkHours(
  workHours: DealerWorkHours[]
): TransformedWorkHours {
  const salesHours = createDefaultHours();
  const serviceHours = createDefaultHours();
  const partsHours = createDefaultHours();

  workHours.forEach((dept) => {
    let targetHours: DepartmentHours;
    
    if (dept.label.toLowerCase().includes("sales")) {
      targetHours = salesHours;
    } else if (dept.label.toLowerCase().includes("service")) {
      targetHours = serviceHours;
    } else if (dept.label.toLowerCase().includes("parts")) {
      targetHours = partsHours;
    } else {
      return;
    }

    dept.value.forEach((day) => {
      const dayName = day.label.toLowerCase() as keyof DepartmentHours;
      if (dayName in targetHours) {
        // Format: "from - to" or "Closed" if not open
        if (day.is_open && day.from && day.to) {
          targetHours[dayName] = `${day.from} - ${day.to}`;
        } else {
          targetHours[dayName] = "Closed";
        }
      }
    });
  });

  return { salesHours, serviceHours, partsHours };
}
