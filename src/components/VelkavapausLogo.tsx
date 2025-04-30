import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface VelkavapausLogoProps {
	className?: string;
	showText?: boolean;
	size?: "sm" | "md" | "lg";
	asLink?: boolean;
}

const VelkavapausLogo: React.FC<VelkavapausLogoProps> = ({
	className,
	showText = true,
	size = "md",
	asLink = true,
}) => {
	const sizeClasses = {
		sm: "h-8 w-16",
		md: "h-12 w-24",
		lg: "h-16 w-32",
	};

	const logoContent = (
		<div className={cn("velkavapaus-logo flex items-center", className)}>
			<div
				className={cn(
					"velkavapaus-logo-symbol overflow-hidden",
					sizeClasses[size]
				)}
			>
				<svg
					viewBox="0 0 120 80"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-full"
					aria-label="Velkavapaus logo"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Triangle outlines */}
					<path
						d="M60 5 L10 75 L110 75 Z"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
						className="text-primary"
					/>
					<path
						d="M40 30 L60 60 L80 30 Z"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
						className="text-primary"
					/>
					{/* Line at the bottom */}
					<line
						x1="10"
						y1="78"
						x2="110"
						y2="78"
						stroke="currentColor"
						strokeWidth="2"
						className="text-primary"
					/>
				</svg>
			</div>

			{showText && (
				<div className="flex items-center">
					<div className="h-6 w-px bg-gray-300 mx-2" />
					<span className="text-lg font-medium">velkavapaus.fi</span>
				</div>
			)}
		</div>
	);

	if (asLink) {
		return (
			<Link to="/" className="hover:opacity-90 transition-opacity">
				{logoContent}
			</Link>
		);
	}

	return logoContent;
};

export default VelkavapausLogo;
