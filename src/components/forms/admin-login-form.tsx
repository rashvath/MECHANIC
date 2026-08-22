"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { authStorageKeys } from "@/mock/auth";
import { login, setAdminToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem(authStorageKeys.admin);
    if (token) router.replace("/admin");
  }, [router]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    login(email, password)
      .then((data) => {
        if (data.user.role !== "admin") {
          setError("This account is not an admin account.");
          return;
        }

        setAdminToken(data.token);
        setSuccess("Login successful. Redirecting to admin dashboard...");
        router.push("/admin");
      })
      .catch((apiError: unknown) => {
        const message = apiError instanceof Error ? apiError.message : "Unable to login";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]/50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="font-heading text-2xl">Admin Login</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">Sign in to Royal Mechanic admin control center.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                Login to Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
