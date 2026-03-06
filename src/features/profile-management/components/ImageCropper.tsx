import { useState, useCallback } from "react";
import Cropper, { type Point, type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getCroppedImg } from "../utils/cropImage";

interface Props {
	image: string;
	onCropComplete: (croppedBlob: Blob) => void;
	onCancel: () => void;
}

export function ImageCropper({ image, onCropComplete, onCancel }: Props) {
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
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Crop Profile Picture</DialogTitle>
				</DialogHeader>
				<div className="relative h-[400px] w-full bg-slate-100">
					<Cropper
						image={image}
						crop={crop}
						zoom={zoom}
						aspect={1}
						onCropChange={onCropChange}
						onCropComplete={onCropCompleteCallback}
						onZoomChange={onZoomChange}
						cropShape="round"
						showGrid={false}
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
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button onClick={handleCrop}>Crop & Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
