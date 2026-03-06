import { useForm } from "@tanstack/react-form";
import { Camera, Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fileService } from "@/shared/services/file.service";
import { useUpdateProfile } from "../hooks/use-update-profile";
import type { UserProfileDTO } from "../types";
import { profileUpdateSchema } from "../validators";
import { ImageCropper } from "./ImageCropper";

interface Props {
	profile: UserProfileDTO;
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
			profilePictureId: "",
		},
		validators: {
			onSubmit: profileUpdateSchema,
		},
		onSubmit: async ({ value }) => {
			const payload: any = {
				name: value.name,
			};

			if (value.profilePictureId) {
				payload.profilePictureId = value.profilePictureId;
			}

			updateProfileMutation.mutate(payload);
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
			toast.success("Profile picture cropped and uploaded");
		} catch (error) {
			toast.error("Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
			<div className="flex items-center justify-between border-b pb-4">
				<h3 className="text-2xl font-bold tracking-tight text-foreground">
					Edit Profile
				</h3>
				<Button
					variant="ghost"
					size="sm"
					onClick={onCancel}
					className="text-muted-foreground hover:bg-secondary/80 rounded-xl"
				>
					<X className="h-4 w-4 mr-2" />
					Cancel
				</Button>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-10"
			>
				{/* Basic Info Section */}
				<div className="space-y-6">
					<div className="flex items-center gap-3">
						<div className="h-8 w-1 rounded-full bg-primary" />
						<h4 className="font-bold text-lg text-foreground/80">
							Basic Information
						</h4>
					</div>

					<Card className="border-none shadow-md bg-secondary/5 rounded-3xl overflow-hidden">
						<CardContent className="p-8">
							<div className="flex flex-col md:flex-row items-center gap-10">
								<div className="relative group">
									<Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition-transform group-hover:scale-105 duration-300">
										<AvatarImage src={previewUrl || ""} alt={profile.name} />
										<AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
											{profile.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<label
										htmlFor="profile-upload-edit-cropper"
										className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
									>
										<div className="flex flex-col items-center gap-1">
											<Camera className="h-6 w-6 text-white" />
											<span className="text-[10px] text-white font-bold uppercase">
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
										<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm">
											<Loader2 className="h-8 w-8 text-white animate-spin" />
										</div>
									)}
								</div>

								<div className="flex-1 space-y-6 w-full">
									<form.Field name="name">
										{(field) => (
											<div className="space-y-2">
												<Label
													htmlFor={field.name}
													className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
												>
													Full Name
												</Label>
												<Input
													id={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Your full name"
													className="h-12 bg-background border-border/50 rounded-xl focus-visible:ring-primary font-medium"
												/>
												<FieldError
													message={field.state.meta.errors?.[0]?.message}
												/>
											</div>
										)}
									</form.Field>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div className="space-y-2 opacity-60">
											<Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Email (Read-only)
											</Label>
											<Input
												value={profile.email}
												readOnly
												className="h-12 bg-muted/50 border-transparent rounded-xl cursor-not-allowed font-medium"
											/>
										</div>
										<div className="space-y-2 opacity-60">
											<Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Phone (Read-only)
											</Label>
											<Input
												value={profile.phone || "Not provided"}
												readOnly
												className="h-12 bg-muted/50 border-transparent rounded-xl cursor-not-allowed font-medium"
											/>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col-reverse sm:flex-row gap-4 border-t pt-10">
					<Button
						type="button"
						variant="outline"
						className="flex-1 h-14 rounded-2xl font-bold text-base border-border/60"
						onClick={onCancel}
					>
						Discard Changes
					</Button>
					<form.Subscribe selector={(s) => s.isSubmitting}>
						{(isSubmitting) => (
							<Button
								type="submit"
								className="flex-[2] h-14 rounded-2xl font-bold text-base shadow-2xl shadow-primary/30"
								disabled={
									isSubmitting || updateProfileMutation.isPending || isUploading
								}
							>
								{(isSubmitting || updateProfileMutation.isPending) && (
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								)}
								<Save className="mr-2 h-5 w-5" />
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
		</div>
	);
}
