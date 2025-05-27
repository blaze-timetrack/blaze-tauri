import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ActivitiesSummary() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
        <CardDescription>activities, flows, breaks, meetings</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}

export default ActivitiesSummary;
