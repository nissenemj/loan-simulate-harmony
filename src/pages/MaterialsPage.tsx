
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FileMetadata, listSharedMaterials } from "@/utils/supabaseStorage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download, Loader2, FolderOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NewsletterSignup from "@/components/NewsletterSignup";

const MaterialsPage: React.FC = () => {
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const formatName = (name: string) => {
        // Remove extension
        const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
        // Replace underscores and hyphens with spaces
        let formatted = nameWithoutExt.replace(/[_-]/g, " ");
        // Add space before capital letters (camelCase/PascalCase separation)
        formatted = formatted.replace(/([a-zäöå])([A-ZÄÖÅ])/g, "$1 $2");
        return formatted;
    };

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

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Ladataan materiaaleja...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg max-w-2xl mx-auto">
                    <p>{error}</p>
                </div>
            ) : files.length === 0 ? (
                <Card className="max-w-md mx-auto text-center py-12">
                    <CardContent className="flex flex-col items-center gap-4">
                        <FolderOpen className="h-16 w-16 text-muted-foreground/50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Ei materiaaleja</h3>
                            <p className="text-muted-foreground">
                                Materiaalipankki on tällä hetkellä tyhjä. Tarkista pian uudelleen!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {files.map((file) => (
                        <Card key={file.path} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    {getIcon(file.name)}
                                </div>
                                <div>
                                    <CardTitle className="text-lg leading-tight mb-1">
                                        {formatName(file.name)}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Tyyppi: {file.name.split('.').pop()?.toUpperCase()}
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
                    ))}
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
