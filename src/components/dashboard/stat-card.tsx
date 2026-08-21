"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "blue" | "emerald" | "violet" | "amber" | "rose";
}

const colorMap = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    trend: "text-blue-400",
    glow: "shadow-blue-500/5",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    trend: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: "text-violet-400",
    trend: "text-violet-400",
    glow: "shadow-violet-500/5",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    trend: "text-amber-400",
    glow: "shadow-amber-500/5",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: "text-rose-400",
    trend: "text-rose-400",
    glow: "shadow-rose-500/5",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <Card className={`border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/80 transition-all duration-300 shadow-lg ${colors.glow}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <p className="text-3xl font-bold text-zinc-100 tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="text-xs text-zinc-500">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    trend.isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-zinc-500">vs yesterday</span>
              </div>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.border} border`}>
            <span className={colors.icon}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
