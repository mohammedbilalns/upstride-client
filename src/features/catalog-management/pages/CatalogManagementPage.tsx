import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useCatalog, useCatalogMutations } from "../hooks/use-catalog";
import { InterestList } from "../components/InterestList";
import { ProfessionTable } from "../components/ProfessionTable";
import { AddItemDialog } from "@/components/common/AddItemDialog";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { catalogItemNameSchema } from "../validators/catalog.schema";

export function CatalogManagementPage() {
	const navigate = useNavigate();
	const { tab = "interests" } = useSearch({ strict: false }) as any;

	const { data: catalog, isLoading } = useCatalog();
	const {
		addInterest,
		disableInterest,
		addProfession,
		disableProfession,
		addSkill,
		disableSkill,
	} = useCatalogMutations();

	const [isInterestDialogOpen, setIsInterestDialogOpen] = useState(false);
	const [isProfessionDialogOpen, setIsProfessionDialogOpen] = useState(false);
	const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
	const [isConfirmDisableOpen, setIsConfirmDisableOpen] = useState(false);

	const [selectedInterestId, setSelectedInterestId] = useState("");
	const [itemToDisable, setItemToDisable] = useState<{
		id: string;
		type: "interest" | "skill" | "profession";
	} | null>(null);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	const handleAddInterest = async (name: string) => {
		await addInterest.mutateAsync({ name });
		setIsInterestDialogOpen(false);
	};

	const handleAddProfession = async (name: string) => {
		await addProfession.mutateAsync({ name });
		setIsProfessionDialogOpen(false);
	};

	const handleAddSkill = async (name: string) => {
		if (!selectedInterestId) return;
		await addSkill.mutateAsync({ name, interestId: selectedInterestId });
		setIsSkillDialogOpen(false);
		setSelectedInterestId("");
	};

	const handleConfirmDisable = async () => {
		if (!itemToDisable) return;

		const { id, type } = itemToDisable;
		if (type === "interest") await disableInterest.mutateAsync(id);
		else if (type === "skill") await disableSkill.mutateAsync(id);
		else if (type === "profession") await disableProfession.mutateAsync(id);

		setIsConfirmDisableOpen(false);
		setItemToDisable(null);
	};

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Catalog Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Manage interests, skills, and professions available in the system.
				</p>
			</div>

			<Tabs
				value={tab}
				onValueChange={(value) => (navigate as any)({ search: { tab: value } })}
				className="space-y-4"
			>
				<TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
					<TabsTrigger value="interests">Interests & Skills</TabsTrigger>
					<TabsTrigger value="professions">Professions</TabsTrigger>
				</TabsList>

				<TabsContent value="interests">
					<InterestList
						interests={catalog?.data.interests || []}
						onAddInterest={() => setIsInterestDialogOpen(true)}
						onAddSkill={(id) => {
							setSelectedInterestId(id);
							setIsSkillDialogOpen(true);
						}}
						onDisableInterest={(id) => {
							setItemToDisable({ id, type: "interest" });
							setIsConfirmDisableOpen(true);
						}}
						onDisableSkill={(id) => {
							setItemToDisable({ id, type: "skill" });
							setIsConfirmDisableOpen(true);
						}}
					/>
				</TabsContent>

				<TabsContent value="professions">
					<ProfessionTable
						professions={catalog?.data.professions || []}
						onAddProfession={() => setIsProfessionDialogOpen(true)}
						onDisableProfession={(id) => {
							setItemToDisable({ id, type: "profession" });
							setIsConfirmDisableOpen(true);
						}}
					/>
				</TabsContent>
			</Tabs>

			{/* Dialogs */}
			<AddItemDialog
				isOpen={isInterestDialogOpen}
				onOpenChange={setIsInterestDialogOpen}
				onConfirm={handleAddInterest}
				title="Add New Interest"
				description="Enter the name of the interest category you want to create."
				label="Name"
				placeholder="e.g. Technology"
				confirmText="Add Interest"
				isLoading={addInterest.isPending}
				schema={catalogItemNameSchema}
			/>

			<AddItemDialog
				isOpen={isProfessionDialogOpen}
				onOpenChange={setIsProfessionDialogOpen}
				onConfirm={handleAddProfession}
				title="Add New Profession"
				description="Enter the name of the profession you want to add."
				label="Name"
				placeholder="e.g. Software Engineer"
				confirmText="Add Profession"
				isLoading={addProfession.isPending}
				schema={catalogItemNameSchema}
			/>

			<AddItemDialog
				isOpen={isSkillDialogOpen}
				onOpenChange={setIsSkillDialogOpen}
				onConfirm={handleAddSkill}
				title="Add New Skill"
				description="Add a new skill to the selected interest category."
				label="Skill Name"
				placeholder="e.g. React"
				confirmText="Add Skill"
				isLoading={addSkill.isPending}
				schema={catalogItemNameSchema}
			/>

			<ConfirmModal
				isOpen={isConfirmDisableOpen}
				onClose={() => setIsConfirmDisableOpen(false)}
				onConfirm={handleConfirmDisable}
				title="Confirm Action"
				message={`Are you sure you want to disable this ${itemToDisable?.type}? This action will hide it from users but won't delete existing data.`}
				variant="destructive"
				isLoading={
					disableInterest.isPending ||
					disableSkill.isPending ||
					disableProfession.isPending
				}
				confirmText="Yes, Disable"
				cancelText="Keep It"
			/>
		</div>
	);
}
