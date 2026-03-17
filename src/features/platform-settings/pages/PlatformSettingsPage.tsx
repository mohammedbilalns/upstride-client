import { useNavigate } from "@tanstack/react-router";
import * as lucideReact from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentSettings } from "../components/ContentSettings";
import { EconomySettings } from "../components/EconomySettings";
import { MentorSettings } from "../components/MentorSettings";
import { SessionSettings } from "../components/SessionSettings";
import {
	usePlatformSettings,
	usePlatformSettingsMutations,
} from "../hooks/use-platform-settings";
import { Route } from "@/routes/_admin-layout/platform-settings";
import type { PlatformSettingsSearch } from "../validators/platform-settings.schema";

type PlatformSettingsTab = NonNullable<PlatformSettingsSearch["tab"]>;
const FALLBACK_TAB: PlatformSettingsTab = "economy";

export function PlatformSettingsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { tab = "economy" } = Route.useSearch();
	const activeTab = (tab ?? FALLBACK_TAB) as PlatformSettingsTab;

	const { data: response, isLoading } = usePlatformSettings();
	const mutations = usePlatformSettingsMutations();

	const setActiveTab = (newTab: PlatformSettingsTab) => {
		navigate({
			search: { tab: newTab },
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<lucideReact.Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	const settings = response?.data;

	if (!settings) {
		return (
			<div className="p-8 text-center text-muted-foreground">
				Failed to load platform settings. Please try again later.
			</div>
		);
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto min-h-[calc(100vh+1px)]">
			<div className="border-b border-border/60 pb-8">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-primary/10 rounded-lg text-primary">
						<lucideReact.Settings2 className="w-6 h-6" />
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground">
						Platform Settings
					</h1>
				</div>
				<p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
					Manage core platform configurations including coin settings, mentor
					tiers, content requirements, and session rules.
				</p>
			</div>

			<Alert
				variant="default"
				className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500"
			>
				<lucideReact.ShieldAlert className="h-4 w-4" />
				<AlertTitle className="font-bold">Important Notice</AlertTitle>
				<AlertDescription className="text-sm opacity-90">
					Modifying these core settings will immediately affect user
					transactions, rewards, and overall interaction logic. Please proceed
					with caution and verify changes before saving.
				</AlertDescription>
			</Alert>

			<Tabs
				value={activeTab}
				onValueChange={(value) => setActiveTab(value as PlatformSettingsTab)}
				className="space-y-6"
			>
				<TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex flex-wrap lg:w-fit">
					<TabsTrigger
						value="economy"
						className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						Coin Settings
					</TabsTrigger>
					<TabsTrigger
						value="mentors"
						className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						Mentors
					</TabsTrigger>
					<TabsTrigger
						value="content"
						className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						Content
					</TabsTrigger>
					<TabsTrigger
						value="sessions"
						className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						Sessions
					</TabsTrigger>
				</TabsList>

				<TabsContent value="economy" className="mt-6">
					<EconomySettings
						settings={settings.economy}
						onUpdate={async (data) => {
							await mutations.updateEconomy.mutateAsync({ economy: data });
						}}
						isLoading={mutations.updateEconomy.isPending}
					/>
				</TabsContent>

				<TabsContent value="mentors" className="mt-6">
					<MentorSettings
						settings={settings.mentors}
						onUpdate={async (data) => {
							await mutations.updateMentors.mutateAsync({ mentors: data });
						}}
						isLoading={mutations.updateMentors.isPending}
					/>
				</TabsContent>

				<TabsContent value="content" className="mt-6">
					<ContentSettings
						settings={settings.content}
						onUpdate={async (data) => {
							await mutations.updateContent.mutateAsync({ content: data });
						}}
						isLoading={mutations.updateContent.isPending}
					/>
				</TabsContent>

				<TabsContent value="sessions" className="mt-6">
					<SessionSettings
						settings={settings.sessions}
						onUpdate={async (data) => {
							await mutations.updateSessions.mutateAsync({ sessions: data });
						}}
						isLoading={mutations.updateSessions.isPending}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
