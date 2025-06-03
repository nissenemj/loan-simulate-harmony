
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChevronDown,
	ChevronUp,
	Calendar,
	DollarSign,
	CreditCard,
	TrendingUp,
	Info,
} from "lucide-react";

interface ResultsGuideProps {
	className?: string;
}

const ResultsGuide: React.FC<ResultsGuideProps> = ({ className }) => {
	const [isOpen, setIsOpen] = useState(false);

	const guideItems = [
		{
			icon: <Calendar className="h-5 w-5 text-primary" />,
			title: "Takaisinmaksuaika",
			description: "Kuinka kauan kestää päästä veloista eroon",
		},
		{
			icon: <DollarSign className="h-5 w-5 text-primary" />,
			title: "Korot yhteensä",
			description: "Kuinka paljon maksat korkoja kaiken kaikkiaan",
		},
		{
			icon: <CreditCard className="h-5 w-5 text-primary" />,
			title: "Maksettu yhteensä",
			description: "Kokonaissumma pääoma + korot",
		},
		{
			icon: <TrendingUp className="h-5 w-5 text-primary" />,
			title: "Kuukausimaksu yhteensä",
			description: "Paljonko maksat kuukaudessa yhteensä",
		},
	];

	return (
		<Card className={className}>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Info className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">
									Miten lukea tuloksia
								</CardTitle>
							</div>
							<Button variant="ghost" size="sm">
								{isOpen ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						</div>
						<CardDescription>
							Opas tulosten tulkitsemiseen
						</CardDescription>
					</CardHeader>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CardContent className="pt-0">
						<div className="space-y-4">
							{guideItems.map((item, index) => (
								<div
									key={index}
									className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
								>
									<div className="flex-shrink-0 mt-0.5">{item.icon}</div>
									<div className="space-y-1">
										<h4 className="font-medium text-sm">{item.title}</h4>
										<p className="text-sm text-muted-foreground">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>
						
						<div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
							<h4 className="font-medium text-sm text-primary mb-2">
								Hyödyllisiä vinkkejä
							</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									Pidä kiinni maksuaikataulusta säännöllisesti
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									Pienetkin lisämaksut voivat säästää merkittävästi korkokuluissa
								</li>
							</ul>
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
};

export default ResultsGuide;
