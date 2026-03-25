import { useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fileService } from "@/shared/services/file.service";
import { ArticleImageCropper } from "./ArticleImageCropper";

interface Props {
	value?: string;
	previewUrl?: string;
	onChange: (value: string) => void;
	onRemove: () => void;
}

export function ArticleImageUpload({
	value,
	previewUrl,
	onChange,
	onRemove,
}: Props) {
	const [isUploading, setIsUploading] = useState(false);
	const [croppingImage, setCroppingImage] = useState<string | null>(null);
	const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

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
			const localUrl = URL.createObjectURL(croppedBlob);
			setLocalPreviewUrl(localUrl);

			const file = new File([croppedBlob], "featured-image.jpg", {
				type: "image/jpeg",
			});
			const key = await fileService.handleFileUpload(
				file,
				"article-featured-image",
			);
			onChange(key);
			toast.success("Featured image uploaded successfully");
		} catch (error) {
			toast.error("Failed to upload image");
			console.error(error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex flex-col items-center justify-center transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 group">
				{value || localPreviewUrl || previewUrl ? (
					<>
						<img
							src={localPreviewUrl || previewUrl || value}
							alt="Featured"
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								className="rounded-xl h-9 px-4 bg-white/90 dark:bg-zinc-900/90"
								onClick={() =>
									document.getElementById("featured-image-upload")?.click()
								}
							>
								<Camera className="h-4 w-4 mr-2" />
								Change
							</Button>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								className="rounded-xl h-9 px-4"
								onClick={() => {
									setLocalPreviewUrl(null);
									onRemove();
								}}
							>
								<X className="h-4 w-4 mr-2" />
								Remove
							</Button>
						</div>
					</>
				) : (
					<label
						htmlFor="featured-image-upload"
						className="cursor-pointer flex flex-col items-center gap-2 p-8"
					>
						<div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-2">
							<Camera className="h-6 w-6 text-zinc-400" />
						</div>
						<span className="font-semibold text-zinc-900 dark:text-zinc-50">
							Upload Featured Image
						</span>
						<span className="text-sm text-zinc-500">
							16:9 aspect ratio recommended
						</span>
					</label>
				)}

				{isUploading && (
					<div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-10">
						<Loader2 className="h-8 w-8 text-primary animate-spin" />
					</div>
				)}
			</div>

			<input
				id="featured-image-upload"
				type="file"
				className="hidden"
				accept="image/*"
				onChange={handleImageSelect}
				disabled={isUploading}
			/>

			{croppingImage && (
				<ArticleImageCropper
					image={croppingImage}
					onCropComplete={handleCropComplete}
					onCancel={() => setCroppingImage(null)}
				/>
			)}
		</div>
	);
}
