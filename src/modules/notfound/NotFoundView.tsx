import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div>Oh　No！</div>
      <div>404</div>
      <div>Page　Not　Found</div>
      <div>お探しのページは見つかりませんでした</div>
    </div>
  );
}

function NotFoundSkeleton() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200"></div>
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
    </div>
  );
}

export default function NotFoundView() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-base py-4l">
      <Suspense fallback={<NotFoundSkeleton />}>
        <NotFoundContent />
      </Suspense>
    </div>
  );
}
