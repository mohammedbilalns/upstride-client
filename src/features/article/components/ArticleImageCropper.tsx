import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { getCroppedImg } from "../../profile-management/utils/cropImage";

interface Props {
	image: string;
	onCropComplete: (croppedBlob: Blob) => void;
	onCancel: () => void;
}

export function ArticleImageCropper({
	image,
	onCropComplete,
	onCancel,
}: Props) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const onCropChange = useCallback((crop: Point) => {
		setCrop(crop);
	}, []);

	const onZoomChange = useCallback((zoom: number) => {
		setZoom(zoom);
	}, []);

	const onCropCompleteCallback = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const handleCrop = async () => {
		if (!croppedAreaPixels) return;
		try {
			const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
			onCropComplete(croppedBlob);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Dialog open onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-150">
				<DialogHeader>
					<DialogTitle>Crop Featured Image</DialogTitle>
				</DialogHeader>
				<div className="relative h-75 w-full bg-slate-100 overflow-hidden rounded-xl">
					<Cropper
						image={image}
						crop={crop}
						zoom={zoom}
						aspect={16 / 9}
						onCropChange={onCropChange}
						onCropComplete={onCropCompleteCallback}
						onZoomChange={onZoomChange}
						showGrid={true}
					/>
				</div>
				<div className="py-4 space-y-2">
					<p className="text-sm font-medium">Zoom</p>
					<input
						type="range"
						value={zoom}
						min={1}
						max={3}
						step={0.1}
						aria-labelledby="Zoom"
						onChange={(e) => setZoom(Number(e.target.value))}
						className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
					/>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={onCancel}
						className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 dark:border-primary/40 dark:hover:bg-primary/20"
					>
						Cancel
					</Button>
					<Button onClick={handleCrop} className="rounded-xl">
						Crop & Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
