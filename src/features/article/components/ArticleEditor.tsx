import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Heading1,
	Heading2,
	Italic,
	List,
	ListOrdered,
	Quote,
	Redo,
	Undo,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ArticleEditorProps {
	content?: string;
	onChange: (content: string) => void;
	onBlur?: () => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
	if (!editor) return null;

	return (
		<div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={
					editor.isActive("bold")
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<Bold className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={
					editor.isActive("italic")
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<Italic className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={
					editor.isActive("heading", { level: 1 })
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<Heading1 className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={
					editor.isActive("heading", { level: 2 })
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<Heading2 className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={
					editor.isActive("bulletList")
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<List className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={
					editor.isActive("orderedList")
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<ListOrdered className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={
					editor.isActive("blockquote")
						? "bg-primary/15 text-primary dark:bg-primary/25"
						: ""
				}
				type="button"
			>
				<Quote className="h-4 w-4" />
			</Button>
			<div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().undo().run()}
				type="button"
			>
				<Undo className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => editor.chain().focus().redo().run()}
				type="button"
			>
				<Redo className="h-4 w-4" />
			</Button>
		</div>
	);
};

export function ArticleEditor({
	content,
	onChange,
	onBlur,
}: ArticleEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				link: false,
			}),
			Placeholder.configure({
				placeholder: "Start writing your article masterpiece...",
			}),
			Link.configure({
				openOnClick: false,
			}),
		],
		content: content || "",
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		onBlur: () => {
			onBlur?.();
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-zinc dark:prose-invert max-w-none min-h-[400px] p-6 focus:outline-none",
			},
		},
	});

	useEffect(() => {
		if (editor && content !== undefined && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	return (
		<div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950/20 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}
