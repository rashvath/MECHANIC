"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { login, register, setUserToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CustomerAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const request = mode === "register"
      ? register(name, email, password)
      : login(email, password);

    request
      .then((data) => {
        if (data.user.role !== "user") {
          setError("Please use a customer account.");
          return;
        }

        setUserToken(data.token);
        setSuccess("Login successful. Redirecting to My Services...");
        router.push("/dashboard/history");
      })
      .catch((apiError: unknown) => {
        const message = apiError instanceof Error ? apiError.message : "Authentication failed";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]/40 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Customer {mode === "login" ? "Login" : "Register"}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">Book bike service with your account.</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Button type="button" variant={mode === "login" ? "default" : "secondary"} onClick={() => setMode("login")}>Login</Button>
              <Button type="button" variant={mode === "register" ? "default" : "secondary"} onClick={() => setMode("register")}>Register</Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {mode === "register" ? (
                <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} disabled={loading} />
              ) : null}
              <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} />
              <Input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />

              {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
              {success ? <p className="text-sm text-[var(--success)]">{success}</p> : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mode === "login" ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {mode === "login" ? "Login" : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
