const CoverLettersSkeleton = () => {
  return (
    <div className="mt-4 flex animate-pulse flex-col gap-y-4">
      <div className="card h-32 w-full bg-base-300 " />
      <div className="flex-rows flex gap-x-2">
        <div className="card h-14 w-3/4 bg-base-300 " />
        <div className="card h-14 w-1/4 bg-base-300 " />
      </div>
    </div>
  );
};

export default CoverLettersSkeleton;
