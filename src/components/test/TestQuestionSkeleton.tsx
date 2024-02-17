const TestQuestionSkeleton = () => {
  return (
    <>
      <h2 className="mb-2 text-2xl font-bold">Loading new question...</h2>
      <div className="flex flex-col space-y-2">
        <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
        <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
        <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
        <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
      </div>
    </>
  );
};

export default TestQuestionSkeleton;
