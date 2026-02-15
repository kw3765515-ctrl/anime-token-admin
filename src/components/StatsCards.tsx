import { Users, Coins, TrendingUp, Clock } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  totalTokens: number;
  avgTokens: number;
  loading: boolean;
}

export function StatsCards({ totalUsers, totalTokens, avgTokens, loading }: StatsCardsProps) {
  const stats = [
    {
      label: "ผู้ใช้ทั้งหมด",
      value: totalUsers,
      suffix: "คน",
      icon: Users,
      gradient: "stat-card-blue",
    },
    {
      label: "โทเค่นรวม",
      value: totalTokens,
      suffix: "tokens",
      icon: Coins,
      gradient: "stat-card-purple",
    },
    {
      label: "เฉลี่ยต่อคน",
      value: avgTokens,
      suffix: "tokens",
      icon: TrendingUp,
      gradient: "stat-card-green",
    },
    {
      label: "อัพเดทล่าสุด",
      value: "เมื่อกี้",
      suffix: "",
      icon: Clock,
      gradient: "stat-card-orange",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.gradient} animate-slide-up relative overflow-hidden rounded-2xl p-5 text-primary-foreground shadow-lg`}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-white/5" />

            <div className="relative">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-white/80">{stat.label}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                {loading ? (
                  <div className="h-8 w-16 animate-pulse-soft rounded bg-white/20" />
                ) : (
                  <>
                    <span className="text-2xl font-bold">
                      {stat.isText ? stat.value : Number(stat.value).toLocaleString()}
                    </span>
                    {stat.suffix && <span className="text-sm text-white/70">{stat.suffix}</span>}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
