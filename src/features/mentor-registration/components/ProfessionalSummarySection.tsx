import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import FieldError from "@/components/common/Field-Error";
import { useProfessions } from "../hooks/use-catalog";

interface ProfessionalSummarySectionProps {
	form: any;
	getErrorMessage: (errors: any[]) => string | undefined;
}

export function ProfessionalSummarySection({
	form,
	getErrorMessage,
}: ProfessionalSummarySectionProps) {
	const { data: professions } = useProfessions();
	return (
		<Card className="overflow-hidden border-none shadow-md ring-1 ring-border/50">
			<CardHeader className="bg-muted/30 pb-4">
				<CardTitle className="text-lg flex items-center gap-2">
					<User className="h-5 w-5 text-primary" />
					Professional Summary
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-6 space-y-6">
				<div className="grid sm:grid-cols-2 gap-4">
					<form.Field name="currentRoleId">
						{(field: any) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>Current Role</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value)}
								>
									<SelectTrigger id={field.name} className="w-full">
										<SelectValue placeholder="Select current role" />
									</SelectTrigger>
									<SelectContent>
										{professions?.map((prof: any) => (
											<SelectItem key={prof.id} value={prof.id}>
												{prof.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError
									message={getErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="organization">
						{(field: any) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>Company / Organization</Label>
								<Input
									id={field.name}
									placeholder="e.g. Google"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldError
									message={getErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<form.Field name="yearsOfExperience">
						{(field: any) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>Years of Experience</Label>
								<Input
									id={field.name}
									type="number"
									value={field.state.value}
									onChange={(e) => field.handleChange(Number(e.target.value))}
									onBlur={field.handleBlur}
								/>
								<FieldError
									message={getErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="personalWebsite">
						{(field: any) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>
									Personal Website / Portfolio (Optional)
								</Label>
								<Input
									id={field.name}
									placeholder="https://yourportfolio.com"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldError
									message={getErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
				</div>

				<form.Field name="bio">
					{(field: any) => (
						<div className="space-y-1.5">
							<Label htmlFor={field.name}>Professional Bio</Label>
							<textarea
								id={field.name}
								className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
								placeholder="Briefly describe your professional background and why you want to mentor."
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							<FieldError message={getErrorMessage(field.state.meta.errors)} />
						</div>
					)}
				</form.Field>
			</CardContent>
		</Card>
	);
}
