import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Linkedin, Globe, Save } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const profile = useAppStore((s) => s.profile);
	const updateProfile = useAppStore((s) => s.updateProfile);
	const [formData, setFormData] = useState(profile);
	const [saved, setSaved] = useState(false);

	const handleSave = () => {
		updateProfile(formData);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
	};

	return (
		<div className="flex-1 p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
				<p className="text-muted-foreground">
					Manage your personal information
				</p>
			</div>

			<Card className="border-t-4 border-t-violet-500">
				<CardHeader>
					<CardTitle className="text-lg text-violet-700">Personal Information</CardTitle>
					<CardDescription>
						Your profile details used in the application
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="name" className="flex items-center gap-2">
								<User className="size-3.5 text-violet-500" />
								Full Name
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleChange("name", e.target.value)}
								placeholder="John Doe"
								className="focus-visible:ring-violet-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email" className="flex items-center gap-2">
								<Mail className="size-3.5 text-blue-500" />
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => handleChange("email", e.target.value)}
								placeholder="john@example.com"
								className="focus-visible:ring-blue-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone" className="flex items-center gap-2">
								<Phone className="size-3.5 text-emerald-500" />
								Phone
							</Label>
							<Input
								id="phone"
								type="tel"
								value={formData.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								placeholder="+1 (555) 123-4567"
								className="focus-visible:ring-emerald-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="location" className="flex items-center gap-2">
								<MapPin className="size-3.5 text-red-500" />
								Location
							</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) => handleChange("location", e.target.value)}
								placeholder="New York, NY"
								className="focus-visible:ring-red-500"
							/>
						</div>
					</div>

					<Separator />

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="linkedIn" className="flex items-center gap-2">
								<Linkedin className="size-3.5 text-sky-600" />
								LinkedIn
							</Label>
							<Input
								id="linkedIn"
								value={formData.linkedIn}
								onChange={(e) => handleChange("linkedIn", e.target.value)}
								placeholder="https://linkedin.com/in/johndoe"
								className="focus-visible:ring-sky-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="portfolio" className="flex items-center gap-2">
								<Globe className="size-3.5 text-orange-500" />
								Portfolio
							</Label>
							<Input
								id="portfolio"
								value={formData.portfolio}
								onChange={(e) => handleChange("portfolio", e.target.value)}
								placeholder="https://johndoe.dev"
								className="focus-visible:ring-orange-500"
							/>
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<Button onClick={handleSave} className={saved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"}>
							<Save className="size-4" />
							{saved ? "Saved!" : "Save"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
