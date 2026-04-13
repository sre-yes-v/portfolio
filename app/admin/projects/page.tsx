"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/ui/Sidebar";
import { FolderKanban, Pencil, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";

type ProjectItem = {
  _id: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  image: string;
  homeImage: string;
  demoUrl: string;
  showHomeScreen: boolean;
};

type ProjectForm = {
  name: string;
  year: string;
  category: string;
  summary: string;
  stackInput: string;
  image: string;
  homeImage: string;
  demoUrl: string;
  showHomeScreen: boolean;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  projects?: ProjectItem[];
  project?: ProjectItem;
};

type UploadApiResponse = {
  success?: boolean;
  imageUrl?: string;
  message?: string;
};

const createEmptyForm = (): ProjectForm => ({
  name: "",
  year: "",
  category: "",
  summary: "",
  stackInput: "Next.js, TypeScript, Tailwind CSS",
  image: "",
  homeImage: "",
  demoUrl: "",
  showHomeScreen: false,
});

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [form, setForm] = useState<ProjectForm>(createEmptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<"image" | "homeImage" | null>(null);
  const [imageFileName, setImageFileName] = useState("");
  const [homeImageFileName, setHomeImageFileName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getFileNameFromUrl = (url: string) => {
    const value = url.trim();

    if (!value) {
      return "";
    }

    const segments = value.split("/");
    return segments[segments.length - 1] || value;
  };

  const selectedCount = useMemo(
    () => projects.filter((project) => project.showHomeScreen).length,
    [projects]
  );

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/projects", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = (await response.json()) as ApiResponse;
      setProjects(data.projects ?? []);
    } catch (loadError) {
      console.error(loadError);
      setError("Could not load projects right now.");
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

    void loadProjects();
  }, [router]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setImageFileName("");
    setHomeImageFileName("");
  };

  const updateField = <K extends keyof ProjectForm>(field: K, value: ProjectForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const parseStack = (stackInput: string) =>
    stackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
    field: "image" | "homeImage"
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingField(field);
      setError("");
      setMessage("");

      if (field === "image") {
        setImageFileName(file.name);
      } else {
        setHomeImageFileName(file.name);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/project-image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadApiResponse;

      if (!response.ok || !data.success || !data.imageUrl) {
        throw new Error(data.message || "Upload failed");
      }

      setForm((current) => {
        const nextImageUrl = data.imageUrl as string;
        const shouldSyncHomeImage = field === "image" && !current.homeImage.trim();

        return {
          ...current,
          [field]: nextImageUrl,
          homeImage: shouldSyncHomeImage ? nextImageUrl : current.homeImage,
        };
      });

      if (field === "image") {
        setHomeImageFileName(file.name);
      }

      setMessage(
        field === "image"
          ? "Main image uploaded. Home image will only auto-fill if it is empty."
          : "Home selected image uploaded."
      );
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload image right now.");
    } finally {
      setUploadingField(null);
      event.target.value = "";
    }
  };

  const handleSubmit = async (formSnapshot: ProjectForm) => {
    const normalizedForm: ProjectForm = {
      ...formSnapshot,
      image: formSnapshot.image.trim(),
      homeImage: formSnapshot.homeImage.trim(),
      name: formSnapshot.name.trim(),
      year: formSnapshot.year.trim(),
      category: formSnapshot.category.trim(),
      summary: formSnapshot.summary.trim(),
      demoUrl: formSnapshot.demoUrl.trim(),
    };

    const stack = parseStack(normalizedForm.stackInput);

    if (
      !normalizedForm.name ||
      !normalizedForm.year ||
      !normalizedForm.category ||
      !normalizedForm.summary ||
      !normalizedForm.image ||
      stack.length === 0
    ) {
      setError("Name, year, category, summary, image, and stack are required. Demo URL is optional.");
      return;
    }

    if (normalizedForm.showHomeScreen && !normalizedForm.homeImage) {
      setError("Home selected image is required when Show in home selected-work is enabled.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: normalizedForm.name,
        year: normalizedForm.year,
        category: normalizedForm.category,
        summary: normalizedForm.summary,
        stack,
        image: normalizedForm.image,
        homeImage: normalizedForm.homeImage,
        demoUrl: normalizedForm.demoUrl,
        showHomeScreen: normalizedForm.showHomeScreen,
      };

      const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save project");
      }

      setMessage(editingId ? "Project updated." : "Project created.");
      resetForm();
      await loadProjects();
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save project right now.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project: ProjectItem) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      year: project.year,
      category: project.category,
      summary: project.summary,
      stackInput: project.stack.join(", "),
      image: project.image,
      homeImage: project.homeImage,
      demoUrl: project.demoUrl,
      showHomeScreen: project.showHomeScreen,
    });
    setError("");
    setMessage("");
    setImageFileName(getFileNameFromUrl(project.image));
    setHomeImageFileName(getFileNameFromUrl(project.homeImage));
  };

  const deleteProject = async (id: string) => {
    const confirmed = window.confirm("Delete this project permanently?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadProjects();
      setMessage("Project deleted.");
    } catch (deleteError) {
      console.error(deleteError);
      setError("Could not delete this project.");
    }
  };

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Manage Projects</h1>
              <p className="text-sm text-slate-400">
                Add, edit, and delete projects. Only selected ones appear in the home selected-work section.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Total projects: {projects.length}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Home selected: {selectedCount}
            </span>
            <button
              type="button"
              onClick={() => void loadProjects()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-white/80 transition hover:bg-white/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#1a2747]/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              {message}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Project Name</span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Year</span>
              <input
                value={form.year}
                onChange={(event) => updateField("year", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Category</span>
              <input
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Stack (comma separated)</span>
              <input
                value={form.stackInput}
                onChange={(event) => updateField("stackInput", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Summary</span>
              <textarea
                value={form.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Main Project Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) => void uploadImage(event, "image")}
                className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white hover:file:bg-white/20"
              />
              <p className="text-[11px] text-slate-500">
                {imageFileName ? `Selected: ${imageFileName}` : "No file selected"}
              </p>
              <p className="text-[11px] text-slate-500">Upload JPG, PNG, WEBP, GIF up to 5MB.</p>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Home Selected Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) => void uploadImage(event, "homeImage")}
                className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white hover:file:bg-white/20"
              />
              <p className="text-[11px] text-slate-500">
                {homeImageFileName ? `Selected: ${homeImageFileName}` : "No file selected"}
              </p>
              <p className="text-[11px] text-slate-500">Use a dedicated crop for home selected-work card.</p>
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Demo URL</span>
              <input
                value={form.demoUrl}
                onChange={(event) => updateField("demoUrl", event.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-blue-400/40"
              />
              <p className="text-[11px] text-slate-500">Leave blank to mark the project as work in progress.</p>
            </label>

            <label className="md:col-span-2 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.showHomeScreen}
                onChange={(event) => updateField("showHomeScreen", event.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-transparent"
              />
              Show in home selected-work section
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleSubmit({ ...form })}
              disabled={saving || uploadingField !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving
                ? "Saving..."
                : uploadingField === "image"
                ? "Uploading main image..."
                : uploadingField === "homeImage"
                ? "Uploading home image..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
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
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
              No projects yet. Add your first project above.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project._id}
                  className="rounded-2xl border border-white/10 bg-[#111827]/65 p-5 transition hover:border-white/20 hover:bg-white/8"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-400">
                        {project.category} • {project.year}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${
                          project.showHomeScreen
                            ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                            : "border-white/15 bg-white/5 text-white/70"
                        }`}
                      >
                        {project.showHomeScreen ? "Selected" : "Archive only"}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${
                          project.demoUrl.trim()
                            ? "border-blue-300/30 bg-blue-400/10 text-blue-200"
                            : "border-amber-300/30 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {project.demoUrl.trim() ? "Live Link" : "Work in Progress"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={`${project._id}-${item}`}
                        className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-400/20"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void deleteProject(project._id)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-300/25 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-400/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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