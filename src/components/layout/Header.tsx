import Image from "next/image";
export default function Page() {
  return (
  <div className="fixed top-0 w-full bg-white px-3 py-5 gap-5 flex items-center z-10">
    <Image src="/icon/45th-logo-top.svg" alt="Logo" width={48} height={48}/>
    <div className="text-title text-base-dark font-kaisotai">45th NUTFES</div>
  </div>

  );
} 
