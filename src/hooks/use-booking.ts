"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Booking, Departure } from "@/types";

/**
 * Not explicitly listed in muc 07 as a standalone endpoint, but implied by the
 * booking flow (step 1 needs departure details before the hold call). Falls
 * back gracefully if the backend instead only exposes the list endpoint.
 */
export function useDepartureById(departureId: string) {
  return useQuery({
    queryKey: ["departure", departureId],
    queryFn: () => api.get<Departure>(`/api/public/departures/${departureId}`, { skipAuth: true }),
    enabled: !!departureId,
    staleTime: 0,
    retry: 0,
  });
}

export interface HoldBookingPayload {
  departureId: string;
  contact: { fullName: string; phone: string; email?: string };
  pax: Array<{
    fullName: string;
    dob: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    paxType: "ADULT" | "CHILD" | "INFANT";
    occupiesSeat: boolean;
    nationality: string;
    passportNo?: string;
    dietary?: string;
    note?: string;
  }>;
  addOns: Array<{ addOnId: string; quantity: number; paxIds?: string[] }>;
}

export function useHoldBooking() {
  return useMutation({
    mutationFn: (payload: HoldBookingPayload) =>
      api.post<Booking>("/api/bookings/hold", payload),
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.get<Booking[]>("/api/bookings/me"),
  });
}
