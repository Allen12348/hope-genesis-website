"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { loginFormSchema } from "@/validators/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const emailFromDom = String(fd.get("email") ?? "").trim().toLowerCase();
    const passwordFromDom = String(fd.get("password") ?? "");
    const parsed = loginFormSchema.safeParse({
      email: emailFromDom || email.trim().toLowerCase(),
      password: passwordFromDom || password,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Welcome back");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Card className="border-border/60 bg-card/95 shadow-premium backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Snowflake className="h-4 w-4" aria-hidden />
          </span>
          <span className="rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
            HGE CMS
          </span>
        </div>
        <CardTitle className="font-display text-2xl text-foreground">Admin sign in</CardTitle>
        <CardDescription className="text-muted-foreground">
          Hope Genesis Enterprises — authorized personnel only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="default" className="w-full rounded-xl font-semibold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
