import ProductSkeleton from "./ProductSkeleton";

type ProductSkeletonGridProps = {
  count?: number;
};

export default function ProductSkeletonGrid({
  count = 8,
}: ProductSkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}