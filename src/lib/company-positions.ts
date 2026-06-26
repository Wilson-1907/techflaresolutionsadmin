/** Staff level when registering employees (positions come from API per department). */
export const STAFF_TIERS = [
  { id: "staff", label: "Staff / Developer", description: "Engineers, analysts, and specialists in the department" },
  { id: "hod", label: "Head of Department (HOD)", description: "Leads the selected department" },
  { id: "executive", label: "Executive leadership", description: "CIO, CTO, CEO, and other senior roles" },
] as const;

export type StaffTier = (typeof STAFF_TIERS)[number]["id"];
