"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/ui/Sidebar";
import { FolderKanban } from "lucide-react";

export default function AdminProjectsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <AdminSidebar>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Manage Project</h1>
            <p className="text-sm text-slate-400">This section is ready for project management tools.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a2747]/70 p-6 text-sm text-slate-300">
          Add project cards, editing forms, and publishing controls here.
        </div>
      </div>
    </AdminSidebar>
  );
}