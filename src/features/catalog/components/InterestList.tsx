import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CatalogInterest } from "../types";
import { InterestTable } from "./InterestTable";

interface InterestListProps {
	interests: CatalogInterest[];
	onAddInterest: () => void;
	onEditInterest: (interestId: string) => void;
	onEditSkill: (skillId: string) => void;
	onAddSkill: (interestId: string) => void;
	onDisableInterest: (id: string) => void;
	onEnableInterest: (id: string) => void;
	onDisableSkill: (id: string) => void;
	onEnableSkill: (id: string) => void;
}

export function InterestList({
	interests,
	onAddInterest,
	onEditInterest,
	onEditSkill,
	onAddSkill,
	onDisableInterest,
	onEnableInterest,
	onDisableSkill,
	onEnableSkill,
}: InterestListProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button className="shadow-sm" onClick={onAddInterest}>
					<Plus className="w-4 h-4 mr-2" />
					Add Interest
				</Button>
			</div>

			<InterestTable
				interests={interests}
				onEditInterest={onEditInterest}
				onEditSkill={onEditSkill}
				onAddSkill={onAddSkill}
				onDisableInterest={onDisableInterest}
				onEnableInterest={onEnableInterest}
				onDisableSkill={onDisableSkill}
				onEnableSkill={onEnableSkill}
			/>
		</div>
	);
}
