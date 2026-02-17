import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type JobApplication,
	type EmploymentType,
	type ApplicationStatus,
	EMPLOYMENT_TYPES,
	APPLICATION_STATUSES,
	useAppStore,
} from "@/lib/store";

interface JobDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingJob: JobApplication | null;
}

export function JobDialog({ open, onOpenChange, editingJob }: JobDialogProps) {
	const addJob = useAppStore((s) => s.addJob);
	const updateJob = useAppStore((s) => s.updateJob);
	const settings = useAppStore((s) => s.settings);

	const [companyName, setCompanyName] = useState("");
	const [positionTitle, setPositionTitle] = useState("");
	const [employmentType, setEmploymentType] = useState<EmploymentType>(settings.defaultEmploymentType);
	const [status, setStatus] = useState<ApplicationStatus>(settings.defaultStatus);
	const [applicationDate, setApplicationDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [jobDescription, setJobDescription] = useState("");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (editingJob) {
			setCompanyName(editingJob.companyName);
			setPositionTitle(editingJob.positionTitle);
			setEmploymentType(editingJob.employmentType);
			setStatus(editingJob.status);
			setApplicationDate(editingJob.applicationDate);
			setJobDescription(editingJob.jobDescription);
			setNotes(editingJob.notes);
		} else {
			setCompanyName("");
			setPositionTitle("");
			setEmploymentType(settings.defaultEmploymentType);
			setStatus(settings.defaultStatus);
			setApplicationDate(new Date().toISOString().split("T")[0]);
			setJobDescription("");
			setNotes("");
		}
	}, [editingJob, open, settings.defaultEmploymentType, settings.defaultStatus]);

	const handleSubmit = () => {
		if (!companyName.trim() || !positionTitle.trim()) return;

		if (editingJob) {
			updateJob(editingJob.id, {
				companyName: companyName.trim(),
				positionTitle: positionTitle.trim(),
				employmentType,
				status,
				applicationDate,
				jobDescription: jobDescription.trim(),
				notes: notes.trim(),
			});
		} else {
			addJob({
				companyName: companyName.trim(),
				positionTitle: positionTitle.trim(),
				employmentType,
				status,
				applicationDate,
				jobDescription: jobDescription.trim(),
				notes: notes.trim(),
			});
		}
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
						{editingJob ? "Edit Application" : "Add Application"}
					</DialogTitle>
					<DialogDescription>
						{editingJob
							? "Update the details of your application."
							: "Fill in the details of the position you applied for."}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="companyName">Company *</Label>
							<Input
								id="companyName"
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
								placeholder="Acme Inc."
								className="focus-visible:ring-blue-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="positionTitle">Position *</Label>
							<Input
								id="positionTitle"
								value={positionTitle}
								onChange={(e) => setPositionTitle(e.target.value)}
								placeholder="Web Developer"
								className="focus-visible:ring-violet-500"
							/>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<div className="space-y-2">
							<Label>Employment Type</Label>
							<Select
								value={employmentType}
								onValueChange={(v) => setEmploymentType(v as EmploymentType)}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{EMPLOYMENT_TYPES.map((et) => (
										<SelectItem key={et.value} value={et.value}>
											{et.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Status</Label>
							<Select
								value={status}
								onValueChange={(v) => setStatus(v as ApplicationStatus)}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{APPLICATION_STATUSES.map((s) => (
										<SelectItem key={s.value} value={s.value}>
											{s.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="applicationDate">Application Date</Label>
							<Input
								id="applicationDate"
								type="date"
								value={applicationDate}
								onChange={(e) => setApplicationDate(e.target.value)}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="jobDescription">Job Description</Label>
						<Textarea
							id="jobDescription"
							value={jobDescription}
							onChange={(e) => setJobDescription(e.target.value)}
							placeholder="Brief description of the position..."
							className="min-h-20 focus-visible:ring-blue-500"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Additional notes..."
							className="min-h-20 focus-visible:ring-violet-500"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!companyName.trim() || !positionTitle.trim()}
						className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md disabled:opacity-50"
					>
						{editingJob ? "Save" : "Add"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
