import ActivitiesSummaryDemo from "@/components/shared/activities-summary-demo.tsx";
import ScheduleDashboard from "src/components/schedule dashboard";

function Home() {
  return (
    <div className={"row-span-16 w-full"}>
      <div className="row-span-16 mx-8 flex justify-start gap-6 lg:mx-12">
        <ScheduleDashboard />
        <ActivitiesSummaryDemo />
      </div>
    </div>
  );
}

export default Home;
