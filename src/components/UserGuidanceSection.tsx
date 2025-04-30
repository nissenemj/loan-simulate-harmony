import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mail, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

const UserGuidanceSection: React.FC = () => {
	const { language } = useLanguage();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isMobile = useIsMobile();

	// Extract user email for greeting, with fallback
	const userEmail = user?.email || "";
	const userName = userEmail ? userEmail.split("@")[0] : "Guest";

	// Define the guidance items with fallback text in case translations aren't working
	const guidanceItems = [
		{
			title: language === "fi" ? "Blogi" : "Blog",
			description:
				language === "fi"
					? "Tutustu velkavelhon uusimpiin vinkkeihin ja oppaisiin"
					: "Explore velkavelho's latest tips and guides for financial freedom",
			icon: BookOpen,
			action: () => {
				try {
					navigate("/blog");
				} catch (error) {
					console.error("Navigation error:", error);
					toast({
						title: "Navigation error",
						description: "Couldn't navigate to Blog. Please try again.",
						variant: "destructive",
					});
				}
			},
		},
		{
			title: language === "fi" ? "Hallinnoi blogia" : "Manage blog",
			description:
				language === "fi"
					? "Lisää ja hallinnoi blogiartikkeleita"
					: "Add and manage blog articles",
			icon: PenSquare,
			action: () => {
				try {
					navigate("/blog-admin");
				} catch (error) {
					console.error("Navigation error:", error);
					toast({
						title: "Navigation error",
						description: "Couldn't navigate to Blog Admin. Please try again.",
						variant: "destructive",
					});
				}
			},
		},
		{
			title: language === "fi" ? "Tuki" : "Support",
			description:
				language === "fi"
					? "Tarvitsetko apua? Ota yhteyttä tukeen"
					: "Need help? Contact our support team",
			icon: Mail,
			action: () => {
				try {
					navigate("/contact");
				} catch (error) {
					console.error("Navigation error:", error);
					toast({
						title: "Navigation error",
						description: "Couldn't navigate to Contact page. Please try again.",
						variant: "destructive",
					});
				}
			},
		},
	];

	if (!user) {
		return null; // Don't render if no user is logged in
	}

	return (
		<div className="py-8 px-4 md:py-16">
			<div className="container max-w-5xl mx-auto">
				<div className="text-center mb-8">
					<h2 className="text-2xl md:text-3xl font-bold mb-4">
						{language === "fi" ? "Tervetuloa" : "Welcome"}, {userName}!
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						{language === "fi"
							? "Näin käytät sivustoamme ja saat eniten irti palveluistamme."
							: "Here's how to use our site and get the most out of our services."}
					</p>
				</div>

				<div
					className={`grid grid-cols-1 ${
						isMobile ? "gap-4" : "md:grid-cols-3 gap-6"
					}`}
				>
					{guidanceItems.map((item, index) => (
						<Card
							key={index}
							className="transition-all hover:shadow-md cursor-pointer"
							onClick={item.action}
						>
							<CardHeader className="flex flex-row items-center gap-4 pb-2">
								<div className="bg-primary/10 p-2 rounded-full">
									<item.icon className="h-6 w-6 text-primary" />
								</div>
								<CardTitle>{item.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">{item.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserGuidanceSection;
