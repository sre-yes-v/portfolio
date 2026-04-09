"use client";


import AdminSidebar from "@/components/admin/ui/Sidebar";
import { ArrowRight, CheckCircle2, FolderKanban, Mail, PencilLine, Sparkles } from "lucide-react";

export default function AdminPage() {



  return (
    <AdminSidebar>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Overview
              </span>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Welcome back, Sreyes.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Manage your portfolio content, update the about section, review messages, and keep your site current.
                </p>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-purple-500">
              Open portfolio
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Dashboard",
              description: "View quick stats and recent activity.",
              icon: CheckCircle2,
            },
            {
              title: "Manage Project",
              description: "Update featured projects and portfolio work.",
              icon: FolderKanban,
            },
            {
              title: "Manage About",
              description: "Edit your bio, skills, and experience summary.",
              icon: PencilLine,
            },
            {
              title: "Messages",
              description: "Review contact form submissions.",
              icon: Mail,
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-2xl border border-white/10 bg-[#1a2747]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
              </article>
            );
          })}
        </section>
      </div>
    </AdminSidebar>
  );
}