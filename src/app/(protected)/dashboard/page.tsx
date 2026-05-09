import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Halaman ini otomatis redirect ke dashboard yang sesuai dengan role
export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  const role = session.user?.role;

  if (role === "ADMIN") redirect("/admin");
  if (role === "TECHNICIAN") redirect("/technician");

  // Default: customer
  redirect("/dashboard/home");
}
