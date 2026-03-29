import React from "react";
export default function Frame(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="px-ll">
    <div className="bg-main">
        <div className="bg-base-dark border-main border-2 rounded-3xl text-white flex px-m py-ll">
            {children}
        </div>
    </div>
    </div>
  );
}