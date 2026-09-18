import { Skeleton } from "@/components/ui/skeleton";
import { TourGridSkeleton } from "@/components/public/tour-card-skeleton";

export default function ToursLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />
      <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
      <Skeleton className="mt-6 mb-6 h-4 w-24" />
      <TourGridSkeleton />
    </div>
  );
}
