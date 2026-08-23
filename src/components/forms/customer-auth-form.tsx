"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, LogIn, Mail, User, UserPlus } from "lucide-react";
import { login, register, setUserToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CustomerAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginMobile, setLoginMobile] = useState("");
  const [name, setName] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function normalizeMobileInput(value: string) {
    return value.replace(/\D/g, "").slice(0, 10);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!password || (mode === "login" && !loginMobile) || (mode === "register" && (!name || !registerMobile))) {
      setError("Please fill all required fields.");
      return;
    }

    if (mode === "login" && String(loginMobile).replace(/\D/g, "").length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (mode === "register" && String(registerMobile).replace(/\D/g, "").length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    const request = mode === "register"
      ? register(name, registerMobile, password, registerEmail)
      : login({ mobile: loginMobile, password });

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
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(197,72,58,0.24),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(90,120,240,0.26),transparent_34%)]" />
      <div className="mx-auto w-full max-w-5xl">
        <Card className="relative overflow-hidden border-black bg-[linear-gradient(145deg,rgba(30,24,18,0.92),rgba(25,20,16,0.96))] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.01))]" />
          <div className="relative grid min-h-140 md:grid-cols-[1fr_460px]">
            <div className="relative hidden overflow-hidden md:block">
              <Image
                src="/images/hero-bike.jpg"
                alt="Royal Mechanic login visual"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0c0f16]/88 via-[#0c0f16]/45 to-[#0c0f16]/15" />
              <div className="absolute inset-x-8 bottom-8">
                <p className="font-heading text-3xl font-bold text-white">Premium Bike Care</p>
                <p className="mt-2 text-sm text-[#f2e3cb]">Doorstep servicing with trusted mechanics and transparent billing.</p>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <CardHeader className="relative p-0">
                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border border-white/35 bg-white/12">
                  <User className="h-10 w-10 text-[#d8ab58]" />
                </div>
                <CardTitle className="text-center font-heading text-2xl">Customer {mode === "login" ? "Login" : "Register"}</CardTitle>
                <p className="mt-1 text-center text-sm text-[#efe6dc]">Book bike service with your account.</p>
              </CardHeader>

              <CardContent className="relative mt-5 p-0">
                <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-white/20 bg-black/20 p-1">
                  <Button type="button" variant={mode === "login" ? "default" : "ghost"} className="rounded-full" onClick={() => setMode("login")}>Login</Button>
                  <Button type="button" variant={mode === "register" ? "default" : "ghost"} className="rounded-full" onClick={() => setMode("register")}>Register</Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-3">
                  {mode === "register" ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                        <Input
                          placeholder="Full name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          disabled={loading}
                          className="rounded-xl border-2 border-black bg-[#17130f] pl-10 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                        <Input
                          type="text"
                          placeholder="Mobile Number (Required)"
                          value={registerMobile}
                          onChange={(event) => setRegisterMobile(normalizeMobileInput(event.target.value))}
                          disabled={loading}
                          inputMode="numeric"
                          maxLength={10}
                          className="rounded-xl border-2 border-black bg-[#17130f] pl-10 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                        <Input
                          type="email"
                          placeholder="Email (Optional)"
                          value={registerEmail}
                          onChange={(event) => setRegisterEmail(event.target.value)}
                          disabled={loading}
                          className="rounded-xl border-2 border-black bg-[#17130f] pl-10 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                        />
                      </div>
                    </div>
                  ) : null}

                  {mode === "login" ? (
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                      <Input
                        type="text"
                        placeholder="Mobile Number"
                        value={loginMobile}
                        onChange={(event) => setLoginMobile(normalizeMobileInput(event.target.value))}
                        disabled={loading}
                        inputMode="numeric"
                        maxLength={10}
                        className="rounded-xl border-2 border-black bg-[#17130f] pl-10 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                      />
                    </div>
                  ) : null}

                  <div className="relative">
                    <LogIn className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#d8ab58]" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      className="rounded-xl border-2 border-black bg-[#17130f] pl-10 text-[#f6e7cf] placeholder:text-[#8f7d5f]"
                    />
                  </div>

                  {error ? <p className="text-sm text-[#ffd0d0]">{error}</p> : null}
                  {success ? <p className="text-sm text-[#d9ffd9]">{success}</p> : null}

                  <Button type="submit" className="mt-3 w-full rounded-full border border-black bg-[linear-gradient(90deg,#8d6425,#c69948)] font-semibold text-black hover:brightness-110" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mode === "login" ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {mode === "login" ? "Login" : "Create Account"}
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
