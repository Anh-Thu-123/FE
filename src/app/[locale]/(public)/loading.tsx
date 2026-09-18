import { Skeleton } from "@/components/ui/skeleton";
import { TourGridSkeleton } from "@/components/public/tour-card-skeleton";

export default function PublicLoading() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
        <Skeleton className="mx-auto h-14 w-3/4 max-w-2xl" />
        <Skeleton className="mx-auto mt-5 h-5 w-2/3 max-w-xl" />
        <div className="mt-9 flex justify-center gap-3">
          <Skeleton className="h-11 w-40 rounded-full" />
          <Skeleton className="h-11 w-44 rounded-full" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <TourGridSkeleton />
      </div>
    </div>
  );
}
