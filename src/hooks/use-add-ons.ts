"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AddOnService } from "@/types";

export function useAddOns(tourId?: string, departureId?: string) {
  return useQuery({
    queryKey: ["add-ons", tourId, departureId],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (tourId) qs.set("tourId", tourId);
      if (departureId) qs.set("departureId", departureId);
      return api.get<AddOnService[]>(`/api/add-ons?${qs.toString()}`, { skipAuth: true });
    },
    enabled: !!(tourId || departureId),
    staleTime: 60_000,
  });
}
