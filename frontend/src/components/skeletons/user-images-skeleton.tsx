import { Skeleton } from '../ui/skeleton';

type UserImagesSkeletonProps = {
  inputCount?: number;
};

const UserImagesSkeleton = ({ inputCount = 1 }: UserImagesSkeletonProps) => {
  return (
    <div className="grid grid-cols-12 gap-3">
      {[...Array(inputCount)].map((_, index) => (
        <div className="relative col-span-2 space-y-2" key={index}>
          <Skeleton className="border-muted aspect-square w-full rounded-md border-2" />
          <Skeleton className="mx-auto h-5 w-3/4" />
        </div>
      ))}
    </div>
  );
};

export default UserImagesSkeleton;
