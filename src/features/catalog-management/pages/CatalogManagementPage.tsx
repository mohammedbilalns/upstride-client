import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AddItemDialog } from "@/components/common/AddItemDialog";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route } from "@/routes/_admin-layout/catalog-management";
import { InterestList } from "../components/InterestList";
import { ProfessionTable } from "../components/ProfessionTable";
import { useCatalog, useCatalogMutations } from "../hooks/use-catalog";
import { catalogItemNameSchema } from "../validators/catalog.schema";

export function CatalogManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { tab = "interests" } = Route.useSearch();

	const { data: catalog, isLoading } = useCatalog();
	const {
		addInterest,
		disableInterest,
		enableInterest,
		addProfession,
		disableProfession,
		enableProfession,
		addSkill,
		disableSkill,
		enableSkill,
	} = useCatalogMutations();

	const [isInterestDialogOpen, setIsInterestDialogOpen] = useState(false);
	const [isProfessionDialogOpen, setIsProfessionDialogOpen] = useState(false);
	const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	const [selectedInterestId, setSelectedInterestId] = useState("");
	const [itemToConfirm, setItemToConfirm] = useState<{
		id: string;
		type: "interest" | "skill" | "profession";
		action: "disable" | "enable";
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

	const handleConfirmAction = async () => {
		if (!itemToConfirm) return;

		const { id, type, action } = itemToConfirm;

		if (action === "disable") {
			if (type === "interest") await disableInterest.mutateAsync(id);
			else if (type === "skill") await disableSkill.mutateAsync(id);
			else if (type === "profession") await disableProfession.mutateAsync(id);
		} else {
			if (type === "interest") await enableInterest.mutateAsync(id);
			else if (type === "skill") await enableSkill.mutateAsync(id);
			else if (type === "profession") await enableProfession.mutateAsync(id);
		}

		setIsConfirmModalOpen(false);
		setItemToConfirm(null);
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
				onValueChange={(value) => {
					const nextTab = value === "professions" ? "professions" : "interests";
					navigate({ search: { tab: nextTab } });
				}}
				className="space-y-4"
			>
				<TabsList className="grid w-full grid-cols-2 lg:w-100">
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
							setItemToConfirm({ id, type: "interest", action: "disable" });
							setIsConfirmModalOpen(true);
						}}
						onEnableInterest={(id) => {
							setItemToConfirm({ id, type: "interest", action: "enable" });
							setIsConfirmModalOpen(true);
						}}
						onDisableSkill={(id) => {
							setItemToConfirm({ id, type: "skill", action: "disable" });
							setIsConfirmModalOpen(true);
						}}
						onEnableSkill={(id) => {
							setItemToConfirm({ id, type: "skill", action: "enable" });
							setIsConfirmModalOpen(true);
						}}
					/>
				</TabsContent>

				<TabsContent value="professions">
					<ProfessionTable
						professions={catalog?.data.professions || []}
						onAddProfession={() => setIsProfessionDialogOpen(true)}
						onDisableProfession={(id) => {
							setItemToConfirm({ id, type: "profession", action: "disable" });
							setIsConfirmModalOpen(true);
						}}
						onEnableProfession={(id) => {
							setItemToConfirm({ id, type: "profession", action: "enable" });
							setIsConfirmModalOpen(true);
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
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				onConfirm={handleConfirmAction}
				title={
					itemToConfirm?.action === "disable"
						? "Confirm Disable"
						: "Confirm Enable"
				}
				message={
					itemToConfirm?.action === "disable"
						? `Are you sure you want to disable this ${itemToConfirm?.type}? This action will hide it from users but won't delete existing data.`
						: `Are you sure you want to re-enable this ${itemToConfirm?.type}? This will make it visible to users again.`
				}
				variant={
					itemToConfirm?.action === "disable" ? "destructive" : "default"
				}
				isLoading={
					disableInterest.isPending ||
					disableSkill.isPending ||
					disableProfession.isPending ||
					enableInterest.isPending ||
					enableSkill.isPending ||
					enableProfession.isPending
				}
				confirmText={
					itemToConfirm?.action === "disable" ? "Yes, Disable" : "Yes, Enable"
				}
				cancelText="Cancel"
			/>
		</div>
	);
}
