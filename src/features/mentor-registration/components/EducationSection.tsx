import type { useForm } from "@tanstack/react-form";
import {
	Eye,
	FileText,
	GraduationCap,
	Loader2,
	Plus,
	Trash2,
	Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Mentor } from "@/features/mentor-registration/types";
import type { MentorRegistrationValues } from "@/features/mentor-registration/validators/mentor-registration.schema";
import { useDeleteFile } from "@/shared/hooks/use-delete-file";
import { fileService } from "@/shared/services/file.service";

interface EducationSectionProps {
	form: ReturnType<typeof useForm<MentorRegistrationValues>>;
	isUploading: boolean;
	setIsUploading: (val: boolean) => void;
	getErrorMessage: (errors: unknown[]) => string | undefined;
	existingProfile?: Mentor | null;
}

const MAX_EDUCATION_ITEMS = 5;

export function EducationSection({
	form,
	isUploading,
	setIsUploading,
	getErrorMessage,
	existingProfile,
}: EducationSectionProps) {
	const deleteFileMutation = useDeleteFile();
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		existingProfile?.resumeUrl || null,
	);

	useEffect(() => {
		return () => {
			if (previewUrl?.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	return (
		<Card className="overflow-hidden border-none shadow-md ring-1 ring-border/50">
			<CardHeader className="bg-muted/30 pb-4">
				<CardTitle className="text-lg flex items-center gap-2">
					<GraduationCap className="h-5 w-5 text-primary" />
					Education & Resume
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-6 space-y-8">
				<form.Field name="educationalQualifications">
					{(field) => (
						<div className="space-y-4">
							<Label>Educational Qualifications</Label>
							<div className="space-y-3">
								{field.state.value.map(
									(qualification: string, index: number) => (
										<form.Field
											key={qualification}
											name={`educationalQualifications[${index}]`}
										>
											{(subField) => (
												<div className="space-y-1">
													<div className="flex gap-2">
														<Input
															placeholder="e.g. B.Tech in Computer Science, Stanford University"
															value={subField.state.value}
															onChange={(e) =>
																subField.handleChange(e.target.value)
															}
															onBlur={subField.handleBlur}
														/>
														{field.state.value.length > 1 && (
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="text-muted-foreground hover:text-destructive"
																onClick={() => {
																	const newValue = field.state.value.filter(
																		(_value, i: number) => i !== index,
																	);
																	field.handleChange(newValue);
																}}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														)}
													</div>
													<FieldError
														message={getErrorMessage(
															subField.state.meta.errors,
														)}
													/>
												</div>
											)}
										</form.Field>
									),
								)}
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="rounded-full"
								disabled={field.state.value.length >= MAX_EDUCATION_ITEMS}
								onClick={() => field.handleChange([...field.state.value, ""])}
							>
								{field.state.value.length >= MAX_EDUCATION_ITEMS ? (
									"Maximum Qualifications Reached"
								) : (
									<>
										<Plus className="h-3.5 w-3.5 mr-1" /> Add Qualification
									</>
								)}
							</Button>
							<FieldError message={getErrorMessage(field.state.meta.errors)} />
						</div>
					)}
				</form.Field>

				<form.Field name="resumeId">
					{(field) => (
						<div className="space-y-3">
							<Label>Resume / CV</Label>
							<div
								className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
									field.state.value
										? "border-green-500/30 bg-green-500/5 dark:bg-green-500/10"
										: "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
								}`}
							>
								{field.state.value ? (
									<div className="flex flex-col items-center">
										<div className="h-12 w-12 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mb-3">
											<FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
										</div>
										<p className="text-sm font-medium text-green-700 dark:text-green-400">
											Resume added
										</p>
										<div className="flex gap-2 mt-4">
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="h-9 px-4 rounded-full text-xs font-semibold bg-background"
												onClick={() =>
													document.getElementById("resume-upload")?.click()
												}
												disabled={isUploading}
											>
												{isUploading ? (
													<Loader2 className="h-3 w-3 animate-spin mr-2" />
												) : (
													<Upload className="h-3 w-3 mr-2" />
												)}
												Change File
											</Button>
											{previewUrl && (
												<Button
													type="button"
													variant="secondary"
													size="sm"
													className="h-9 px-4 rounded-full text-xs font-semibold"
													onClick={() => window.open(previewUrl, "_blank")}
												>
													<Eye className="h-3 w-3 mr-2" />
													Preview
												</Button>
											)}
										</div>
									</div>
								) : (
									<button
										type="button"
										className={`cursor-pointer w-full ${isUploading ? "pointer-events-none opacity-50" : ""}`}
										onClick={() =>
											document.getElementById("resume-upload")?.click()
										}
									>
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
											{isUploading ? (
												<Loader2 className="h-6 w-6 animate-spin" />
											) : (
												<Upload className="h-6 w-6" />
											)}
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">
												{isUploading
													? "Uploading..."
													: "Click to upload your resume"}
											</p>
											<p className="text-xs text-muted-foreground">
												PDF, DOC, DOCX up to 10MB
											</p>
										</div>
									</button>
								)}
								<input
									id="resume-upload"
									type="file"
									className="hidden"
									accept=".pdf,.doc,.docx"
									onChange={async (e) => {
										const file = e.target.files?.[0];
										if (!file) return;

										if (file.size > 10 * 1024 * 1024) {
											toast.error("File size must be less than 10MB");
											return;
										}

										const oldKey = field.state.value;
										setIsUploading(true);

										try {
											if (oldKey) {
												await deleteFileMutation.mutateAsync(oldKey);
											}
											const key = await fileService.handleFileUpload(
												file,
												"resume",
											);

											if (file.type === "application/pdf") {
												const url = URL.createObjectURL(file);
												setPreviewUrl(url);
											} else {
												setPreviewUrl(null);
											}

											field.handleChange(key);
										} catch (_err) {
											toast.error(
												"Failed to process resume. Please try again.",
											);
										} finally {
											setIsUploading(false);
										}
									}}
								/>
							</div>
							<FieldError message={getErrorMessage(field.state.meta.errors)} />
						</div>
					)}
				</form.Field>
			</CardContent>
		</Card>
	);
}
