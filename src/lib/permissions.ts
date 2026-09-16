/**
 * Client-side permission matrix mirroring muc 04 (Ma tran phan quyen) of the design doc.
 *
 * IMPORTANT: this is UX-only. It only controls which menu items / buttons render.
 * The backend re-checks every permission with @PreAuthorize and scoped Mongo queries
 * ("cua minh" rows must be filtered at query time). Hiding a button here is NOT security.
 *
 * Level meaning (matches the legend in the design doc):
 *  - "full": toan quyen (tao, sua, duyet, xoa)
 *  - "own": trong pham vi cua minh (doan minh dan, don minh phu trach, ho so ca nhan)
 *  - "read": chi xem
 *  - "none": khong thay trong menu
 */
import type { Role } from "@/types";

export type AccessLevel = "full" | "own" | "read" | "none";

export type Module =
  | "tours"
  | "departures"
  | "addOns"
  | "tourRequests"
  | "bookings"
  | "payments"
  | "assignments"
  | "tourLogs"
  | "visaCases"
  | "feedback"
  | "employees"
  | "accounts"
  | "attendance"
  | "leaveRequests"
  | "revenueReports"
  | "systemLogs";

const M: Record<Module, Record<Role, AccessLevel>> = {
  tours: {
    DIRECTOR: "read", SECRETARY: "read", OPS_MANAGER: "read", TOUR_DESIGNER: "full",
    TOUR_GUIDE: "read", MKT_MANAGER: "full", MKT_STAFF: "read", CUSTOMER: "read",
  },
  departures: {
    DIRECTOR: "read", SECRETARY: "read", OPS_MANAGER: "full", TOUR_DESIGNER: "read",
    TOUR_GUIDE: "read", MKT_MANAGER: "read", MKT_STAFF: "read", CUSTOMER: "read",
  },
  addOns: {
    DIRECTOR: "read", SECRETARY: "read", OPS_MANAGER: "full", TOUR_DESIGNER: "full",
    TOUR_GUIDE: "read", MKT_MANAGER: "read", MKT_STAFF: "own", CUSTOMER: "read",
  },
  tourRequests: {
    DIRECTOR: "read", SECRETARY: "none", OPS_MANAGER: "read", TOUR_DESIGNER: "full",
    TOUR_GUIDE: "none", MKT_MANAGER: "own", MKT_STAFF: "own", CUSTOMER: "own",
  },
  bookings: {
    DIRECTOR: "read", SECRETARY: "read", OPS_MANAGER: "own", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "own", MKT_MANAGER: "read", MKT_STAFF: "full", CUSTOMER: "own",
  },
  payments: {
    DIRECTOR: "read", SECRETARY: "own", OPS_MANAGER: "none", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "none", MKT_MANAGER: "read", MKT_STAFF: "full", CUSTOMER: "own",
  },
  assignments: {
    DIRECTOR: "read", SECRETARY: "read", OPS_MANAGER: "full", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "own", MKT_MANAGER: "none", MKT_STAFF: "none", CUSTOMER: "none",
  },
  tourLogs: {
    DIRECTOR: "read", SECRETARY: "none", OPS_MANAGER: "full", TOUR_DESIGNER: "read",
    TOUR_GUIDE: "own", MKT_MANAGER: "read", MKT_STAFF: "read", CUSTOMER: "none",
  },
  visaCases: {
    DIRECTOR: "read", SECRETARY: "full", OPS_MANAGER: "own", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "own", MKT_MANAGER: "none", MKT_STAFF: "own", CUSTOMER: "own",
  },
  feedback: {
    DIRECTOR: "read", SECRETARY: "none", OPS_MANAGER: "read", TOUR_DESIGNER: "read",
    TOUR_GUIDE: "own", MKT_MANAGER: "read", MKT_STAFF: "own", CUSTOMER: "own",
  },
  employees: {
    DIRECTOR: "full", SECRETARY: "full", OPS_MANAGER: "read", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "none", MKT_MANAGER: "read", MKT_STAFF: "none", CUSTOMER: "none",
  },
  accounts: {
    DIRECTOR: "full", SECRETARY: "full", OPS_MANAGER: "none", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "none", MKT_MANAGER: "none", MKT_STAFF: "none", CUSTOMER: "none",
  },
  attendance: {
    DIRECTOR: "read", SECRETARY: "full", OPS_MANAGER: "read", TOUR_DESIGNER: "own",
    TOUR_GUIDE: "own", MKT_MANAGER: "read", MKT_STAFF: "own", CUSTOMER: "none",
  },
  leaveRequests: {
    DIRECTOR: "full", SECRETARY: "own", OPS_MANAGER: "full", TOUR_DESIGNER: "own",
    TOUR_GUIDE: "own", MKT_MANAGER: "full", MKT_STAFF: "own", CUSTOMER: "none",
  },
  revenueReports: {
    DIRECTOR: "full", SECRETARY: "read", OPS_MANAGER: "own", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "none", MKT_MANAGER: "own", MKT_STAFF: "none", CUSTOMER: "none",
  },
  systemLogs: {
    DIRECTOR: "full", SECRETARY: "read", OPS_MANAGER: "none", TOUR_DESIGNER: "none",
    TOUR_GUIDE: "none", MKT_MANAGER: "none", MKT_STAFF: "none", CUSTOMER: "none",
  },
};

export function access(role: Role | undefined, module: Module): AccessLevel {
  if (!role) return "none";
  return M[module][role] ?? "none";
}

export function can(role: Role | undefined, module: Module): boolean {
  return access(role, module) !== "none";
}

export function canEdit(role: Role | undefined, module: Module): boolean {
  const level = access(role, module);
  return level === "full" || level === "own";
}
