import { connectDB } from "@/lib/db";
import About from "@/lib/models/about";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ABOUT_KEY = "about";

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

type AboutExperienceInput = {
	role: string;
	company: string;
	period: string;
	description: string | string[];
};

type AboutEducation = {
	title: string;
	period: string;
};

type AboutPayload = {
	metrics?: AboutMetric[];
	experiences?: AboutExperienceInput[];
	education?: AboutEducation;
};

type PublicAbout = {
	metrics: AboutMetric[];
	experiences: AboutExperience[];
	education: AboutEducation;
};

const isValidEducation = (education: unknown): education is AboutEducation => {
	return Boolean(
		education &&
			typeof education === "object" &&
			typeof (education as AboutEducation).title === "string" &&
			typeof (education as AboutEducation).period === "string"
	);
};

const toPublicEducation = (education?: Partial<AboutEducation> | null): AboutEducation => ({
	title: typeof education?.title === "string" ? education.title : defaultAbout.education.title,
	period: typeof education?.period === "string" ? education.period : defaultAbout.education.period,
});

const toPublicAbout = (about: AboutPayload | null | undefined): PublicAbout => ({
	metrics: about?.metrics?.length ? about.metrics : defaultAbout.metrics,
	experiences: normalizeExperiences(about?.experiences),
	education: toPublicEducation(about?.education),
});

const defaultAbout = {
	key: ABOUT_KEY,
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
			description: ["6-month intensive internship focusing on component architecture and responsive design."],
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

const isValidMetric = (metric: unknown): metric is AboutMetric => {
	return Boolean(
		metric &&
			typeof metric === "object" &&
			typeof (metric as AboutMetric).label === "string" &&
			typeof (metric as AboutMetric).value === "string"
	);
};

const toDescriptionItems = (description: string | string[]) => {
	if (Array.isArray(description)) {
		return description.map((item) => item.trim()).filter(Boolean);
	}

	return description
		.split(/\r?\n|\s*\|\s*/)
		.map((item) => item.trim())
		.filter(Boolean);
};

const normalizeExperience = (experience: AboutExperienceInput): AboutExperience => ({
	role: experience.role,
	company: experience.company,
	period: experience.period,
	description: toDescriptionItems(experience.description),
});

const normalizeExperiences = (experiences?: AboutExperienceInput[] | null): AboutExperience[] => {
	if (!experiences?.length) {
		return defaultAbout.experiences;
	}

	return experiences.map(normalizeExperience);
};

const isValidExperience = (experience: unknown): experience is AboutExperienceInput => {
	const description = (experience as AboutExperienceInput | undefined)?.description;
	const hasValidDescription =
		typeof description === "string" ||
		(Array.isArray(description) && description.every((item: string) => typeof item === "string"));

	return Boolean(
		experience &&
			typeof experience === "object" &&
			typeof (experience as AboutExperienceInput).role === "string" &&
			typeof (experience as AboutExperienceInput).company === "string" &&
			typeof (experience as AboutExperienceInput).period === "string" &&
			hasValidDescription
	);
};

export async function GET() {
	await connectDB();

	let about = await About.findOne({ key: ABOUT_KEY });

	if (!about) {
		about = await About.create(defaultAbout);
	}

	return Response.json(
		{ success: true, about: toPublicAbout(about.toObject()) },
		{ headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
	);
}

export async function PUT(req: Request) {
	const body = (await req.json()) as AboutPayload;


	if (body.metrics && !Array.isArray(body.metrics)) {
		return Response.json({ success: false, message: "metrics must be an array" }, { status: 400 });
	}

	if (body.experiences && !Array.isArray(body.experiences)) {
		return Response.json({ success: false, message: "experiences must be an array" }, { status: 400 });
	}

	if (body.metrics && !body.metrics.every(isValidMetric)) {
		return Response.json({ success: false, message: "Each metric must have label and value" }, { status: 400 });
	}

	if (body.experiences && !body.experiences.every(isValidExperience)) {
		return Response.json(
			{ success: false, message: "Each experience must include role, company, period, and description" },
			{ status: 400 }
		);
	}

	if (body.education && !isValidEducation(body.education)) {
		return Response.json({ success: false, message: "education must include title and period" }, { status: 400 });
	}

	await connectDB();

	const currentAbout = await About.findOne({ key: ABOUT_KEY });
	const currentEducation = currentAbout?.toObject()?.education as Partial<AboutEducation> | undefined;
	const currentExperiences = currentAbout?.toObject()?.experiences as AboutExperienceInput[] | undefined;
	const education = body.education
		? {
			title: body.education.title,
			period: body.education.period,
		}
		: toPublicEducation(currentEducation);
	const experiences = body.experiences ? normalizeExperiences(body.experiences) : normalizeExperiences(currentExperiences);

	await About.findOneAndUpdate(
		{ key: ABOUT_KEY },
		{
			$set: {
				...body,
				experiences,
				education,
				key: ABOUT_KEY,
			},
		},
		{ new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
	);

	const updatedAbout = await About.findOne({ key: ABOUT_KEY });

	return Response.json(
		{ success: true, about: toPublicAbout(updatedAbout?.toObject()) },
		{ headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
	);
}
