import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import ScheduleDashboard from "@/components/ScheduleDashboard";

function Home() {
  return (
    <div className={"col-span-11 w-full"}>
      <div className="mr-8 flex justify-end">
        <ScheduleDashboard />
        <ActivitiesSummaryDemo />
      </div>
    </div>
  );
}

export default Home;
