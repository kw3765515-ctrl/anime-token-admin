import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/UserTable";
import { TopupDialog } from "@/components/TopupDialog";
import { fetchUsers, addTokens, type User } from "@/lib/api";
import { RefreshCw, Search, Users, Coins, ArrowUpDown } from "lucide-react";
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

  const handleTopup = async (userId: number, amount: number, reason: string) => {
    try {
      const res = await addTokens(userId, amount, reason);
      if (res.success) {
        toast.success(`เติม ${amount} tokens สำเร็จ!`);
        loadUsers();
      } else {
        toast.error(res.message || "เกิดข้อผิดพลาด");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Coins className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Admin Topup</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              รีเฟรช
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">ผู้ใช้ทั้งหมด</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="h-4 w-4" />
              <span className="text-sm">โทเค่นรวม</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalTokens.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาผู้ใช้..."
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokens">เรียงตามโทเค่น</SelectItem>
              <SelectItem value="name">เรียงตามชื่อ</SelectItem>
              <SelectItem value="id">เรียงตาม ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
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
