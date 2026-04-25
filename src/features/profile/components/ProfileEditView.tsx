import { useForm } from "@tanstack/react-form";
import { Camera, Loader2, Mail, Phone, Save, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/FieldError";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { fileService } from "@/shared/services/file.service";
import { buildFieldErrorsFromIssues } from "@/shared/utils/formValidation";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";
import type { UserProfile } from "../types";
import { profileUpdateSchema } from "../validators";
import { ImageCropper } from "./ImageCropper";

interface Props {
	profile: UserProfile;
	onCancel: () => void;
}

export function ProfileEditView({ profile, onCancel }: Props) {
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		profile.profilePictureUrl,
	);
	const [croppingImage, setCroppingImage] = useState<string | null>(null);

	const updateProfileMutation = useUpdateProfile({
		onSuccess: (response) => {
			toast.success(response.message || "Profile updated successfully");
			onCancel();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});

	const form = useForm({
		defaultValues: {
			name: profile.name,
			profilePictureId: undefined as string | undefined,
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = profileUpdateSchema.safeParse(value);
				return result.success
					? undefined
					: { fields: buildFieldErrorsFromIssues(result.error.issues) };
			},
		},
		onSubmit: async ({ value }) => {
			const payload: { name: string; profilePictureId?: string } = {
				name: value.name,
			};

			if (value.profilePictureId) {
				payload.profilePictureId = value.profilePictureId;
			}

			await updateProfileMutation.mutateAsync(payload);
		},
	});

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.addEventListener("load", () => {
			setCroppingImage(reader.result as string);
		});
		reader.readAsDataURL(file);
	};

	const handleCropComplete = async (croppedBlob: Blob) => {
		setCroppingImage(null);
		setIsUploading(true);
		try {
			const file = new File([croppedBlob], "profile-picture.jpg", {
				type: "image/jpeg",
			});
			const key = await fileService.handleFileUpload(file, "profile-picture");
			form.setFieldValue("profilePictureId", key);
			setPreviewUrl(URL.createObjectURL(croppedBlob));
		} catch (_error) {
			toast.error("Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Card className="border-border/60 shadow-sm overflow-hidden bg-gradient-to-b from-primary/5 to-background animate-in fade-in duration-500">
			<CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
				<div className="space-y-1">
					<CardTitle className="flex items-center gap-2 text-xl">
						<User className="h-5 w-5 text-primary" />
						Edit Profile
					</CardTitle>
					<CardDescription>
						Update your name and profile picture. Email and phone stay
						read-only.
					</CardDescription>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onCancel}
					className="rounded-full"
				>
					<X className="h-4 w-4 mr-2" />
					Close
				</Button>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-8"
				>
					<div className="grid gap-6 lg:grid-cols-[260px_1fr]">
						<div className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm">
							<div className="flex flex-col items-center gap-4 text-center">
								<div className="relative group">
									<Avatar className="h-32 w-32 border-4 border-background shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
										<AvatarImage src={previewUrl || ""} alt={profile.name} />
										<AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
											{profile.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<label
										htmlFor="profile-upload-edit-cropper"
										className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/45 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100"
									>
										<div className="flex flex-col items-center gap-1">
											<Camera className="h-6 w-6 text-white" />
											<span className="text-[10px] font-bold uppercase text-white">
												Change
											</span>
										</div>
									</label>
									<input
										id="profile-upload-edit-cropper"
										type="file"
										className="hidden"
										accept="image/*"
										onChange={handleImageSelect}
										disabled={isUploading}
									/>
									{isUploading && (
										<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
											<Loader2 className="h-8 w-8 animate-spin text-white" />
										</div>
									)}
								</div>

								<div className="space-y-1">
									<p className="text-base font-semibold">{profile.name}</p>
									<Badge variant="secondary" className="rounded-full px-3 py-1">
										{profile.role}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									Hover the avatar to update your picture.
								</p>
							</div>
						</div>

						<div className="space-y-6">
							<div className="space-y-2">
								<Label
									htmlFor="name"
									className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
								>
									Full Name
								</Label>
								<form.Field name="name">
									{(field) => (
										<div className="space-y-2">
											<Input
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Your full name"
												className="h-12 rounded-xl border-border/60 bg-background font-medium focus-visible:ring-primary"
											/>
											<FieldError
												message={getErrorMessage(field.state.meta.errors?.[0])}
											/>
										</div>
									)}
								</form.Field>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
									<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
										<Mail className="h-3.5 w-3.5 text-primary" />
										Email
									</div>
									<p className="mt-2 text-sm font-medium text-foreground">
										{profile.email}
									</p>
								</div>
								<div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
									<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
										<Phone className="h-3.5 w-3.5 text-primary" />
										Phone
									</div>
									<p className="mt-2 text-sm font-medium text-foreground">
										{profile.phone || "Not provided"}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="outline"
							className="rounded-full px-5"
							onClick={onCancel}
							disabled={isUploading || updateProfileMutation.isPending}
						>
							Discard Changes
						</Button>
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									className="rounded-full px-5"
									disabled={
										isSubmitting ||
										updateProfileMutation.isPending ||
										isUploading
									}
								>
									{(isSubmitting || updateProfileMutation.isPending) && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									<Save className="mr-2 h-4 w-4" />
									Update Profile
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>

				{croppingImage && (
					<ImageCropper
						image={croppingImage}
						onCropComplete={handleCropComplete}
						onCancel={() => setCroppingImage(null)}
					/>
				)}
			</CardContent>
		</Card>
	);
}
