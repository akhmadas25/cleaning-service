"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/lib/actions/auth";
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
import { Eye, EyeOff, Loader2, UserPlus, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

const passwordRequirements = [
  { label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
  { label: "Satu huruf besar", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Satu angka", test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = form.watch("password");

  function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      const result = await registerUser(values);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.success);
        router.push("/login");
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
          Buat akun Anda
        </h1>
        <p className="text-sm text-slate-500">
          Bergabung dengan ribuan pelanggan yang puas hari ini
        </p>
      </CardHeader>

      <CardContent className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Nama lengkap</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="John Smith"
                      autoComplete="name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Alamat email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="register-email"
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
                  <FormLabel className="text-slate-700 font-medium">Kata sandi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Buat kata sandi yang kuat"
                        autoComplete="new-password"
                        disabled={isPending}
                        className="h-14 text-base border-slate-200 focus-visible:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  {/* Password requirements */}
                  {passwordValue && (
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-1.5">
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                              req.test(passwordValue) ? "bg-green-500" : "bg-slate-200"
                            }`}
                          >
                            {req.test(passwordValue) && (
                              <Check className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-xs transition-colors ${
                              req.test(passwordValue) ? "text-green-600" : "text-slate-400"
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Konfirmasi kata sandi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Ulangi kata sandi Anda"
                        autoComplete="new-password"
                        disabled={isPending}
                        className="h-14 text-base border-slate-200 focus-visible:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              id="register-submit"
              disabled={isPending}
              className="w-full h-14 rounded-full bg-[#002f87] hover:bg-[#001f5b] text-white font-bold text-lg shadow-lg shadow-[#002f87]/30 transition-all mt-4"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Membuat akun…
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 w-4 h-4" />
                  Buat akun
                </>
              )}
            </Button>

            <p className="text-xs text-center text-slate-400">
              Dengan membuat akun, Anda menyetujui{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Syarat Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Kebijakan Privasi
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="px-8 pb-8 pt-2">
        <p className="text-sm text-slate-500 text-center w-full">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
