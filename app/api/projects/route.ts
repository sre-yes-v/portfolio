import { connectDB } from "@/lib/db";
import Project from "@/lib/models/project";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectPayload = {
	name?: string;
	year?: string;
	category?: string;
	summary?: string;
	stack?: string[];
	image?: string;
	homeImage?: string;
	demoUrl?: string;
	showHomeScreen?: boolean;
};

type RequiredProjectPayload = {
	name: string;
	year: string;
	category: string;
	summary: string;
	stack: string[];
	image: string;
	homeImage?: string;
	demoUrl: string;
	showHomeScreen: boolean;
};

const defaultProjects = [
	{
		name: "Flarize",
		year: "2025",
		category: "Solar Platform",
		summary:
			"Solar Company Marketing Website: A design focused on trust, conversion, and strong product storytelling to drive customer engagement and sales.",
		stack: ["Next.js", "TypeScript", "Tailwind CSS"],
		image: "/flarize-mockup.png",
		homeImage: "/flarize-mockup.png",
		demoUrl: "https://flarize.com/",
		showHomeScreen: true,
	},
	{
		name: "AMAI WebApp",
		year: "2025",
		category: "SaaS Dashboard",
		summary:
			"AMAI - Ayurveda Medical Association of India: A dashboard for managing members, events, and resources with a clean design and intuitive navigation.",
		stack: ["Next.js", "TypeScript", "Tailwind CSS"],
		image: "/amai-mockup.jpg",
		homeImage: "/amai-mockup.jpg",
		demoUrl: "https://amaiapp.ayurveda-amai.org/login?next=%2Fplatform",
		showHomeScreen: true,
	},
	{
		name: "Route Academy",
		year: "2026",
		category: "EdTech Experience",
		summary: "Learning platform with clear paths, easy enrollment, and progress-oriented design.",
		stack: ["Next.js", "TypeScript", "Tailwind CSS"],
		image: "/route-mockup.jpeg",
		homeImage: "/route-mockup.jpeg",
		demoUrl: "https://web.routesacademy.com/",
		showHomeScreen: true,
	},
];

const isValidProject = (project: ProjectPayload): project is RequiredProjectPayload => {
	const hasValidBaseFields = Boolean(
		typeof project.name === "string" &&
			typeof project.year === "string" &&
			typeof project.category === "string" &&
			typeof project.summary === "string" &&
			Array.isArray(project.stack) &&
			project.stack.every((item) => typeof item === "string") &&
			typeof project.image === "string" &&
			typeof project.demoUrl === "string" &&
			typeof project.showHomeScreen === "boolean"
	);

	if (!hasValidBaseFields) {
		return false;
	}

	if (project.homeImage !== undefined && typeof project.homeImage !== "string") {
		return false;
	}

	if (project.showHomeScreen && (!project.homeImage || !project.homeImage.trim())) {
		return false;
	}

	return Boolean(
		typeof project.name === "string" &&
			typeof project.year === "string" &&
			typeof project.category === "string" &&
			typeof project.summary === "string" &&
			Array.isArray(project.stack) &&
			typeof project.image === "string" &&
			typeof project.demoUrl === "string" &&
			typeof project.showHomeScreen === "boolean"
	);
};

const toPublicProject = (project: {
	_id?: unknown;
	name: string;
	year: string;
	category: string;
	summary: string;
	stack: string[];
	image: string;
	homeImage: string;
	demoUrl: string;
	showHomeScreen: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}) => ({
	_id: String(project._id),
	name: project.name,
	year: project.year,
	category: project.category,
	summary: project.summary,
	stack: project.stack,
	image: project.image,
	homeImage: project.homeImage,
	demoUrl: project.demoUrl,
	showHomeScreen: project.showHomeScreen,
	createdAt: project.createdAt,
	updatedAt: project.updatedAt,
});

export async function GET(req: Request) {
	await connectDB();

	const url = new URL(req.url);
	const homeOnly = url.searchParams.get("homeOnly") === "true";

	const count = await Project.countDocuments();

	if (count === 0) {
		await Project.insertMany(defaultProjects);
	}

	const projects = await Project.find(homeOnly ? { showHomeScreen: true } : {})
		.sort({ createdAt: -1 })
		.lean();

	return Response.json(
		{
			success: true,
			projects: projects.map((project) =>
				toPublicProject(project as unknown as Parameters<typeof toPublicProject>[0])
			),
		},
		{ headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
	);
}

export async function POST(req: Request) {
	const body = (await req.json()) as ProjectPayload;

	if (!isValidProject(body)) {
		return Response.json(
			{
				success: false,
				message:
					"Project must include name, year, category, summary, stack, image, demoUrl and showHomeScreen. homeImage is required only when showHomeScreen is true.",
			},
			{ status: 400 }
		);
	}

	await connectDB();

	const payload: RequiredProjectPayload = body;

	const project = await Project.create({
		name: payload.name.trim(),
		year: payload.year.trim(),
		category: payload.category.trim(),
		summary: payload.summary.trim(),
		stack: payload.stack.map((item) => item.trim()).filter(Boolean),
		image: payload.image.trim(),
		homeImage: payload.homeImage?.trim() ?? "",
		demoUrl: payload.demoUrl.trim(),
		showHomeScreen: payload.showHomeScreen,
	});

	return Response.json({
		success: true,
		project: toPublicProject(project.toObject()),
	});
}
