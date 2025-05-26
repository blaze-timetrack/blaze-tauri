import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import ScheduleDashboard from "@/components/ScheduleDashboard";

function Home() {
  return (
    <div className={"w-full"}>
      <div className="mx-12 flex justify-start gap-10">
        <ScheduleDashboard />
        <ActivitiesSummaryDemo />
      </div>
    </div>
  );
}

export default Home;
