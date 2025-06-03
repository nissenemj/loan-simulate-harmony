
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	HelpCircle,
	BookOpen,
	Calculator,
	MessageCircle,
	ExternalLink,
	Lightbulb,
	PlayCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const HelpWidget: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const getContextualHelp = () => {
		const path = location.pathname;
		
		if (path.includes("/calculator")) {
			return [
				{
					icon: <Calculator className="h-4 w-4" />,
					label: "Laskurin opas",
					action: () => {
						// TODO: Implement calculator tutorial
						console.log("Calculator tutorial");
					},
				},
				{
					icon: <PlayCircle className="h-4 w-4" />,
					label: "Katso demo",
					action: () => {
						// TODO: Implement demo video
						console.log("Demo video");
					},
				},
			];
		}
		
		if (path.includes("/dashboard")) {
			return [
				{
					icon: <Lightbulb className="h-4 w-4" />,
					label: "Hallintapaneelin vinkit",
					action: () => {
						// TODO: Implement dashboard tips
						console.log("Dashboard tips");
					},
				},
			];
		}
		
		return [];
	};

	const contextualHelp = getContextualHelp();

	return (
		<div className="fixed bottom-6 right-6 z-50">
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						size="lg"
						className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200"
						aria-label="Ohjekeskus"
					>
						<HelpCircle className="h-6 w-6" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent 
					align="end" 
					className="w-64 mb-2"
					side="top"
				>
					<DropdownMenuLabel className="text-center">
						Ohjekeskus
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					
					{contextualHelp.length > 0 && (
						<>
							{contextualHelp.map((item, index) => (
								<DropdownMenuItem
									key={index}
									onClick={item.action}
									className="flex items-center gap-2 cursor-pointer"
								>
									{item.icon}
									{item.label}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
						</>
					)}
					
					<DropdownMenuItem
						onClick={() => {
							navigate("/blog");
							setIsOpen(false);
						}}
						className="flex items-center gap-2 cursor-pointer"
					>
						<BookOpen className="h-4 w-4" />
						Lue oppaat
					</DropdownMenuItem>
					
					<DropdownMenuItem
						onClick={() => {
							navigate("/contact");
							setIsOpen(false);
						}}
						className="flex items-center gap-2 cursor-pointer"
					>
						<MessageCircle className="h-4 w-4" />
						Ota yhteyttä tukeen
					</DropdownMenuItem>
					
					<DropdownMenuItem
						onClick={() => {
							window.open("https://velkavapaus.fi/faq", "_blank");
							setIsOpen(false);
						}}
						className="flex items-center gap-2 cursor-pointer"
					>
						<ExternalLink className="h-4 w-4" />
						Usein kysytyt kysymykset
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default HelpWidget;
