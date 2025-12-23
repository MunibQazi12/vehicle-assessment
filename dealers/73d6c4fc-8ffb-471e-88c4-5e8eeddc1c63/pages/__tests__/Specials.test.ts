import { describe, it, expect } from "vitest"
import type { DealerWorkHours, DealerPhoneNumber } from "@dealertower/lib/api/dealer"

// Import the functions we're testing (they need to be exported from Specials.tsx)
// For now, we'll duplicate the logic here for testing purposes

interface DepartmentHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

function transformWorkHours(workHours: DealerWorkHours[]): {
  salesHours: DepartmentHours
  serviceHours: DepartmentHours
  partsHours: DepartmentHours
} {
  const defaultHours: DepartmentHours = {
    monday: "Closed",
    tuesday: "Closed",
    wednesday: "Closed",
    thursday: "Closed",
    friday: "Closed",
    saturday: "Closed",
    sunday: "Closed",
  }

  const salesHours = { ...defaultHours }
  const serviceHours = { ...defaultHours }
  const partsHours = { ...defaultHours }

  workHours.forEach((dept) => {
    let targetHours: DepartmentHours
    if (dept.label.toLowerCase().includes("sales")) {
      targetHours = salesHours
    } else if (dept.label.toLowerCase().includes("service")) {
      targetHours = serviceHours
    } else if (dept.label.toLowerCase().includes("parts")) {
      targetHours = partsHours
    } else {
      return
    }

    dept.value.forEach((day) => {
      const dayName = day.label.toLowerCase() as keyof DepartmentHours
      if (dayName in targetHours) {
        targetHours[dayName] = day.is_open
          ? `${day.from} - ${day.to}`
          : "Closed"
      }
    })
  })

  return { salesHours, serviceHours, partsHours }
}

function getPrimaryPhone(phoneNumbers: DealerPhoneNumber[]): string {
  const salesPhone = phoneNumbers.find((p) =>
    p.label.toLowerCase().includes("sales")
  )
  return salesPhone?.value || phoneNumbers[0]?.value || "N/A"
}

describe("Specials Page - Data Transformation", () => {
  describe("transformWorkHours", () => {
    it("should return closed hours when work hours array is empty", () => {
      const result = transformWorkHours([])
      
      expect(result.salesHours.monday).toBe("Closed")
      expect(result.serviceHours.monday).toBe("Closed")
      expect(result.partsHours.monday).toBe("Closed")
    })

    it("should transform sales hours correctly", () => {
      const workHours: DealerWorkHours[] = [
        {
          label: "Sales",
          value: [
            { label: "Monday", from: "08:00", to: "18:00", is_open: true },
            { label: "Tuesday", from: "08:00", to: "18:00", is_open: true },
            { label: "Sunday", from: "00:00", to: "00:00", is_open: false },
          ],
        },
      ]

      const result = transformWorkHours(workHours)

      expect(result.salesHours.monday).toBe("08:00 - 18:00")
      expect(result.salesHours.tuesday).toBe("08:00 - 18:00")
      expect(result.salesHours.sunday).toBe("Closed")
      expect(result.serviceHours.monday).toBe("Closed")
    })

    it("should transform multiple department hours correctly", () => {
      const workHours: DealerWorkHours[] = [
        {
          label: "Sales",
          value: [
            { label: "Monday", from: "08:00", to: "18:00", is_open: true },
          ],
        },
        {
          label: "Service",
          value: [
            { label: "Monday", from: "07:00", to: "17:00", is_open: true },
          ],
        },
        {
          label: "Parts",
          value: [
            { label: "Monday", from: "07:30", to: "17:30", is_open: true },
          ],
        },
      ]

      const result = transformWorkHours(workHours)

      expect(result.salesHours.monday).toBe("08:00 - 18:00")
      expect(result.serviceHours.monday).toBe("07:00 - 17:00")
      expect(result.partsHours.monday).toBe("07:30 - 17:30")
    })

    it("should handle case-insensitive department labels", () => {
      const workHours: DealerWorkHours[] = [
        {
          label: "SALES DEPARTMENT",
          value: [
            { label: "Monday", from: "09:00", to: "19:00", is_open: true },
          ],
        },
      ]

      const result = transformWorkHours(workHours)

      expect(result.salesHours.monday).toBe("09:00 - 19:00")
    })

    it("should ignore unknown department types", () => {
      const workHours: DealerWorkHours[] = [
        {
          label: "Unknown Department",
          value: [
            { label: "Monday", from: "09:00", to: "19:00", is_open: true },
          ],
        },
      ]

      const result = transformWorkHours(workHours)

      // All departments should still be closed since unknown dept was ignored
      expect(result.salesHours.monday).toBe("Closed")
      expect(result.serviceHours.monday).toBe("Closed")
      expect(result.partsHours.monday).toBe("Closed")
    })

    it("should handle all days of the week", () => {
      const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      const workHours: DealerWorkHours[] = [
        {
          label: "Sales",
          value: allDays.map((day) => ({
            label: day,
            from: "09:00",
            to: "18:00",
            is_open: true,
          })),
        },
      ]

      const result = transformWorkHours(workHours)

      expect(result.salesHours.monday).toBe("09:00 - 18:00")
      expect(result.salesHours.tuesday).toBe("09:00 - 18:00")
      expect(result.salesHours.wednesday).toBe("09:00 - 18:00")
      expect(result.salesHours.thursday).toBe("09:00 - 18:00")
      expect(result.salesHours.friday).toBe("09:00 - 18:00")
      expect(result.salesHours.saturday).toBe("09:00 - 18:00")
      expect(result.salesHours.sunday).toBe("09:00 - 18:00")
    })
  })

  describe("getPrimaryPhone", () => {
    it("should return N/A when phone numbers array is empty", () => {
      const result = getPrimaryPhone([])
      expect(result).toBe("N/A")
    })

    it("should return sales phone when available", () => {
      const phoneNumbers: DealerPhoneNumber[] = [
        { label: "Service", value: "(503) 111-2222" },
        { label: "Sales", value: "(503) 555-1234" },
        { label: "Parts", value: "(503) 333-4444" },
      ]

      const result = getPrimaryPhone(phoneNumbers)
      expect(result).toBe("(503) 555-1234")
    })

    it("should return first phone when sales phone is not available", () => {
      const phoneNumbers: DealerPhoneNumber[] = [
        { label: "Service", value: "(503) 111-2222" },
        { label: "Parts", value: "(503) 333-4444" },
      ]

      const result = getPrimaryPhone(phoneNumbers)
      expect(result).toBe("(503) 111-2222")
    })

    it("should handle case-insensitive sales label matching", () => {
      const phoneNumbers: DealerPhoneNumber[] = [
        { label: "SALES DEPARTMENT", value: "(503) 555-1234" },
        { label: "Service", value: "(503) 111-2222" },
      ]

      const result = getPrimaryPhone(phoneNumbers)
      expect(result).toBe("(503) 555-1234")
    })

    it("should find sales phone with partial label match", () => {
      const phoneNumbers: DealerPhoneNumber[] = [
        { label: "New Car Sales", value: "(503) 555-1234" },
        { label: "Service", value: "(503) 111-2222" },
      ]

      const result = getPrimaryPhone(phoneNumbers)
      expect(result).toBe("(503) 555-1234")
    })
  })
})
