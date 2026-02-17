import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Save } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	useAppStore,
	EMPLOYMENT_TYPES,
	APPLICATION_STATUSES,
	type EmploymentType,
	type ApplicationStatus,
} from "@/lib/store";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const settings = useAppStore((s) => s.settings);
	const updateSettings = useAppStore((s) => s.updateSettings);
	const [formData, setFormData] = useState(settings);
	const [saved, setSaved] = useState(false);

	const handleSave = () => {
		updateSettings(formData);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	return (
		<div className="flex-1 p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Settings</h1>
				<p className="text-muted-foreground">
					Configure your preferences
				</p>
			</div>

			<Card className="border-t-4 border-t-amber-500">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-amber-700">
						<Settings className="size-5 text-amber-500" />
						Default Values
					</CardTitle>
					<CardDescription>
						Set default values for new applications
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label>Default Employment Type</Label>
							<Select
								value={formData.defaultEmploymentType}
								onValueChange={(value) => {
									setFormData((prev) => ({
										...prev,
										defaultEmploymentType: value as EmploymentType,
									}));
									setSaved(false);
								}}
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
							<Label>Default Status</Label>
							<Select
								value={formData.defaultStatus}
								onValueChange={(value) => {
									setFormData((prev) => ({
										...prev,
										defaultStatus: value as ApplicationStatus,
									}));
									setSaved(false);
								}}
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
					</div>
				</CardContent>
			</Card>

			<Card className="border-t-4 border-t-orange-500">
				<CardHeader>
					<CardTitle className="text-lg text-orange-700">Display</CardTitle>
					<CardDescription>
						Customize the appearance of the application
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Compact View</Label>
							<p className="text-sm text-muted-foreground">
								Display applications in a more compact format on the dashboard
							</p>
						</div>
						<Switch
							checked={formData.showCompactView}
							onCheckedChange={(checked) => {
								setFormData((prev) => ({
									...prev,
									showCompactView: checked,
								}));
								setSaved(false);
							}}
						/>
					</div>

					<div className="flex justify-end pt-2">
						<Button onClick={handleSave} className={saved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"}>
							<Save className="size-4" />
							{saved ? "Saved!" : "Save"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
