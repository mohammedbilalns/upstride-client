import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMentorRegistrationInfo } from "@/features/mentor-registration/hooks/queries/useMentorRegistration";
import { MentorForm } from "../components/MentorForm";
import { StatusView } from "../components/StatusView";

export function MentorRegistrationPage() {
	const {
		data: registrationInfo,
		isLoading,
		error,
	} = useMentorRegistrationInfo();
	const [isEditing, setIsEditing] = useState(false);

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container max-w-lg py-20 text-center">
				<AlertCircle className="mx-auto h-12 w-12 text-destructive" />
				<h2 className="mt-4 text-2xl font-bold">Something went wrong</h2>
				<p className="mt-2 text-muted-foreground">
					Could not load your registration information. Please try again later.
				</p>
			</div>
		);
	}

	if (!registrationInfo?.data) {
		return null;
	}

	const { existingProfile, canApply, maxAttempts } = registrationInfo.data;

	// Determine view based on status
	if (existingProfile?.isApproved) {
		return (
			<StatusView
				title="Application Approved!"
				description="Congratulations! You are now an official mentor at Upstride. Welcome to the community."
				icon={<CheckCircle2 className="h-12 w-12 text-green-500" />}
			/>
		);
	}

	if (!canApply && !existingProfile?.isRejected) {
		return (
			<StatusView
				title="Application Limit Reached"
				description={`You have reached the maximum number of application attempts (${maxAttempts}). Please contact support if you believe this is an error.`}
				icon={<AlertCircle className="h-12 w-12 text-orange-500" />}
			/>
		);
	}

	if (existingProfile && !existingProfile.isRejected && !isEditing) {
		return (
			<div className="container mx-auto py-20 px-4">
				<StatusView
					title="Application Under Review"
					description="Our team is currently reviewing your mentor profile. We'll get back to you soon!"
					icon={<Info className="h-12 w-12 text-primary" />}
					showEditButton={true}
					onEdit={() => setIsEditing(true)}
				/>
			</div>
		);
	}

	if (existingProfile?.isRejected && !isEditing) {
		return (
			<StatusView
				title="Application Rejected"
				description={
					existingProfile.rejectionReason ||
					"Unfortunately, your application was not approved at this time."
				}
				icon={<AlertCircle className="h-12 w-12 text-destructive" />}
				showResubmitButton={true}
				onResubmit={() => setIsEditing(true)}
			/>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl py-12">
			<div className="mb-8 text-center sm:text-left">
				<h1 className="text-3xl font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
					{existingProfile ? "Update Your Application" : "Mentor Registration"}
				</h1>
				<p className="text-muted-foreground mt-2">
					{existingProfile
						? "Update your details to increase your chances of being approved."
						: "Fill out the form below to apply as a mentor on Upstride."}
				</p>
			</div>

			<MentorForm
				existingProfile={existingProfile}
				onCancel={existingProfile ? () => setIsEditing(false) : undefined}
			/>
		</div>
	);
}
