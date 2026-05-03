import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div>Oh　No！</div>  
      <div>404</div>
      <div>Page　Not　Found</div>
      <div>お探しのページは見つかりませんでした</div>
    </div>
  );
}

function NotFoundSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
      <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
      <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
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