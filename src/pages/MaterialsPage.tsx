
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FileMetadata, listSharedMaterials } from "@/utils/supabaseStorage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download, Loader2, FolderOpen, Calculator, BookOpen, FileCheck, PiggyBank } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Material metadata with descriptions and categories
const materialMetadata: Record<string, { description: string; category: string }> = {
    "Velkavapaus_Budjetointipohja": {
        description: "Kattava Excel-pohja kuukausibudjetin laatimiseen. Sisältää valmiit kategoriat tuloille ja menoille.",
        category: "budjetointi"
    },
    "Velkavapaus_Master_Paketti": {
        description: "Kaikki tarvittavat työkalut yhdessä paketissa: budjettipohja, velkaseuranta ja säästösuunnitelma.",
        category: "budjetointi"
    },
    "Velkavapaus_Kuukausittainen_Seurantalomake": {
        description: "Tulostettava lomake kuukausittaisten menojen ja tulojen seurantaan.",
        category: "seuranta"
    },
    "Velkavapaus_Takaisinmaksusuunnitelma": {
        description: "Suunnittele velkojen takaisinmaksu järjestelmällisesti. Sisältää lumipallo- ja vyöry-menetelmät.",
        category: "velat"
    },
    "Velkavapaus_Mallikirjeet_Premium": {
        description: "Valmiit kirjepohjat velkojille: maksusuunnitelma-, neuvottelu- ja vahvistuskirjeet.",
        category: "velat"
    },
    "Velkavapaus_Talouden_Terveystarkastus": {
        description: "Arvioi taloutesi nykytila ja tunnista kehityskohteet tällä kattavalla tarkistuslistalla.",
        category: "seuranta"
    },
    "Velkavapaus_Talouspsykologian_Opas": {
        description: "Ymmärrä rahakäyttäytymistäsi ja opi tekemään parempia taloudellisia päätöksiä.",
        category: "oppaat"
    },
    "Velkavapaus_Taloustermien_Sanasto": {
        description: "Selkokielinen sanasto yleisimmistä talous- ja lainatermeistä.",
        category: "oppaat"
    },
    "Velkavapaus_Vararahaston_Suunnittelulomake": {
        description: "Laske sopiva vararahaston koko ja suunnittele säästäminen askel askeleelta.",
        category: "saastaminen"
    }
};

const categories = [
    { id: "kaikki", label: "Kaikki", icon: FolderOpen },
    { id: "budjetointi", label: "Budjetointi", icon: Calculator },
    { id: "velat", label: "Velanhallinta", icon: FileCheck },
    { id: "saastaminen", label: "Säästäminen", icon: PiggyBank },
    { id: "seuranta", label: "Seuranta", icon: FileText },
    { id: "oppaat", label: "Oppaat", icon: BookOpen }
];

const MaterialsPage: React.FC = () => {
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("kaikki");

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await listSharedMaterials();
                setFiles(data);
            } catch (err) {
                console.error("Error fetching materials:", err);
                setError("Materiaalit eivät ole tällä hetkellä saatavilla. Yritä myöhemmin uudelleen.");
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    const getIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
            return <FileSpreadsheet className="h-10 w-10 text-green-600" />;
        }
        if (ext === 'pdf') {
            return <FileText className="h-10 w-10 text-red-500" />;
        }
        return <FileText className="h-10 w-10 text-blue-500" />;
    };

    const getBaseFileName = (name: string) => {
        // Remove extension and version numbers
        return name.replace(/\.[^/.]+$/, "").replace(/_v\d+$/, "").replace(/_Toimiva$/, "").replace(/_Premium$/, "");
    };

    const formatName = (name: string) => {
        const baseName = getBaseFileName(name);
        // Replace underscores and hyphens with spaces
        let formatted = baseName.replace(/[_-]/g, " ");
        // Add space before capital letters (camelCase/PascalCase separation)
        formatted = formatted.replace(/([a-zäöå])([A-ZÄÖÅ])/g, "$1 $2");
        // Remove "Velkavapaus" prefix
        formatted = formatted.replace(/^Velkavapaus\s*/i, "");
        return formatted;
    };

    const getMaterialMeta = (name: string) => {
        const baseName = getBaseFileName(name);
        return materialMetadata[baseName] || { 
            description: "Hyödyllinen työkalu taloutesi hallintaan.", 
            category: "muut" 
        };
    };

    const getCategoryLabel = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.label || categoryId;
    };

    const getCategoryColor = (categoryId: string) => {
        switch (categoryId) {
            case "budjetointi": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "velat": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            case "saastaminen": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "seuranta": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "oppaat": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const filteredFiles = selectedCategory === "kaikki" 
        ? files 
        : files.filter(file => getMaterialMeta(file.name).category === selectedCategory);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Helmet>
                <title>Materiaalipankki | Velkavapaus.fi</title>
                <meta name="description" content="Lataa ilmaisia työkaluja, budjettipohjia ja oppaita taloutesi hallintaan." />
            </Helmet>

            <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Materiaalipankki</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Ilmaiset työkalut ja oppaat matkallesi kohti velkavapautta. Lataa ja ota käyttöön heti.
                </p>
            </div>

            {/* Category tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-center">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <TabsTrigger 
                                key={category.id} 
                                value={category.id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {category.label}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Ladataan materiaaleja...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg max-w-2xl mx-auto">
                    <p>{error}</p>
                </div>
            ) : filteredFiles.length === 0 ? (
                <Card className="max-w-md mx-auto text-center py-12">
                    <CardContent className="flex flex-col items-center gap-4">
                        <FolderOpen className="h-16 w-16 text-muted-foreground/50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Ei materiaaleja</h3>
                            <p className="text-muted-foreground">
                                {selectedCategory === "kaikki" 
                                    ? "Materiaalipankki on tällä hetkellä tyhjä. Tarkista pian uudelleen!"
                                    : `Tässä kategoriassa ei ole vielä materiaaleja.`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredFiles.map((file) => {
                        const meta = getMaterialMeta(file.name);
                        return (
                            <Card key={file.path} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-muted p-3 rounded-lg shrink-0">
                                            {getIcon(file.name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Badge className={`mb-2 ${getCategoryColor(meta.category)}`}>
                                                {getCategoryLabel(meta.category)}
                                            </Badge>
                                            <CardTitle className="text-lg leading-tight break-words">
                                                {formatName(file.name)}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow pt-2">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {meta.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        {file.name.split('.').pop()?.toUpperCase()}
                                        {file.size ? ` • ${(file.size / 1024).toFixed(0)} KB` : ''}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button className="w-full" asChild>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                                            <Download className="mr-2 h-4 w-4" />
                                            Lataa tiedosto
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Separator className="my-12" />

            <div className="max-w-3xl mx-auto">
                <NewsletterSignup />
            </div>
        </div>
    );
};

export default MaterialsPage;
