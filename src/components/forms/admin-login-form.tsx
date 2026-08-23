"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
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

    login({ email, password })
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
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#0b0c10] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(201,154,61,0.2),transparent_35%),radial-gradient(circle_at_84%_78%,rgba(173,120,31,0.2),transparent_32%)]" />
      <div className="mx-auto w-full max-w-5xl">
        <Card className="relative overflow-hidden border border-black bg-[linear-gradient(145deg,rgba(26,23,18,0.94),rgba(21,18,15,0.98))] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          <div className="relative grid min-h-140 md:grid-cols-[1fr_440px]">
            <div className="relative hidden overflow-hidden md:block">
              <Image
                src="/images/hero-bike.jpg"
                alt="Royal Mechanic admin login"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/88 via-black/50 to-black/20" />
              <div className="absolute inset-x-8 bottom-8">
                <p className="font-heading text-3xl font-bold text-[#f2d090]">Admin Control Center</p>
                <p className="mt-2 text-sm text-[#e7d4ad]">Manage bookings, users, services, and reports with secure access.</p>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <CardHeader className="p-0">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-black bg-[#1d1710] text-[#d8ab58]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="font-heading text-2xl text-[#f3dec0]">Admin Login</CardTitle>
                <p className="text-sm text-[#bea985]">Sign in to Royal Mechanic admin control center.</p>
              </CardHeader>
              <CardContent className="mt-6 p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                    <Input
                      type="email"
                      placeholder="Admin email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={loading}
                      className="rounded-xl border-2 border-black bg-[#17130f] pl-10 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      className="rounded-xl border-2 border-black bg-[#17130f] pl-10 pr-11 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((state) => !state)}
                      className="absolute right-2 top-2.5 grid h-6 w-6 place-items-center text-[#d8ab58]"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {error ? <p className="text-sm text-[#f0a5a5]">{error}</p> : null}
                  {success ? <p className="text-sm text-[#9fe0ad]">{success}</p> : null}

                  <Button
                    type="submit"
                    className="w-full border border-black bg-[linear-gradient(90deg,#8d6425,#c69948)] font-semibold text-black hover:brightness-110"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Login to Admin
                  </Button>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
