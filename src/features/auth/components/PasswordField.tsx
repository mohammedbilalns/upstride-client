import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import FieldError from "@/components/common/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface PasswordFieldProps {
	id: string;
	label: ReactNode;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	placeholder?: string;
	autoComplete?: string;
	error?: string;
	labelAction?: ReactNode;
	disabled?: boolean;
}

export function PasswordField({
	id,
	label,
	value,
	onChange,
	onBlur,
	placeholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
	autoComplete = "current-password",
	error,
	labelAction,
	disabled,
}: PasswordFieldProps) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center">
				<Label htmlFor={id}>{label}</Label>
				{labelAction}
			</div>
			<div className="relative">
				<Input
					id={id}
					type={isVisible ? "text" : "password"}
					placeholder={placeholder}
					autoComplete={autoComplete}
					value={value}
					onBlur={onBlur}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
				/>
				<button
					type="button"
					tabIndex={-1}
					disabled={disabled}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
					onClick={() => setIsVisible((visible) => !visible)}
				>
					{isVisible ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</button>
			</div>
			<FieldError message={error} />
		</div>
	);
}
