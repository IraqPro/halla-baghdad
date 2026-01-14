import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/admin/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication
  const tokenPayload = await getCurrentUser();

  if (!tokenPayload) {
    redirect("/admin/login");
  }

  // Get fresh user data
  const [admin] = await db
    .select({
      id: admins.id,
      username: admins.username,
      displayName: admins.displayName,
      role: admins.role,
    })
    .from(admins)
    .where(eq(admins.id, tokenPayload.userId))
    .limit(1);

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={admin} />
      
      {/* Main content - adjusted for sidebar */}
      <main className="lg:mr-64 min-h-screen transition-all duration-300">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
