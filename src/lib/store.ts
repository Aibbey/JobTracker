import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EmploymentType = "full-time" | "part-time" | "internship" | "freelance";
export type ApplicationStatus = "pending" | "interview" | "offer-received" | "accepted" | "rejected";

export interface JobApplication {
	id: string;
	companyName: string;
	positionTitle: string;
	employmentType: EmploymentType;
	status: ApplicationStatus;
	applicationDate: string;
	jobDescription: string;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserProfile {
	name: string;
	email: string;
	phone: string;
	location: string;
	linkedIn: string;
	portfolio: string;
}

export interface AppSettings {
	defaultEmploymentType: EmploymentType;
	defaultStatus: ApplicationStatus;
	showCompactView: boolean;
}

interface AppState {
	jobs: JobApplication[];
	profile: UserProfile;
	settings: AppSettings;
	addJob: (job: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => void;
	updateJob: (id: string, updates: Partial<Omit<JobApplication, "id" | "createdAt">>) => void;
	deleteJob: (id: string) => void;
	updateProfile: (profile: Partial<UserProfile>) => void;
	updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			jobs: [],
			profile: {
				name: "",
				email: "",
				phone: "",
				location: "",
				linkedIn: "",
				portfolio: "",
			},
			settings: {
				defaultEmploymentType: "full-time",
				defaultStatus: "pending",
				showCompactView: false,
			},
			addJob: (job) =>
				set((state) => ({
					jobs: [
						...state.jobs,
						{
							...job,
							id: crypto.randomUUID(),
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					],
				})),
			updateJob: (id, updates) =>
				set((state) => ({
					jobs: state.jobs.map((job) =>
						job.id === id
							? { ...job, ...updates, updatedAt: new Date().toISOString() }
							: job,
					),
				})),
			deleteJob: (id) =>
				set((state) => ({
					jobs: state.jobs.filter((job) => job.id !== id),
				})),
			updateProfile: (profile) =>
				set((state) => ({
					profile: { ...state.profile, ...profile },
				})),
			updateSettings: (settings) =>
				set((state) => ({
					settings: { ...state.settings, ...settings },
				})),
		}),
		{
			name: "job-tracker-storage",
		},
	),
);

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
	{ value: "full-time", label: "Full-time" },
	{ value: "part-time", label: "Part-time" },
	{ value: "internship", label: "Internship" },
	{ value: "freelance", label: "Freelance" },
];

export const APPLICATION_STATUSES: { value: ApplicationStatus; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "interview", label: "Interview" },
	{ value: "offer-received", label: "Offer Received" },
	{ value: "accepted", label: "Accepted" },
	{ value: "rejected", label: "Rejected" },
];
