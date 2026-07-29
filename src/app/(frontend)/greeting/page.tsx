import { notFound } from "next/navigation";
import GreetingPageView from "@/modules/greeting/GreetingPageView";

export default function Page() {
  return <GreetingPageView />;
}
