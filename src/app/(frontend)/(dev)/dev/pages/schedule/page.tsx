import { DevPageContainer } from "../../_components/DevPageContainer";
import { DevSection } from "../../_components/DevSection";
import SchedulePageView from "@/modules/schedule/SchedulePageView";
import { emptySchedulePreviewFixture, schedulePreviewFixture } from "@/modules/schedule/fixtures";

export const metadata = {
  title: "Schedule Page Modules - Dev",
  description: "固定DTOでタイムスケジュールの日付・天候切り替えを確認",
};

export default function DevSchedulePage() {
  return (
    <DevPageContainer
      title="Schedule Page"
      description="CMSデータを使わず、日付・天候・単独会場・会場グループ・任意分刻みのカード配置を確認"
    >
      <DevSection title="Day and weather filters">
        <div className="mx-auto w-full max-w-107.5 overflow-clip md:max-w-none">
          <SchedulePageView data={schedulePreviewFixture} />
        </div>
      </DevSection>
      <DevSection title="No timetable venues">
        <div className="mx-auto w-full max-w-107.5 overflow-clip md:max-w-none">
          <SchedulePageView data={emptySchedulePreviewFixture} />
        </div>
      </DevSection>
    </DevPageContainer>
  );
}
