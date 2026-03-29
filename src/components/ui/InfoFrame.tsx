import React from "react";
export default function InfoFrame(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="px-ll">
    <div className="bg-main">
        <div className="bg-base-dark border-main border-2 rounded-3xl text-white px-m py-ll  gap-y-8">
            {children}
        </div>
    </div>
    </div>
  );
}