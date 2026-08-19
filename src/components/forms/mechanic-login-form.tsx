"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Wrench } from "lucide-react";
import { authStorageKeys, mechanicDemoCredentials } from "@/mock/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function MechanicLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem(authStorageKeys.mechanic);
    if (token) router.replace("/mechanic");
  }, [router]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!phone || !password) {
      setError("Please enter phone number and password.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      if (phone === mechanicDemoCredentials.phone && password === mechanicDemoCredentials.password) {
        window.localStorage.setItem(authStorageKeys.mechanic, "logged_in");
        setSuccess("Login successful. Redirecting to mechanic dashboard...");
        router.push("/mechanic");
      } else {
        setError("Invalid credentials. Use the demo credentials shown below.");
      }
      setLoading(false);
    }, 650);
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]/50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Wrench className="h-5 w-5" />
            </div>
            <CardTitle className="font-heading text-2xl">Mechanic Login</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">Sign in to manage assigned jobs and earnings.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={loading}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((state) => !state)}
                  className="absolute right-2 top-2.5 grid h-6 w-6 place-items-center text-[var(--muted-foreground)]"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
              {success ? <p className="text-sm text-[var(--success)]">{success}</p> : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login to Mechanic Portal
              </Button>
            </form>

            <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              <p className="font-semibold text-[var(--foreground)]">Demo credentials</p>
              <p>Phone: {mechanicDemoCredentials.phone}</p>
              <p>Password: {mechanicDemoCredentials.password}</p>
            </div>

            <div className="mt-4 text-sm text-[var(--muted-foreground)]">
              Admin portal? <Link href="/admin/login" className="text-[var(--primary)]">Sign in here</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
