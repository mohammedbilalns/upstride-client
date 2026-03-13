import { useForm } from "@tanstack/react-form";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { fileService } from "@/shared/services/file.service";
import { useUpdateProfile } from "../hooks/use-update-profile";
import type { UserProfileDTO } from "../types";
import { profileUpdateSchema } from "../validators";

interface Props {
	profile: UserProfileDTO;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ profile, open, onOpenChange }: Props) {
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		profile.profilePictureUrl,
	);

	const updateProfileMutation = useUpdateProfile({
		onSuccess: (response) => {
			toast.success(response.message || "Profile updated successfully");
			onOpenChange(false);
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
		onSubmit: async ({ value }) => {
			const result = profileUpdateSchema.safeParse(value);
			if (!result.success) return;

			// We only send name and profilePictureId if it was changed
			const payload: { name: string; profilePictureId?: string } = {
				name: value.name,
			};

			if (value.profilePictureId) {
				payload.profilePictureId = value.profilePictureId;
			}

			updateProfileMutation.mutate(payload);
		},
	});

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			toast.error("Image size must be less than 2MB");
			return;
		}

		setIsUploading(true);
		try {
			const key = await fileService.handleFileUpload(file, "profile-picture");
			form.setFieldValue("profilePictureId", key);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			toast.success("Profile picture uploaded");
		} catch (error) {
			toast.error("Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<DialogHeader className="p-6 bg-primary text-primary-foreground">
						<DialogTitle className="text-2xl font-bold">
							Edit Profile
						</DialogTitle>
						<DialogDescription className="text-primary-foreground/80">
							Update your personal information and profile picture.
						</DialogDescription>
					</DialogHeader>

					<div className="p-6 space-y-8">
						{/* Profile Picture Upload */}
						<div className="flex flex-col items-center gap-4">
							<div className="relative group">
								<Avatar className="h-28 w-28 border-4 border-background shadow-xl">
									<AvatarImage src={previewUrl || ""} alt={profile.name} />
									<AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
										{profile.name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<label
									htmlFor="profile-upload"
									className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
								>
									<Camera className="h-8 w-8 text-white" />
								</label>
								<input
									id="profile-upload"
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleImageChange}
									disabled={isUploading}
								/>
								{isUploading && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
										<Loader2 className="h-8 w-8 text-white animate-spin" />
									</div>
								)}
							</div>
							<p className="text-xs text-muted-foreground font-medium">
								Click image to upload new photo (Max 2MB)
							</p>
						</div>

						<div className="grid gap-6">
							<form.Field name="name">
								{(field) => (
									<div className="space-y-2">
										<Label
											htmlFor={field.name}
											className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
										>
											Full Name
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="h-12 rounded-xl border-border/50 bg-secondary/30 focus-visible:ring-primary shadow-inner"
											placeholder="Your full name"
										/>
										<FieldError
											message={
												(
													field.state.meta.errors?.[0] as
														| { message?: string }
														| undefined
												)?.message
											}
										/>
									</div>
								)}
							</form.Field>

							<div className="space-y-2 opacity-70">
								<Label
									htmlFor="email-readonly"
									className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
								>
									Email Address
								</Label>
								<Input
									id="email-readonly"
									value={profile.email}
									readOnly
									className="h-12 rounded-xl border-border/50 bg-secondary/30 cursor-not-allowed shadow-inner"
								/>
								<p className="text-[10px] text-muted-foreground italic">
									Email cannot be changed.
								</p>
							</div>

							<div className="space-y-2 opacity-70">
								<Label
									htmlFor="phone-readonly"
									className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
								>
									Phone Number
								</Label>
								<Input
									id="phone-readonly"
									value={profile.phone || ""}
									readOnly
									className="h-12 rounded-xl border-border/50 bg-secondary/30 cursor-not-allowed shadow-inner"
								/>
								<p className="text-[10px] text-muted-foreground italic">
									Phone number cannot be changed.
								</p>
							</div>
						</div>
					</div>

					<DialogFooter className="p-6 bg-secondary/30 border-t border-border/50 flex flex-row gap-3 sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1 sm:flex-none rounded-xl h-11 px-6 font-bold"
						>
							Cancel
						</Button>
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									disabled={
										isSubmitting ||
										updateProfileMutation.isPending ||
										isUploading
									}
									className="flex-1 sm:flex-none rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20"
								>
									{(isSubmitting || updateProfileMutation.isPending) && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Changes
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
