import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ActivityData {
  name: string;
  value: number;
  color: string;
}

const data: ActivityData[] = [
  { name: "Deep Work", value: 180, color: "#c084fc" },
  { name: "Flow Sessions", value: 150, color: "#fbbf24" },
  { name: "Meetings", value: 60, color: "#2dd4bf" },
  { name: "Projects", value: 240, color: "#f87171" },
];

const ActivityPieChart = () => {
  return (
    <Card className="w-[300px] border-gray-800 bg-black/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Daily Activity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <ul className="mt-4 flex flex-wrap justify-center gap-4">
                    {payload?.map((entry, index) => (
                      <li
                        key={`legend-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-300">
                          {entry.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityPieChart;
