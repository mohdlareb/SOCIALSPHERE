export function SkeletonStory() {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide select-none bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl mb-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 shimmer" />
          </div>
          <div className="w-12 h-3 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPost() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 mb-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-800 shimmer flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="w-1/3 h-4 rounded bg-gray-300 dark:bg-gray-800 shimmer" />
          <div className="w-1/4 h-3 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
        <div className="w-5/6 h-4 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
        <div className="w-2/3 h-4 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
      </div>

      {/* Image container */}
      <div className="w-full h-64 rounded-xl bg-gray-300 dark:bg-gray-800 shimmer mb-4" />

      {/* Footer Actions */}
      <div className="flex items-center gap-6">
        <div className="w-12 h-5 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
        <div className="w-16 h-5 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
      </div>
    </div>
  );
}
