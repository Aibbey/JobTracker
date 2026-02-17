import { createFileRoute } from "@tanstack/react-router";
import {
	Briefcase,
	Clock,
	PieChart,
	TrendingUp,
	XCircle,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	useAppStore,
	EMPLOYMENT_TYPES,
	APPLICATION_STATUSES,
	type EmploymentType,
	type ApplicationStatus,
} from "@/lib/store";

export const Route = createFileRoute("/statistics")({
	component: StatisticsPage,
});

function StatisticsPage() {
	const jobs = useAppStore((s) => s.jobs);

	const totalApplications = jobs.length;

	const byEmploymentType = EMPLOYMENT_TYPES.map((et) => ({
		...et,
		count: jobs.filter((j) => j.employmentType === et.value).length,
	}));

	const byStatus = APPLICATION_STATUSES.map((s) => ({
		...s,
		count: jobs.filter((j) => j.status === s.value).length,
	}));

	const pendingCount = jobs.filter((j) => j.status === "pending").length;
	const interviewCount = jobs.filter((j) => j.status === "interview").length;
	const offerReceivedCount = jobs.filter((j) => j.status === "offer-received").length;
	const acceptedCount = jobs.filter((j) => j.status === "accepted").length;
	const rejectedCount = jobs.filter((j) => j.status === "rejected").length;
	const rateOf = (count: number) => totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0;

	const employmentTypeIcons: Record<EmploymentType, React.ReactNode> = {
		"full-time": <Briefcase className="size-4 text-blue-500" />,
		"part-time": <Clock className="size-4 text-violet-500" />,
		internship: <TrendingUp className="size-4 text-emerald-500" />,
		freelance: <PieChart className="size-4 text-orange-500" />,
	};

	const employmentTypeBarColors: Record<EmploymentType, string> = {
		"full-time": "bg-blue-500",
		"part-time": "bg-violet-500",
		internship: "bg-emerald-500",
		freelance: "bg-orange-500",
	};

	const statusColors: Record<ApplicationStatus, string> = {
		pending: "bg-amber-100 text-amber-800 border-amber-300",
		interview: "bg-sky-100 text-sky-800 border-sky-300",
		"offer-received": "bg-purple-100 text-purple-800 border-purple-300",
		accepted: "bg-green-100 text-green-800 border-green-300",
		rejected: "bg-red-100 text-red-700 border-red-300",
	};

	return (
		<div className="flex-1 p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Statistics</h1>
				<p className="text-muted-foreground">
					Overview of your application metrics
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
				<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
					<CardHeader className="pb-2">
						<CardDescription className="text-blue-600">Total</CardDescription>
						<CardTitle className="text-3xl text-blue-700">{totalApplications}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-blue-500">All types combined</p>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
					<CardHeader className="pb-2">
						<CardDescription className="text-amber-600">Pending</CardDescription>
						<CardTitle className="text-3xl text-amber-700">{pendingCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-amber-500">{rateOf(pendingCount)}% of total</p>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200">
					<CardHeader className="pb-2">
						<CardDescription className="text-sky-600">Interview</CardDescription>
						<CardTitle className="text-3xl text-sky-700">{interviewCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-sky-500">{rateOf(interviewCount)}% of total</p>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
					<CardHeader className="pb-2">
						<CardDescription className="text-purple-600">Offer Received</CardDescription>
						<CardTitle className="text-3xl text-purple-700">{offerReceivedCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-purple-500">{rateOf(offerReceivedCount)}% of total</p>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
					<CardHeader className="pb-2">
						<CardDescription className="text-green-600">Accepted</CardDescription>
						<CardTitle className="text-3xl text-green-700">{acceptedCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-green-500">{rateOf(acceptedCount)}% of total</p>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
					<CardHeader className="pb-2">
						<CardDescription className="text-red-600">Rejected</CardDescription>
						<CardTitle className="text-3xl text-red-700">{rejectedCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-red-500">{rateOf(rejectedCount)}% of total</p>
					</CardContent>
				</Card>
			</div>

			<Separator />

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg text-emerald-700">By Employment Type</CardTitle>
						<CardDescription>
							Breakdown of applications by employment type
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{byEmploymentType.map((et) => (
							<div key={et.value} className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{employmentTypeIcons[et.value]}
									<span className="text-sm font-medium">{et.label}</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-32 h-2.5 bg-secondary rounded-full overflow-hidden">
										<div
											className={`h-full ${employmentTypeBarColors[et.value]} rounded-full transition-all`}
											style={{
												width: `${totalApplications > 0 ? (et.count / totalApplications) * 100 : 0}%`,
											}}
										/>
									</div>
									<span className="text-sm text-muted-foreground w-8 text-right font-medium">
										{et.count}
									</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg text-emerald-700">By Status</CardTitle>
						<CardDescription>
							Breakdown of applications by current status
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{byStatus.map((s) => (
							<div key={s.value} className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{s.value === "pending" && <Clock className="size-4 text-amber-500" />}
									{s.value === "interview" && <MessageSquare className="size-4 text-sky-500" />}
									{s.value === "offer-received" && <Gift className="size-4 text-purple-500" />}
									{s.value === "accepted" && <CheckCircle2 className="size-4 text-green-500" />}
									{s.value === "rejected" && <XCircle className="size-4 text-red-500" />}
									<span className="text-sm font-medium">{s.label}</span>
								</div>
								<div className="flex items-center gap-3">
									<Badge
										variant="outline"
										className={statusColors[s.value]}
									>
										{s.count} application{s.count !== 1 ? "s" : ""}
									</Badge>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{totalApplications === 0 && (
				<Card className="border-dashed border-2 border-emerald-200 bg-emerald-50/50">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<div className="rounded-full bg-emerald-100 p-4 mb-4">
							<PieChart className="size-8 text-emerald-500" />
						</div>
						<p className="text-muted-foreground text-center">
							No applications yet. Add your first application to see statistics here.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
