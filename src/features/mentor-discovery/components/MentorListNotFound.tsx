import { Link } from "@tanstack/react-router";
import { BookmarkX } from "lucide-react";

export function MentorListNotFound() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
			<div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 p-10 text-center shadow-sm">
				<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
					<BookmarkX className="h-8 w-8 text-zinc-500" />
				</div>
				<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
					List not found
				</h1>
				<p className="mt-3 text-zinc-500">
					The mentor list you are looking for does not exist or has been
					removed.
				</p>
				<div className="mt-8">
					<Link
						to="/profile/bookmarked-mentors"
						className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
					>
						Back to My Lists
					</Link>
				</div>
			</div>
		</div>
	);
}
