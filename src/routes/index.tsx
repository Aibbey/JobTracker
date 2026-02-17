import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	Plus,
	Pencil,
	Trash2,
	Briefcase,
	Clock,
	XCircle,
	Building2,
	Calendar,
	MessageSquare,
	Gift,
	CheckCircle2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { JobDialog } from "@/components/job-dialog";
import {
	useAppStore,
	EMPLOYMENT_TYPES,
	type JobApplication,
	type EmploymentType,
	type ApplicationStatus,
} from "@/lib/store";

export const Route = createFileRoute("/")({
	component: Dashboard,
});

const statusConfig: Record<
	ApplicationStatus,
	{ label: string; variant: "secondary" | "destructive"; className: string }
> = {
	pending: { label: "Pending", variant: "secondary", className: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200" },
	interview: { label: "Interview", variant: "secondary", className: "bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200" },
	"offer-received": { label: "Offer Received", variant: "secondary", className: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200" },
	accepted: { label: "Accepted", variant: "secondary", className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200" },
	rejected: { label: "Rejected", variant: "destructive", className: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" },
};

const employmentTypeLabels: Record<EmploymentType, string> = {
	"full-time": "Full-time",
	"part-time": "Part-time",
	internship: "Internship",
	freelance: "Freelance",
};

const employmentTypeColors: Record<EmploymentType, { bg: string; border: string; text: string; icon: string }> = {
	"full-time": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-500" },
	"part-time": { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", icon: "text-violet-500" },
	internship: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500" },
	freelance: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "text-orange-500" },
};

function Dashboard() {
	const jobs = useAppStore((s) => s.jobs);
	const deleteJob = useAppStore((s) => s.deleteJob);
	const settings = useAppStore((s) => s.settings);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

	const handleEdit = (job: JobApplication) => {
		setEditingJob(job);
		setDialogOpen(true);
	};

	const handleAdd = () => {
		setEditingJob(null);
		setDialogOpen(true);
	};

	const pendingJobs = jobs.filter((j) => j.status === "pending");
	const interviewJobs = jobs.filter((j) => j.status === "interview");
	const offerReceivedJobs = jobs.filter((j) => j.status === "offer-received");
	const acceptedJobs = jobs.filter((j) => j.status === "accepted");
	const rejectedJobs = jobs.filter((j) => j.status === "rejected");

	const getJobsByType = (type: EmploymentType) =>
		jobs.filter((j) => j.employmentType === type);

	return (
		<div className="flex-1 p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Dashboard</h1>
					<p className="text-muted-foreground">
						{jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
					</p>
				</div>
				<Button onClick={handleAdd} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md">
					<Plus className="size-4" />
					Add
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				{EMPLOYMENT_TYPES.map((et) => {
					const count = getJobsByType(et.value).length;
					const colors = employmentTypeColors[et.value];
					return (
						<Card key={et.value} className={`${colors.bg} ${colors.border} border`}>
							<CardHeader className="pb-2">
								<CardDescription className={colors.icon}>{et.label}</CardDescription>
								<CardTitle className={`text-2xl ${colors.text}`}>{count}</CardTitle>
							</CardHeader>
						</Card>
					);
				})}
			</div>

			<Tabs defaultValue="all">
				<TabsList className="flex-wrap h-auto gap-1">
					<TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
						All ({jobs.length})
					</TabsTrigger>
					<TabsTrigger value="pending" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
						Pending ({pendingJobs.length})
					</TabsTrigger>
					<TabsTrigger value="interview" className="data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700">
						Interview ({interviewJobs.length})
					</TabsTrigger>
					<TabsTrigger value="offer-received" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
						Offer Received ({offerReceivedJobs.length})
					</TabsTrigger>
					<TabsTrigger value="accepted" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
						Accepted ({acceptedJobs.length})
					</TabsTrigger>
					<TabsTrigger value="rejected" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
						Rejected ({rejectedJobs.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<JobList
						jobs={jobs}
						onEdit={handleEdit}
						onDelete={deleteJob}
						compact={settings.showCompactView}
					/>
				</TabsContent>
				<TabsContent value="pending">
					<JobList
						jobs={pendingJobs}
						onEdit={handleEdit}
						onDelete={deleteJob}
						compact={settings.showCompactView}
					/>
				</TabsContent>
				<TabsContent value="interview">
					<JobList
						jobs={interviewJobs}
						onEdit={handleEdit}
						onDelete={deleteJob}
						compact={settings.showCompactView}
					/>
				</TabsContent>
				<TabsContent value="offer-received">
					<JobList
						jobs={offerReceivedJobs}
						onEdit={handleEdit}
						onDelete={deleteJob}
						compact={settings.showCompactView}
					/>
				</TabsContent>
				<TabsContent value="accepted">
					<JobList
						jobs={acceptedJobs}
						onEdit={handleEdit}
						onDelete={deleteJob}
						compact={settings.showCompactView}
					/>
				</TabsContent>
				<TabsContent value="rejected">
					<JobList
						jobs={rejectedJobs}
						onEdit={handleEdit}
						onDelete={deleteJob}
						compact={settings.showCompactView}
					/>
				</TabsContent>
			</Tabs>

			<JobDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				editingJob={editingJob}
			/>
		</div>
	);
}

function JobList({
	jobs,
	onEdit,
	onDelete,
	compact,
}: {
	jobs: JobApplication[];
	onEdit: (job: JobApplication) => void;
	onDelete: (id: string) => void;
	compact: boolean;
}) {
	if (jobs.length === 0) {
		return (
			<Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<div className="rounded-full bg-blue-100 p-4 mb-4">
						<Briefcase className="size-8 text-blue-500" />
					</div>
					<p className="text-muted-foreground text-center">
						No applications found. Click &quot;Add&quot; to get started.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<ScrollArea className="h-[calc(100vh-380px)]">
			<div className={compact ? "space-y-2" : "space-y-3"}>
				{jobs.map((job) => {
					const etColors = employmentTypeColors[job.employmentType];
					const borderColor = job.employmentType === "full-time" ? "border-l-blue-500"
						: job.employmentType === "part-time" ? "border-l-violet-500"
						: job.employmentType === "internship" ? "border-l-emerald-500"
						: "border-l-orange-500";
					return (
					<Card key={job.id} className={`border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
						<CardContent className={compact ? "py-3 px-4" : "py-4 px-6"}>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0 space-y-1">
									<div className="flex items-center gap-2 flex-wrap">
										<h3 className="font-semibold truncate">
											{job.positionTitle}
										</h3>
										<Badge variant="outline" className={statusConfig[job.status].className}>
											{job.status === "pending" && <Clock className="size-3 mr-1" />}
											{job.status === "interview" && <MessageSquare className="size-3 mr-1" />}
											{job.status === "offer-received" && <Gift className="size-3 mr-1" />}
											{job.status === "accepted" && <CheckCircle2 className="size-3 mr-1" />}
											{job.status === "rejected" && <XCircle className="size-3 mr-1" />}
											{statusConfig[job.status].label}
										</Badge>
										<Badge variant="outline" className={`${etColors.bg} ${etColors.text} ${etColors.border}`}>
											{employmentTypeLabels[job.employmentType]}
										</Badge>
									</div>
									<div className="flex items-center gap-3 text-sm text-muted-foreground">
										<span className="flex items-center gap-1">
											<Building2 className="size-3.5 text-blue-400" />
											{job.companyName}
										</span>
										{job.applicationDate && (
											<span className="flex items-center gap-1">
												<Calendar className="size-3.5 text-emerald-400" />
												{new Date(job.applicationDate).toLocaleDateString()}
											</span>
										)}
									</div>
									{!compact && job.jobDescription && (
										<p className="text-sm text-muted-foreground line-clamp-2 pt-1">
											{job.jobDescription}
										</p>
									)}
									{!compact && job.notes && (
										<>
											<Separator className="my-2" />
											<p className="text-xs text-muted-foreground italic">
												{job.notes}
											</p>
										</>
									)}
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<Button
										variant="ghost"
										size="icon"
										className="hover:bg-blue-50 hover:text-blue-600"
										onClick={() => onEdit(job)}
									>
										<Pencil className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="hover:bg-red-50"
										onClick={() => onDelete(job.id)}
									>
										<Trash2 className="size-4 text-red-500" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
					);
				})}
			</div>
		</ScrollArea>
	);
}
