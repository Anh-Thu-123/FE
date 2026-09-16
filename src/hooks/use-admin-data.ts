"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Tour,
  Departure,
  Booking,
  Customer,
  TourRequest,
  Assignment,
  VisaCase,
  Employee,
  LeaveRequest,
  Attendance,
  RevenuePoint,
  OccupancyPoint,
  GuidePerformancePoint,
  PageResult,
} from "@/types";

function qs(params: Record<string, string | number | undefined>) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") s.set(k, String(v));
  });
  const str = s.toString();
  return str ? `?${str}` : "";
}

/* ------------------------------------ Tours ------------------------------------ */
export function useTours() {
  return useQuery({
    queryKey: ["admin-tours"],
    queryFn: () => api.get<Tour[] | PageResult<Tour>>("/api/tours"),
  });
}

export function useCreateTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Tour>) => api.post<Tour>("/api/tours", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tours"] }),
  });
}

export function useUpdateTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Tour> }) =>
      api.put<Tour>(`/api/tours/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tours"] }),
  });
}

/* ---------------------------------- Departures ---------------------------------- */
export function useDepartures(params: { from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ["admin-departures", params],
    queryFn: () => api.get<Departure[]>(`/api/departures/calendar${qs(params)}`),
  });
}

export function useBelowMinimumDepartures() {
  return useQuery({
    queryKey: ["departures-below-minimum"],
    queryFn: () => api.get<Departure[]>("/api/departures/below-minimum"),
  });
}

export function useCreateDeparture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Departure>) => api.post<Departure>("/api/departures", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-departures"] }),
  });
}

/* ----------------------------------- Bookings ----------------------------------- */
export function useAdminBookings(params: { status?: string; departureId?: string; q?: string } = {}) {
  return useQuery({
    queryKey: ["admin-bookings", params],
    queryFn: () => api.get<Booking[] | PageResult<Booking>>(`/api/bookings${qs(params)}`),
  });
}

export function useConfirmBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Booking>(`/api/bookings/${id}/confirm`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.patch<Booking>(`/api/bookings/${id}/cancel`, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { direction: "RECEIPT" | "REFUND"; amount: number; method: "CASH" | "BANK_TRANSFER"; reference?: string; note?: string };
    }) => api.post<Booking>(`/api/bookings/${id}/payments`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
}

/* ----------------------------------- Customers ---------------------------------- */
export function useCustomers(q?: string) {
  return useQuery({
    queryKey: ["admin-customers", q],
    queryFn: () => api.get<Customer[] | PageResult<Customer>>(`/api/customers${qs({ q })}`),
  });
}

/* --------------------------------- Tour requests -------------------------------- */
export function useTourRequests(params: { status?: string; assigneeId?: string } = {}) {
  return useQuery({
    queryKey: ["admin-tour-requests", params],
    queryFn: () => api.get<TourRequest[]>(`/api/tour-requests${qs(params)}`),
  });
}

export function useAssignTourRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
      api.patch<TourRequest>(`/api/tour-requests/${id}/assign`, { assigneeId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tour-requests"] }),
  });
}

export function useCreateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.post<TourRequest>(`/api/tour-requests/${id}/quotes`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tour-requests"] }),
  });
}

/* ---------------------------------- Assignments ---------------------------------- */
export function useAssignments() {
  return useQuery({
    queryKey: ["admin-assignments"],
    queryFn: () => api.get<Assignment[]>("/api/assignments/availability"),
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Assignment>) => api.post<Assignment>("/api/assignments", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-assignments"] }),
  });
}

/* ----------------------------------- Visa cases ----------------------------------- */
export function useVisaCases(params: { status?: string; dueBefore?: string } = {}) {
  return useQuery({
    queryKey: ["admin-visa-cases", params],
    queryFn: () => api.get<VisaCase[]>(`/api/visa-cases${qs(params)}`),
  });
}

export function useUpdateVisaCaseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch<VisaCase>(`/api/visa-cases/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-visa-cases"] }),
  });
}

/* ----------------------------------- Employees ------------------------------------ */
export function useEmployees() {
  return useQuery({
    queryKey: ["admin-employees"],
    queryFn: () => api.get<Employee[]>("/api/employees"),
  });
}

/* --------------------------------- Leave requests ---------------------------------- */
export function useLeaveRequests() {
  return useQuery({
    queryKey: ["admin-leave-requests"],
    queryFn: () => api.get<LeaveRequest[]>("/api/leave-requests"),
  });
}

export function useSubmitLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<LeaveRequest>) => api.post<LeaveRequest>("/api/leave-requests", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leave-requests"] }),
  });
}

export function useDecideLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, decisionNote }: { id: string; status: "APPROVED" | "REJECTED"; decisionNote?: string }) =>
      api.patch<LeaveRequest>(`/api/leave-requests/${id}/decision`, { status, decisionNote }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leave-requests"] }),
  });
}

/* ------------------------------------ Attendance ------------------------------------ */
export function useAttendance(month?: string, employeeId?: string) {
  return useQuery({
    queryKey: ["admin-attendance", month, employeeId],
    queryFn: () => api.get<Attendance[]>(`/api/attendance${qs({ month, employeeId })}`),
  });
}

/* -------------------------------------- Reports -------------------------------------- */
export function useRevenueReport(params: { from?: string; to?: string; groupBy?: string; basis?: string } = {}) {
  return useQuery({
    queryKey: ["report-revenue", params],
    queryFn: () => api.get<RevenuePoint[]>(`/api/reports/revenue${qs(params)}`),
  });
}

export function useOccupancyReport() {
  return useQuery({
    queryKey: ["report-occupancy"],
    queryFn: () => api.get<OccupancyPoint[]>("/api/reports/occupancy"),
  });
}

export function useGuidePerformanceReport() {
  return useQuery({
    queryKey: ["report-guide-performance"],
    queryFn: () => api.get<GuidePerformancePoint[]>("/api/reports/guide-performance"),
  });
}
