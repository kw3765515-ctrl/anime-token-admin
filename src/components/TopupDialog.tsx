import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Loader2 } from "lucide-react";
import type { User } from "@/lib/api";

interface TopupDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: number, amount: number, reason: string) => Promise<void>;
}

export function TopupDialog({ user, open, onOpenChange, onSubmit }: TopupDialogProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !amount || parseInt(amount) < 1) return;
    setLoading(true);
    try {
      await onSubmit(user.userId, parseInt(amount), reason || "เติมโทเค่นโดยแอดมิน");
      setAmount("");
      setReason("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 500, 1000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-warning" />
            เติมโทเค่น
          </DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-sm text-muted-foreground">ให้กับ</p>
              <p className="font-medium">{user.name || "ผู้ใช้"}</p>
              <p className="text-sm text-muted-foreground">ปัจจุบัน: {user.tokens} tokens</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">จำนวนโทเค่น</label>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ระบุจำนวน"
              />
              <div className="mt-2 flex gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    +{q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">หมายเหตุ (ไม่บังคับ)</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="เหตุผลในการเติม"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !amount || parseInt(amount) < 1}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Coins className="mr-2 h-4 w-4" />}
                ยืนยันเติม
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
