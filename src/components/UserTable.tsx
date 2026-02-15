import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Coins, Plus, UserCircle, Hash, Layers, Sparkles } from "lucide-react";
import type { User } from "@/lib/api";

interface UserTableProps {
  users: User[];
  onTopup: (user: User) => void;
}

const avatarColors = [
  "from-primary to-info",
  "from-accent to-primary",
  "from-success to-info",
  "from-warning to-destructive",
  "from-info to-accent",
];

export function UserTable({ users, onTopup }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <UserCircle className="mb-4 h-16 w-16 opacity-30" strokeWidth={1} />
        <p className="text-lg font-medium">ไม่พบข้อมูลผู้ใช้</p>
        <p className="mt-1 text-sm">ลองรีเฟรชหรือตรวจสอบ API</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 hover:bg-transparent">
            <TableHead className="w-14 text-center">
              <Hash className="mx-auto h-4 w-4" />
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1.5">
                <UserCircle className="h-4 w-4" />
                ชื่อผู้ใช้
              </span>
            </TableHead>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">
              <span className="flex items-center justify-center gap-1.5">
                <Coins className="h-4 w-4" />
                โทเค่น
              </span>
            </TableHead>
            <TableHead className="text-center">
              <span className="flex items-center justify-center gap-1.5">
                <Layers className="h-4 w-4" />
                บัญชี
              </span>
            </TableHead>
            <TableHead className="text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => {
            const colorClass = avatarColors[i % avatarColors.length];
            return (
              <TableRow
                key={user.userId}
                className="animate-fade-in group transition-colors"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
              >
                <TableCell className="text-center font-medium text-muted-foreground">
                  {i + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorClass} text-sm font-bold text-primary-foreground shadow-md`}
                    >
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">{user.name || "ไม่มีชื่อ"}</p>
                      {user.username && (
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {user.userId}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="stat-card-orange inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold text-primary-foreground shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    {(user.tokens ?? 0).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" />
                    {user.accountCount ?? 0}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => onTopup(user)}
                    className="gap-1.5 rounded-full opacity-80 shadow-md transition-all group-hover:opacity-100 group-hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    เติมโทเค่น
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
