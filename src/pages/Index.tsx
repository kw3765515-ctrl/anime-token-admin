import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/UserTable";
import { TopupDialog } from "@/components/TopupDialog";
import { StatsCards } from "@/components/StatsCards";
import { fetchUsers, addTokens, type User } from "@/lib/api";
import {
  RefreshCw,
  Search,
  ArrowUpDown,
  Coins,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("tokens");
  const [topupUser, setTopupUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (e: any) {
      toast.error(e.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    let list = users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
        String(u.userId).includes(search)
    );
    list.sort((a, b) => {
      if (sortBy === "tokens") return (b.tokens || 0) - (a.tokens || 0);
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return a.userId - b.userId;
    });
    return list;
  }, [users, search, sortBy]);

  const totalTokens = users.reduce((s, u) => s + (u.tokens || 0), 0);
  const avgTokens = users.length > 0 ? Math.round(totalTokens / users.length) : 0;

  const handleTopup = async (userId: number, amount: number, reason: string) => {
    try {
      const res = await addTokens(userId, amount, reason);
      if (res.success) {
        toast.success(`เติม ${amount.toLocaleString()} tokens สำเร็จ! 🎉`);
        loadUsers();
      } else {
        toast.error(res.message || "เกิดข้อผิดพลาด");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-toolbar sticky top-0 z-10 border-b px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="stat-card-purple flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Admin Topup
              </h1>
              <p className="text-xs text-muted-foreground">ระบบจัดการโทเค่น</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
              <Coins className="h-3.5 w-3.5" />
              {users.length} ผู้ใช้
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={loading}
              className="gap-1.5 rounded-full"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              รีเฟรช
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsCards
          totalUsers={users.length}
          totalTokens={totalTokens}
          avgTokens={avgTokens}
          loading={loading}
        />

        {/* Filter bar */}
        <div className="animate-fade-in flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, username, หรือ ID..."
              className="rounded-xl pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] rounded-xl">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokens">
                <span className="flex items-center gap-2"><Coins className="h-3.5 w-3.5" /> เรียงตามโทเค่น</span>
              </SelectItem>
              <SelectItem value="name">เรียงตามชื่อ</SelectItem>
              <SelectItem value="id">เรียงตาม ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="animate-slide-up overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <LayoutDashboard className="h-4 w-4" />
              รายชื่อผู้ใช้
              {!loading && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {filtered.length}
                </span>
              )}
            </h2>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <UserTable
              users={filtered}
              onTopup={(user) => {
                setTopupUser(user);
                setDialogOpen(true);
              }}
            />
          )}
        </div>
      </main>

      <TopupDialog
        user={topupUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleTopup}
      />
    </div>
  );
};

export default Index;
