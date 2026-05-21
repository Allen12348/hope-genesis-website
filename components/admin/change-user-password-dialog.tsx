"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { changeUserPasswordAction } from "@/lib/actions/settings";
import {
  evaluatePasswordStrength,
  passwordStrengthBarClass,
} from "@/lib/utils/password-strength";

type TargetUser = { id: string; email: string };

function PasswordStrengthBars({ strength }: { strength: ReturnType<typeof evaluatePasswordStrength> }) {
  const activeClass = passwordStrengthBarClass[strength.level];
  return (
    <div className="flex gap-1" aria-hidden>
      {[1, 2, 3, 4].map((segment) => (
        <div
          key={segment}
          className={`h-1.5 flex-1 rounded-full ${segment <= strength.score ? activeClass : "bg-muted"}`}
        />
      ))}
    </div>
  );
}

export function ChangeUserPasswordDialog({
  user,
  open,
  onOpenChange,
}: {
  user: TargetUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const strength = evaluatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const meetsMinLength = password.length >= 8;
  const canSubmit = meetsMinLength && passwordsMatch;
  const inputType = showPassword ? "text" : "password";

  React.useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setConfirmOpen(false);
    }
  }, [open]);

  function validateForm(): string | null {
    if (!password.trim()) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!confirmPassword.trim()) return "Please confirm the new password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }

  function requestSave() {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    setConfirmOpen(true);
  }

  async function savePassword() {
    if (!user) return;
    const error = validateForm();
    if (error) {
      toast.error(error);
      setConfirmOpen(false);
      return;
    }

    setPending(true);
    const res = await changeUserPasswordAction({
      userId: user.id,
      password,
      confirmPassword,
    });
    setPending(false);
    setConfirmOpen(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    toast.success(res.message ?? "Password updated");
    onOpenChange(false);
    router.refresh();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-border bg-background text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Change password</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Set a new password for <span className="font-mono text-foreground">{user?.email}</span>. The current
              password is not shown.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="new-password" className="text-muted-foreground">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={inputType}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-background pr-10 text-foreground"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full rounded-l-none text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {password.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  <PasswordStrengthBars strength={strength} />
                  {strength.level !== "empty" ? (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium capitalize text-foreground">{strength.level}</span>
                      {strength.hint ? ` — ${strength.hint}` : null}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {password.length > 0 && !meetsMinLength ? (
                <p className="text-xs text-red-400">Minimum 8 characters required</p>
              ) : null}
            </div>

            <ConfirmPasswordField
              confirmPassword={confirmPassword}
              inputType={inputType}
              passwordsMatch={passwordsMatch}
              onConfirmChange={setConfirmPassword}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="rounded-xl border-border" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={pending || !canSubmit}
              onClick={() => requestSave()}
            >
              Save password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Confirm password change?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will replace the password for <span className="font-mono text-foreground">{user?.email}</span>.
              They will need the new password on their next sign-in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-muted/50 text-foreground" disabled={pending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                void savePassword();
              }}
            >
              {pending ? "Saving…" : "Confirm change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ConfirmPasswordField({
  confirmPassword,
  inputType,
  passwordsMatch,
  onConfirmChange,
}: {
  confirmPassword: string;
  inputType: "text" | "password";
  passwordsMatch: boolean;
  onConfirmChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor="confirm-password" className="text-muted-foreground">
        Confirm new password
      </Label>
      <Input
        id="confirm-password"
        type={inputType}
        value={confirmPassword}
        onChange={(e) => onConfirmChange(e.target.value)}
        className="border-border bg-background text-foreground"
        autoComplete="new-password"
      />
      {confirmPassword.length > 0 && !passwordsMatch ? (
        <p className="text-xs text-red-400">Passwords do not match</p>
      ) : null}
    </div>
  );
}
