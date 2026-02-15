import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Loader2, Sparkles, Gift, Zap, Gem } from "lucide-react";
import type { User } from "@/lib/api";

interface TopupDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: number, amount: number, reason: string) => Promise<void>;
}

const quickAmounts = [
  { value: 50, icon: Zap, label: "50" },
  { value: 100, icon: Gift, label: "100" },
  { value: 500, icon: Sparkles, label: "500" },
  { value: 1000, icon: Gem, label: "1K" },
];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="stat-card-purple flex h-8 w-8 items-center justify-center rounded-lg">
              <Coins className="h-4 w-4 text-primary-foreground" />
            </div>
            เติมโทเค่น
          </DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-5">
            {/* User info card */}
            <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
              <div className="stat-card-blue flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-primary-foreground">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user.name || "ผู้ใช้"}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Coins className="h-3.5 w-3.5" />
                  ปัจจุบัน: {(user.tokens ?? 0).toLocaleString()} tokens
                </p>
              </div>
            </div>

            {/* Quick amount buttons */}
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">เลือกจำนวน</label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((q) => {
                  const Icon = q.icon;
                  const isSelected = amount === String(q.value);
                  return (
                    <button
                      key={q.value}
                      onClick={() => setAmount(String(q.value))}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      +{q.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                หรือระบุจำนวนเอง
              </label>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="จำนวนโทเค่น"
                className="text-lg font-semibold"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                หมายเหตุ (ไม่บังคับ)
              </label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="เหตุผลในการเติม..."
              />
            </div>

            {/* Preview */}
            {amount && parseInt(amount) > 0 && (
              <div className="stat-card-green animate-fade-in rounded-xl p-4 text-center text-primary-foreground">
                <p className="text-sm font-medium text-white/80">จะเพิ่มเป็น</p>
                <p className="text-3xl font-bold">
                  {((user.tokens ?? 0) + parseInt(amount)).toLocaleString()}
                </p>
                <p className="text-sm text-white/70">tokens (+{parseInt(amount).toLocaleString()})</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !amount || parseInt(amount) < 1}
                className="gap-2 rounded-full px-6 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                ยืนยันเติม
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
