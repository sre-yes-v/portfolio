"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/ui/Sidebar";
import { ArrowUpRight, Mail, RefreshCw, User } from "lucide-react";

type MessageItem = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/contact");

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const data = (await response.json()) as MessageItem[];
      setMessages(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Could not load messages right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    void loadMessages();
  }, [router]);

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white sm:text-3xl">Messages</h1>
                  <p className="text-sm text-slate-400">
                    Review and respond to contact form submissions.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Total messages: {messages.length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Sorted newest first
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadMessages()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#1a2747]/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white/70">
                <User className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">No messages yet</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                When someone submits the contact form, their message will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {messages.map((item) => (
                <article
                  key={item._id}
                  className="group rounded-2xl border border-white/10 bg-[#111827]/65 p-5 transition hover:border-white/20 hover:bg-white/8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <a
                        href={`mailto:${item.email}`}
                        className="mt-1 inline-block text-sm text-slate-400 transition hover:text-white"
                      >
                        {item.email}
                      </a>
                    </div>

                    {item.createdAt && (
                      <time className="whitespace-nowrap text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {item.message}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/45">
                      New inquiry
                    </span>
                    <a
                      href={`mailto:${item.email}?subject=Re: Portfolio inquiry from ${encodeURIComponent(item.name)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      Reply
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminSidebar>
  );
}
