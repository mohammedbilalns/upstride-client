import { isValid, parse } from "date-fns";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatDateInput } from "@/shared/utils/date";
import { useProfessions } from "../hooks/use-catalog";

interface ExperienceSectionProps {
	form: any;
	getErrorMessage: (errors: any[]) => string | undefined;
}

const MAX_EXPERIENCE_ITEMS = 7;

export function ExperienceSection({
	form,
	getErrorMessage,
}: ExperienceSectionProps) {
	const { data: professions } = useProfessions();

	const handleDateChange = (
		field: any,
		index: number,
		type: "from" | "to",
		value: string,
	) => {
		if (!value) {
			const newValue = [...field.state.value];
			newValue[index] = {
				...newValue[index],
				[type]: type === "from" ? "" : null,
			};
			field.handleChange(newValue);
			return;
		}

		const parsedDate = parse(value, "yyyy-MM-dd", new Date());
		if (!isValid(parsedDate)) {
			const newValue = [...field.state.value];
			newValue[index] = { ...newValue[index], [type]: "" };
			field.handleChange(newValue);
			return;
		}

		const now = new Date();
		if (parsedDate > now) {
			toast.error(
				`${type === "from" ? "From" : "To"} date cannot be in the future`,
			);
			const newValue = [...field.state.value];
			newValue[index] = {
				...newValue[index],
				[type]: type === "from" ? "" : null,
			};
			field.handleChange(newValue);
			return;
		}

		const exp = field.state.value[index];
		if (type === "from" && exp.to && parsedDate > new Date(exp.to)) {
			toast.error("From date cannot be after To date");
			const newValue = [...field.state.value];
			newValue[index] = { ...newValue[index], from: "" };
			field.handleChange(newValue);
			return;
		}
		if (type === "to" && exp.from && parsedDate < new Date(exp.from)) {
			toast.error("To date cannot be before From date");
			const newValue = [...field.state.value];
			newValue[index] = { ...newValue[index], to: null };
			field.handleChange(newValue);
			return;
		}

		const newValue = [...field.state.value];
		newValue[index] = {
			...newValue[index],
			[type]: parsedDate.toISOString(),
		};
		field.handleChange(newValue);
	};

	return (
		<Card className="overflow-hidden border-none shadow-md ring-1 ring-border/50">
			<CardHeader className="bg-muted/30 pb-4">
				<CardTitle className="text-lg flex items-center gap-2">
					<Briefcase className="h-5 w-5 text-primary" />
					Professional Experience
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-6 space-y-6">
				<form.Field name="experience">
					{(field: any) => (
						<div className="space-y-6">
							{field.state.value.map((_: any, index: number) => (
								<Card key={index} className="border-border/50 bg-background/50">
									<CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-border/10">
										<span className="text-sm font-semibold opacity-70">
											Experience {index + 1}
										</span>
										{field.state.value.length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground hover:text-destructive"
												onClick={() => {
													const newValue = field.state.value.filter(
														(_: any, i: number) => i !== index,
													);
													field.handleChange(newValue);
												}}
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										)}
									</CardHeader>
									<CardContent className="p-4 space-y-4">
										<div className="grid sm:grid-cols-2 gap-4">
											<form.Field name={`experience[${index}].company`}>
												{(subField: any) => (
													<div className="space-y-1.5">
														<Label className="text-xs">Company</Label>
														<Input
															placeholder="Google"
															value={subField.state.value}
															onChange={(e) =>
																subField.handleChange(e.target.value)
															}
															onBlur={subField.handleBlur}
														/>
														<FieldError
															message={getErrorMessage(
																subField.state.meta.errors,
															)}
														/>
													</div>
												)}
											</form.Field>
											<form.Field name={`experience[${index}].role`}>
												{(subField: any) => (
													<div className="space-y-1.5">
														<Label className="text-xs">Role</Label>
														<Select
															value={subField.state.value}
															onValueChange={(value) =>
																subField.handleChange(value)
															}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select Role" />
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
															message={getErrorMessage(
																subField.state.meta.errors,
															)}
														/>
													</div>
												)}
											</form.Field>
										</div>
										<div className="grid sm:grid-cols-2 gap-4">
											<form.Field name={`experience[${index}].from`}>
												{(subField: any) => (
													<div className="space-y-1.5">
														<Label className="text-xs">From Date</Label>
														<Input
															type="date"
															value={formatDateInput(subField.state.value)}
															onChange={(e) => {
																handleDateChange(
																	field,
																	index,
																	"from",
																	e.target.value,
																);
															}}
															onBlur={subField.handleBlur}
														/>
														<FieldError
															message={getErrorMessage(
																subField.state.meta.errors,
															)}
														/>
													</div>
												)}
											</form.Field>
											<form.Field name={`experience[${index}].to`}>
												{(subField: any) => (
													<div className="space-y-1.5">
														<Label className="text-xs">
															To Date (or empty for current)
														</Label>
														<Input
															type="date"
															value={formatDateInput(subField.state.value)}
															onChange={(e) => {
																handleDateChange(
																	field,
																	index,
																	"to",
																	e.target.value,
																);
															}}
															onBlur={subField.handleBlur}
														/>
														<FieldError
															message={getErrorMessage(
																subField.state.meta.errors,
															)}
														/>
													</div>
												)}
											</form.Field>
										</div>
										<form.Field name={`experience[${index}].description`}>
											{(subField: any) => (
												<div className="space-y-1.5">
													<Label className="text-xs">Description</Label>
													<Input
														placeholder="What was your main impact?"
														value={subField.state.value}
														onChange={(e) =>
															subField.handleChange(e.target.value)
														}
														onBlur={subField.handleBlur}
													/>
													<FieldError
														message={getErrorMessage(
															subField.state.meta.errors,
														)}
													/>
												</div>
											)}
										</form.Field>
									</CardContent>
								</Card>
							))}
							<Button
								type="button"
								variant="outline"
								className="w-full border-dashed rounded-xl py-6 h-auto hover:bg-muted/50 transition-all"
								disabled={field.state.value.length >= MAX_EXPERIENCE_ITEMS}
								onClick={() =>
									field.handleChange([
										...field.state.value,
										{
											company: "",
											role: "",
											description: "",
											from: "",
											to: null,
										},
									])
								}
							>
								{field.state.value.length >= MAX_EXPERIENCE_ITEMS ? (
									"Maximum Experience Reached"
								) : (
									<>
										<Plus className="h-4 w-4 mr-2" /> Add More Experience
									</>
								)}
							</Button>
							<FieldError message={getErrorMessage(field.state.meta.errors)} />
						</div>
					)}
				</form.Field>
			</CardContent>
		</Card>
	);
}
