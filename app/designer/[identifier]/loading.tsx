import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen p-4 animate-fade-in w-full" dir="rtl">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      {/* Gallery Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-80 flex flex-col">
            <CardHeader className="p-3 pb-0">
              <div className="flex gap-2 mb-2">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Skeleton className="h-40 w-full rounded-t-xl mb-2" />
              <div className="flex gap-4 px-4 py-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-14" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between gap-2 px-4 py-2 mt-auto">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 