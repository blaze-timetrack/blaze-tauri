"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ActivityData {
  name: string;
  duration: string;
  color: string;
  percentage: number;
}

interface CategoryData {
  name: string;
  percentage: number;
  duration: string;
  color: string;
}

const activities: ActivityData[] = [
  { name: "Flow", duration: "3hr 15min", color: "#F59E0B", percentage: 48 },
  { name: "Deep", duration: "1hr", color: "#10B981", percentage: 15 },
  { name: "Break", duration: "1hr 32min", color: "#3B82F6", percentage: 23 },
  { name: "Other", duration: "51min", color: "#8B5CF6", percentage: 14 },
];

const categories: CategoryData[] = [
  { name: "Coding", percentage: 88, duration: "2hr 16min", color: "#8B5CF6" },
  { name: "Design", percentage: 22, duration: "1hr 16min", color: "#8B5CF6" },
  { name: "Finance", percentage: 8, duration: "30min", color: "#8B5CF6" },
];

// @ts-ignore
const CircularProgress = ({ activities }: { activities: ActivityData[] }) => {
  const radius = 45;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  let cumulativePercentage = 0;

  return (
    <div className="relative h-24 w-24">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90 transform"
      >
        {/* Background circle */}
        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Activity segments */}
        {activities.map((activity, index) => {
          const strokeDasharray = `${(activity.percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset =
            circumference - (cumulativePercentage / 100) * circumference;
          cumulativePercentage += activity.percentage;

          return (
            <circle
              key={index}
              stroke={activity.color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={-strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function DailySummary() {
  return (
    <Card className="mb-2 h-fit w-[458px] min-w-[324px] gap-2 border-gray-800 bg-gray-900 text-white">
      <CardHeader className="py-0">
        <CardTitle className="text-lg font-medium text-gray-100">
          Daily Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 lg:space-y-4">
        {/* Work Hours Section */}
        <div className="space-y-2">
          <div className="flex justify-between lg:items-baseline">
            <div>
              <p className="mb-1 text-sm text-gray-400">Work hours</p>
              <p className="text-2xl font-semibold">6hrs 45min</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-400">Percentage of</p>
              <p className="text-sm text-gray-400">Target</p>
              <p className="text-lg font-medium text-white">
                80% <span className="text-sm text-gray-400">of the Goal</span>
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Breakdown</p>

          <div className="flex items-center gap-6">
            {/*<CircularProgress activities={activities} />*/}

            <div className="flex-1 space-y-2">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className="text-gray-300">{activity.name}</span>
                  </div>
                  <span className="text-gray-400">{activity.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories Section */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Top Categories</p>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {category.percentage}%
                    </span>
                    <span className="text-gray-300">{category.name}</span>
                  </div>
                  <span className="text-gray-400">{category.duration}</span>
                </div>
                <Progress
                  value={category.percentage}
                  className="h-2 bg-gray-700"
                  style={
                    {
                      "--progress-background": category.color,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
