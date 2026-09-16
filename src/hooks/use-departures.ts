"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Departure } from "@/types";

/**
 * Live seat availability must always be fetched fresh (never cached) - this is
 * the client-side counterpart to the ISR'd tour detail page. Backed by
 * GET /api/public/tours/{id}/departures.
 */
export function useTourDepartures(tourId: string) {
  return useQuery({
    queryKey: ["public-departures", tourId],
    queryFn: () => api.get<Departure[]>(`/api/public/tours/${tourId}/departures`, { skipAuth: true }),
    staleTime: 0,
    gcTime: 0,
    enabled: !!tourId,
  });
}

export function seatsAvailable(d: Departure) {
  return Math.max(0, d.capacity - d.seatsHeld - d.seatsConfirmed);
}
