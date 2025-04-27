
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User } from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactMarkdown from "react-markdown";

interface BlogPost {
	id: string;
	title: string;
	content: string;
	created_at: string;
	author: string;
	category: string;
	image_url?: string;
}

interface BlogPostCardProps {
	post: BlogPost;
	formatDate: (dateString: string) => string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, formatDate }) => {
	const { t } = useLanguage();
	const isMobile = useIsMobile();

	const getExcerpt = (content: string, maxLength: number = 200) => {
		// Strip any Markdown heading syntax (# headers)
		let cleanedContent = content.replace(/^#+\s+.+$/gm, '');
		
		// Remove meta description suggestions
		cleanedContent = cleanedContent.replace(/\(Meta-kuvaus ehdotus:.*?\)/g, '');
		
		// Split by paragraphs and take the first substantive one
		const paragraphs = cleanedContent.split("\n\n").filter(p => p.trim().length > 0);
		let firstParagraph = paragraphs[0] || '';
		
		// Ensure we don't return any raw "Markdown" text that might be leftover
		if (firstParagraph.trim().toLowerCase() === "markdown") {
			firstParagraph = paragraphs[1] || '';
		}
		
		if (firstParagraph.length <= maxLength) return firstParagraph;
		return firstParagraph.substring(0, maxLength) + "...";
	};

	const getImageUrl = (url?: string) => {
		if (!url) return "/placeholder.svg";
		return url;
	};

	const handleImageError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>
	) => {
		(e.target as HTMLImageElement).src = "/placeholder.svg";
	};

	return (
		<Card className="h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
			{post.image_url && (
				<div
					className={`relative ${isMobile ? "h-32" : "h-48"} overflow-hidden`}
				>
					<img
						src={getImageUrl(post.image_url)}
						alt={post.title}
						className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
						onError={handleImageError}
						loading="lazy"
					/>
					<div className="absolute top-0 right-0 p-2">
						<Badge variant="secondary" className="text-xs font-normal">
							{post.category}
						</Badge>
					</div>
				</div>
			)}

			<CardHeader className={`pb-2 ${isMobile ? "p-3" : ""} text-left`}>
				<div className="flex items-center text-xs text-muted-foreground space-x-3 mb-2">
					<div className="flex items-center">
						<User className="h-3 w-3 mr-1" />
						<span>{post.author}</span>
					</div>
					<div className="flex items-center">
						<Calendar className="h-3 w-3 mr-1" />
						<span>{formatDate(post.created_at)}</span>
					</div>
				</div>
				<Link to={`/blog/${post.id}`} className="hover:underline">
					<h3
						className={`font-bold ${
							isMobile ? "text-base" : "text-lg"
						} leading-tight`}
					>
						{post.title}
					</h3>
				</Link>
			</CardHeader>

			<CardContent
				className={`pb-4 flex-grow ${isMobile ? "p-3 pt-0" : ""} text-left`}
			>
				<div className="text-muted-foreground text-sm prose prose-sm dark:prose-invert">
					<ReactMarkdown
						components={{
							p: ({ children }) => <p className="my-1">{children}</p>,
							a: ({ href, children }) => (
								<a href={href} className="text-primary hover:underline">
									{children}
								</a>
							),
							ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
							ol: ({ children }) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
							li: ({ children }) => <li className="ml-2">{children}</li>,
							strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
							em: ({ children }) => <em className="italic">{children}</em>,
							code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded">{children}</code>,
						}}
					>
						{getExcerpt(post.content, isMobile ? 100 : 200)}
					</ReactMarkdown>
				</div>
			</CardContent>

			<CardFooter className={`pt-0 ${isMobile ? "p-3" : ""} justify-start`}>
				<Link to={`/blog/${post.id}`}>
					<Button variant="outline" size={isMobile ? "sm" : "default"}>
						{t("blog.readMore")}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default BlogPostCard;
