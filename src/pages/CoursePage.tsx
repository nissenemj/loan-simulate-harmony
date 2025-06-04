
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import H5PContent from "@/components/course/H5PContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

// Default module data structure
interface ModuleData {
	title: string;
	description: string;
	intro: string;
	contentId?: string;
	embedUrl?: string;
	height?: string;
}

interface CourseData {
	modules: {
		module1: ModuleData;
		module2: ModuleData;
		module3: ModuleData;
	};
}

const CoursePage: React.FC = () => {
	const { user } = useAuth();
	const [selectedTab, setSelectedTab] = useState("module1");

	// Default data from translations
	const defaultData: CourseData = {
		modules: {
			module1: {
				title: "Budjetoinnin perusteet",
				description: "Opi budjetoinnin perusteet ja hallitse talouttasi paremmin",
				intro: "Tässä moduulissa opit budjetoinnin perusteet ja miten hallita talouttasi tehokkaasti.",
				contentId: "",
				embedUrl:
					"https://velkavapausfi.h5p.com/content/1292556501858479547/embed",
				height: "637px",
			},
			module2: {
				title: "Velanhallinta",
				description: "Strategioita velkojen hallintaan ja takaisinmaksuun",
				intro: "Opi erilaisia strategioita velkojen hallintaan ja tehokkaaseen takaisinmaksuun.",
				contentId: "43",
				embedUrl: "",
				height: "500px",
			},
			module3: {
				title: "Säästäminen ja sijoittaminen",
				description: "Opas säästämiseen ja vastuulliseen sijoittamiseen",
				intro: "Tutustu säästämisen ja sijoittamisen perusteisiin turvallisesti.",
				contentId: "44",
				embedUrl: "",
				height: "500px",
			},
		},
	};

	// Get stored course data or use defaults
	const [courseData] = useLocalStorage<CourseData>("course-data", defaultData);

	const handleTabChange = (value: string) => {
		setSelectedTab(value);
	};

	// Check if user is admin
	const ADMIN_EMAIL = "nissenemj@gmail.com";
	const isAdmin = user?.email === ADMIN_EMAIL;

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<Helmet>
				<title>Talouskurssi | Velkavapaus</title>
				<meta name="description" content="Ilmainen talouskurssi velanhallintaan ja budjetointiin" />
			</Helmet>

			<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold mb-4">
						Talouskurssi
					</h1>
					<p className="text-lg">Ilmainen talouskurssi velanhallintaan ja budjetointiin</p>
				</div>
				
				{isAdmin && (
					<div className="mt-4 md:mt-0">
						<Link to="/courses/admin">
							<Button variant="outline" size="sm" className="flex items-center gap-2">
								<PenSquare className="h-4 w-4" />
								Hallinnoi kurssia
							</Button>
						</Link>
					</div>
				)}
			</div>

			<Alert className="mb-8">
				<Info className="h-4 w-4" />
				<AlertTitle>Käyttöohjeet</AlertTitle>
				<AlertDescription>Valitse yllä olevista välilehdistä haluamasi moduuli. Jokainen moduuli sisältää interaktiivisia harjoituksia ja oppimateriaalia.</AlertDescription>
			</Alert>

			<Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-8">
				<TabsList className="w-full md:w-auto flex flex-col sm:flex-row h-auto p-1 mb-8">
					<TabsTrigger
						value="module1"
						className="h-12 sm:h-10 text-base sm:text-sm px-6 py-2 mb-2 sm:mb-0"
					>
						{courseData.modules.module1.title}
					</TabsTrigger>
					<TabsTrigger
						value="module2"
						className="h-12 sm:h-10 text-base sm:text-sm px-6 py-2 mb-2 sm:mb-0"
					>
						{courseData.modules.module2.title}
					</TabsTrigger>
					<TabsTrigger
						value="module3"
						className="h-12 sm:h-10 text-base sm:text-sm px-6 py-2"
					>
						{courseData.modules.module3.title}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="module1">
					<Card>
						<CardHeader>
							<CardTitle>{courseData.modules.module1.title}</CardTitle>
							<CardDescription>
								{courseData.modules.module1.description}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">{courseData.modules.module1.intro}</p>

							<div className="h5p-container w-full rounded-lg overflow-hidden shadow-md my-6 p-2 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-800">
								<div
									className="relative w-full h-0"
									style={{ paddingBottom: "56.25%" }}
								>
									<iframe
										src={courseData.modules.module1.embedUrl}
										aria-label={courseData.modules.module1.title}
										width="100%"
										height="100%"
										frameBorder="0"
										allowFullScreen
										allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
										title={courseData.modules.module1.title}
										className="rounded-md border border-gray-200 absolute top-0 left-0 w-full h-full"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="module2">
					<Card>
						<CardHeader>
							<CardTitle>{courseData.modules.module2.title}</CardTitle>
							<CardDescription>
								{courseData.modules.module2.description}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">{courseData.modules.module2.intro}</p>

							<H5PContent
								contentId={courseData.modules.module2.contentId}
								embedUrl={courseData.modules.module2.embedUrl}
								height={courseData.modules.module2.height}
								title={courseData.modules.module2.title}
								className="p-6 bg-gray-50 dark:bg-gray-800"
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="module3">
					<Card>
						<CardHeader>
							<CardTitle>{courseData.modules.module3.title}</CardTitle>
							<CardDescription>
								{courseData.modules.module3.description}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">{courseData.modules.module3.intro}</p>

							<H5PContent
								contentId={courseData.modules.module3.contentId}
								embedUrl={courseData.modules.module3.embedUrl}
								height={courseData.modules.module3.height}
								title={courseData.modules.module3.title}
								className="p-6 bg-gray-50 dark:bg-gray-800"
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<div className="bg-muted p-4 sm:p-6 rounded-lg mt-8">
				<h2 className="text-xl md:text-2xl font-semibold mb-4">
					Jatko-oppiminen
				</h2>
				<p className="mb-4">Kun olet suorittanut kurssin, voit jatkaa oppimistasi näillä lisäresursseilla ja työkaluilla.</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
					{/* Add some related resources or links here */}
				</div>
			</div>
		</div>
	);
};

export default CoursePage;
