import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InterestCard } from "./InterestCard";
import type { CatalogInterest } from "../types";

interface InterestListProps {
	interests: CatalogInterest[];
	onAddInterest: () => void;
	onAddSkill: (interestId: string) => void;
	onDisableInterest: (id: string) => void;
	onDisableSkill: (id: string) => void;
}

export function InterestList({
	interests,
	onAddInterest,
	onAddSkill,
	onDisableInterest,
	onDisableSkill,
}: InterestListProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button className="shadow-sm" onClick={onAddInterest}>
					<Plus className="w-4 h-4 mr-2" />
					Add Interest
				</Button>
			</div>

			<div className="grid gap-6">
				{interests.map((interest) => (
					<InterestCard
						key={interest.id}
						interest={interest}
						onAddSkill={onAddSkill}
						onDisableInterest={onDisableInterest}
						onDisableSkill={onDisableSkill}
					/>
				))}
			</div>
		</div>
	);
}
