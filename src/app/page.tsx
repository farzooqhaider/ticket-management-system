import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";

export default async function RootPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  redirect(session.role === "ADMIN" ? "/admin/dashboard" : "/tickets");
}