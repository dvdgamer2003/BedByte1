import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const HospitalCardSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
    </Card>
  );
};

export default HospitalCardSkeleton;
