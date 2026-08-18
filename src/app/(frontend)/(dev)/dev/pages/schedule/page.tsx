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
      description="CMSデータを使わず、日付・天候・会場グループ・会場と15分グリッドを確認"
    >
      <DevSection title="Day and weather filters">
        <div className="mx-auto w-full max-w-107.5 overflow-clip">
          <SchedulePageView data={schedulePreviewFixture} />
        </div>
      </DevSection>
      <DevSection title="No timetable groups">
        <div className="mx-auto w-full max-w-107.5 overflow-clip">
          <SchedulePageView data={emptySchedulePreviewFixture} />
        </div>
      </DevSection>
    </DevPageContainer>
  );
}
