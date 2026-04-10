"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "@/components/admin/ui/Sidebar";
import { CheckCircle2, Info, Plus, RefreshCw, Save, Trash2 } from "lucide-react";

type AboutMetric = {
  label: string;
  value: string;
};

type AboutExperience = {
  role: string;
  company: string;
  period: string;
  description: string[];
};

type AboutEducation = {
  title: string;
  period: string;
};

type AboutContent = {
  metrics: AboutMetric[];
  experiences: AboutExperience[];
  education: AboutEducation;
};

type ApiAboutResponse = {
  success?: boolean;
  about?: AboutContent;
  message?: string;
};

const defaultAbout: AboutContent = {
    metrics: [
    { label: "Experience", value: "1+ Years" },
    { label: "Live Projects", value: "10+" },
    { label: "Internships", value: "2" },
  ],
  experiences: [
    {
      role: "Frontend Developer Intern → Part-Time",
      company: "Nexotech Solutions",
      period: "Apr 2025 — Present",
      description: [
        "6-month intensive internship focusing on component architecture and responsive design.",
      ],
    },
    {
      role: "Frontend Developer Intern",
      company: "WebDzen Technologies",
      period: "Aug 2025 — Sep 2025",
      description: ["Focused on responsive components and UI performance optimization."],
    },
  ],
  education: {
    title: "BCA • Sacred Heart College",
    period: "2024 - 2028",
  },
};

const normalizeAbout = (about?: AboutContent | null): AboutContent => ({
  metrics:
    about?.metrics?.length === 3
      ? about.metrics
      : defaultAbout.metrics,
  experiences:
    about?.experiences?.length ? about.experiences : defaultAbout.experiences,
  education:
    about?.education?.title && about?.education?.period
      ? about.education
      : defaultAbout.education,
});

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutContent>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canSave = content.metrics.length > 0 && content.experiences.length > 0;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      return;
    }

    const loadAbout = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/about", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load about content");
        }

        const data = (await response.json()) as ApiAboutResponse;
        setContent(normalizeAbout(data.about));
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load about content right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadAbout();
  }, []);

  const updateMetric = (index: number, field: keyof AboutMetric, value: string) => {
    setContent((current) => ({
      ...current,
      metrics: current.metrics.map((metric, metricIndex) =>
        metricIndex === index ? { ...metric, [field]: value } : metric
      ),
    }));
  };

  const updateExperience = <K extends keyof AboutExperience>(
    index: number,
    field: K,
    value: AboutExperience[K]
  ) => {
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((experience, experienceIndex) =>
        experienceIndex === index ? { ...experience, [field]: value } : experience
      ),
    }));
  };

  const addExperience = () => {
    setContent((current) => ({
      ...current,
      experiences: [
        ...current.experiences,
        { role: "", company: "", period: "", description: [] },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setContent((current) => ({
      ...current,
      experiences: current.experiences.filter((_, experienceIndex) => experienceIndex !== index),
    }));
  };

  const updateExperiencePoint = (
    experienceIndex: number,
    pointIndex: number,
    value: string
  ) => {
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((experience, currentExperienceIndex) => {
        if (currentExperienceIndex !== experienceIndex) return experience;

        return {
          ...experience,
          description: experience.description.map((point, currentPointIndex) =>
            currentPointIndex === pointIndex ? value : point
          ),
        };
      }),
    }));
  };

  const addExperiencePoint = (experienceIndex: number) => {
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((experience, currentExperienceIndex) => {
        if (currentExperienceIndex !== experienceIndex) return experience;

        return {
          ...experience,
          description: [...experience.description, ""],
        };
      }),
    }));
  };

  const removeExperiencePoint = (experienceIndex: number, pointIndex: number) => {
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((experience, currentExperienceIndex) => {
        if (currentExperienceIndex !== experienceIndex) return experience;

        return {
          ...experience,
          description: experience.description.filter((_, currentPointIndex) => currentPointIndex !== pointIndex),
        };
      }),
    }));
  };

  const updateEducation = (field: keyof AboutEducation, value: string) => {
    setContent((current) => ({
      ...current,
      education: {
        ...current.education,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const data = (await response.json()) as ApiAboutResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save about content");
      }

      if (data.about) {
        setContent(normalizeAbout(data.about));
      }

      setMessage("About content saved successfully.");
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save about content.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setContent(defaultAbout);
    setMessage("Reset to default values. Save to apply.");
  };

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Manage About</h1>
              <p className="text-sm text-slate-400">Update hero text, metrics, and experience details.</p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#1a2747]/70 p-6 text-sm text-slate-300">
              Loading about content...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {message && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-[#1a2747]/70 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Metrics</h2>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Experience, Projects, Internships</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {content.metrics.map((metric, index) => (
                    <div key={`metric-${index}`} className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <label className="space-y-2 text-sm text-slate-300">
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Label</span>
                        <input
                          value={metric.label}
                          onChange={(event) => updateMetric(index, "label", event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                        />
                      </label>

                      <label className="space-y-2 text-sm text-slate-300">
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Value</span>
                        <input
                          value={metric.value}
                          onChange={(event) => updateMetric(index, "value", event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1a2747]/70 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">Experience</h2>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {content.experiences.map((experience, index) => (
                    <div key={`experience-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">Entry {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-400/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-300">
                          <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Role</span>
                          <input
                            value={experience.role}
                            onChange={(event) => updateExperience(index, "role", event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                          />
                        </label>

                        <label className="space-y-2 text-sm text-slate-300">
                          <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Company</span>
                          <input
                            value={experience.company}
                            onChange={(event) => updateExperience(index, "company", event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                          />
                        </label>

                        <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                          <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Period</span>
                          <input
                            value={experience.period}
                            onChange={(event) => updateExperience(index, "period", event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                          />
                        </label>

                        <div className="space-y-3 md:col-span-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Description Points</span>
                            <button
                              type="button"
                              onClick={() => addExperiencePoint(index)}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:bg-white/10"
                            >
                              <Plus className="h-3 w-3" />
                              Add Point
                            </button>
                          </div>

                          <div className="space-y-2">
                            {experience.description.map((point, pointIndex) => (
                              <div key={`point-${pointIndex}`} className="flex items-start gap-2">
                                <span className="mt-2 text-xs text-slate-500">{pointIndex + 1}.</span>
                                <input
                                  value={point}
                                  onChange={(event) => updateExperiencePoint(index, pointIndex, event.target.value)}
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/40"
                                  placeholder="Enter a bullet point"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeExperiencePoint(index, pointIndex)}
                                  className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-300/20 bg-red-400/10 text-red-200 transition hover:bg-red-400/20"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1a2747]/70 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">Education</h2>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Public page card</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Title</span>
                    <input
                      value={content.education.title}
                      onChange={(event) => updateEducation("title", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Period</span>
                    <input
                      value={content.education.period}
                      onChange={(event) => updateEducation("period", event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">
                  Save updates to sync the about content with your portfolio.
                </p>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving || !canSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save About"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminSidebar>
  );
}