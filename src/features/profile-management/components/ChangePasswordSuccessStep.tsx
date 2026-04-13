import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChangePasswordSuccessStepProps {
	onDone: () => void;
}

export function ChangePasswordSuccessStep({
	onDone,
}: ChangePasswordSuccessStepProps) {
	return (
		<div className="pt-4 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
			<div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
				<CheckCircle2 className="h-10 w-10 text-green-600" />
			</div>
			<h3 className="text-lg font-semibold mb-2">
				Password Successfully Changed
			</h3>
			<Button onClick={onDone} className="w-full mt-4">
				Done
			</Button>
		</div>
	);
}
