import React, { useState, useEffect } from "react";
import { listFiles } from "@/utils/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
	File,
	FileArchive,
	FileText,
	FileImage,
	FileAudio,
	FileVideo,
	FileCode,
	Copy,
	Download,
	ExternalLink,
	Loader2,
} from "lucide-react";

// Helper to format file size
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get appropriate icon based on file type
const getFileIcon = (contentType: string | undefined): React.ReactNode => {
	if (!contentType) return <File className="h-5 w-5" />;

	if (contentType.startsWith("image/"))
		return <FileImage className="h-5 w-5" />;
	if (contentType.startsWith("audio/"))
		return <FileAudio className="h-5 w-5" />;
	if (contentType.startsWith("video/"))
		return <FileVideo className="h-5 w-5" />;
	if (contentType.startsWith("text/")) return <FileText className="h-5 w-5" />;
	if (contentType.includes("application/pdf"))
		return <FileText className="h-5 w-5" />;
	if (
		contentType.includes("application/json") ||
		contentType.includes("application/xml")
	)
		return <FileCode className="h-5 w-5" />;
	if (contentType.includes("zip") || contentType.includes("compressed"))
		return <FileArchive className="h-5 w-5" />;

	return <File className="h-5 w-5" />;
};

interface FileItem {
	name: string;
	url: string;
	path: string;
	size?: number;
	contentType?: string;
}

interface FileViewerProps {
	folder?: string;
	title?: string;
	description?: string;
	className?: string;
	maxHeight?: string;
	showSearch?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({
	folder = "files",
	title = "Files",
	description,
	className = "",
	maxHeight = "400px",
	showSearch = true,
}) => {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchFiles();
	}, [folder]);

	const fetchFiles = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const filesList = await listFiles(folder);
			setFiles(filesList.sort((a, b) => a.name.localeCompare(b.name)));
		} catch (err) {
			console.error("Error fetching files:", err);
			setError("Failed to load files");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopyLink = (url: string) => {
		navigator.clipboard
			.writeText(url)
			.then(() => toast.success("Link copied to clipboard"))
			.catch(() => toast.error("Failed to copy link"));
	};

	const filteredFiles = files.filter((file) =>
		file.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</CardHeader>
			<CardContent>
				{showSearch && (
					<div className="mb-4">
						<Input
							placeholder="Search files..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full"
						/>
					</div>
				)}

				<div
					className="overflow-auto rounded-md border"
					style={{ maxHeight: maxHeight || "400px" }}
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>File</TableHead>
								<TableHead>Size</TableHead>
								<TableHead className="w-[120px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center py-8">
										<Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
										<p>Loading files...</p>
									</TableCell>
								</TableRow>
							) : error ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center py-8 text-muted-foreground"
									>
										<p>{error}</p>
									</TableCell>
								</TableRow>
							) : filteredFiles.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center py-8 text-muted-foreground"
									>
										<p>No files found</p>
									</TableCell>
								</TableRow>
							) : (
								filteredFiles.map((file) => (
									<TableRow key={file.path}>
										<TableCell>
											<div className="flex items-center space-x-2">
												{getFileIcon(file.contentType)}
												<span className="font-medium truncate max-w-[120px] sm:max-w-[200px] block">
													{file.name}
												</span>
											</div>
										</TableCell>
										<TableCell>
											{file.size ? formatFileSize(file.size) : "Unknown"}
										</TableCell>
										<TableCell>
											<div className="flex space-x-1 justify-end sm:justify-start">
												<Button
													size="icon"
													variant="ghost"
													onClick={() => handleCopyLink(file.url)}
													title="Copy link"
												>
													<Copy className="h-4 w-4" />
												</Button>
												<a
													href={file.url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center justify-center size-10 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-accent"
													title="Open in new tab"
												>
													<ExternalLink className="h-4 w-4" />
												</a>
												<a
													href={file.url}
													download={file.name}
													className="inline-flex items-center justify-center size-10 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-accent"
													title="Download"
												>
													<Download className="h-4 w-4" />
												</a>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default FileViewer;
