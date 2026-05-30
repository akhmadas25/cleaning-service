"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, LogIn, Sparkles } from "lucide-react";

import { toast } from "sonner";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();


  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginUser(values);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="border-0 shadow-[0_20px_50px_rgba(0,47,135,0.4)] rounded-3xl overflow-hidden backdrop-blur-xl bg-white/95">
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <div className="w-10 h-10 rounded-md bg-[#ffd700] flex items-center justify-center shadow-lg shadow-[#ffd700]/40">
            <Sparkles className="w-5 h-5 text-[#0088FF]" />
          </div>
          <span className="font-extrabold text-2xl tracking-widest uppercase text-slate-900">
            LOGO
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">
          Selamat datang kembali
        </h1>
        <p className="text-sm text-slate-500">
          Masuk untuk mengelola pesanan kebersihan Anda
        </p>
      </CardHeader>

      <CardContent className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">
                    Alamat email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isPending}
                      className="h-14 text-base border-slate-200 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-slate-700 font-medium">
                      Kata sandi
                    </FormLabel>
                    </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan kata sandi Anda"
                        autoComplete="current-password"
                        disabled={isPending}
                        className="h-14 text-base border-slate-200 focus-visible:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              id="login-submit"
              disabled={isPending}
              className="w-full h-14 rounded-full bg-[#002f87] hover:bg-[#001f5b] text-white font-bold text-lg shadow-lg shadow-[#002f87]/30 transition-all mt-4"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Masuk…
                </>
              ) : (
                <>
                  <LogIn className="mr-2 w-4 h-4" />
                  Masuk
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="px-8 pb-8 pt-2">
        <p className="text-sm text-slate-500 text-center w-full">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Buat akun gratis
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
