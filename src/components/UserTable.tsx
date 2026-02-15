import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Coins, Plus, User as UserIcon } from "lucide-react";
import type { User } from "@/lib/api";

interface UserTableProps {
  users: User[];
  onTopup: (user: User) => void;
}

export function UserTable({ users, onTopup }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <UserIcon className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-sm">ไม่พบข้อมูลผู้ใช้</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>ชื่อผู้ใช้</TableHead>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">โทเค่น</TableHead>
            <TableHead className="text-center">บัญชี</TableHead>
            <TableHead className="text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => (
            <TableRow key={user.userId} className="animate-fade-in group">
              <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{user.name || "ไม่มีชื่อ"}</p>
                    {user.username && (
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                {user.userId}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-sm font-semibold text-warning">
                  <Coins className="h-3.5 w-3.5" />
                  {user.tokens ?? 0}
                </span>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {user.accountCount ?? 0}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => onTopup(user)}
                  className="opacity-70 transition-opacity group-hover:opacity-100"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  เติม
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
