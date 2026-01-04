
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import NewsletterSignup from "@/components/NewsletterSignup";
import { supabase } from "@/integrations/supabase/client";
import CategoryTabs from "@/components/blog/CategoryTabs";
import BlogPostList from "@/components/blog/BlogPostList";
import AdminLink from "@/components/blog/AdminLink";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BlogPost {
	id: string;
	title: string;
	content: string;
	created_at: string;
	author: string;
	category: string;
	image_url?: string;
}

const Blog = () => {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				console.log("Fetching blog posts...");
				const { data, error } = await supabase
					.from("blog_posts")
					.select("*")
					.order("created_at", { ascending: false });

				if (error) {
					console.error("Error fetching posts:", error);
					setPosts([]);
				} else {
					console.log("Fetched posts:", data);
					setPosts(data || []);
					const uniqueCategories = Array.from(
						new Set(data?.map((post: BlogPost) => post.category) || [])
					);
					setCategories(uniqueCategories);
				}
			} catch (err) {
				console.error("Unexpected error:", err);
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	const filteredPosts =
		selectedCategory === "all"
			? posts
			: posts.filter((post) => post.category === selectedCategory);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("fi-FI", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	return (
		<>
			<Helmet>
				<title>Blogi | Velkavapaus.fi</title>
				<meta name="description" content="Lue talousvinkkejä ja neuvoja velanhoitoon" />
				<meta
					name="keywords"
					content="velanhoito, budjetointi, taloudenhallinta, velkavapaus, blogi"
				/>
				<link rel="canonical" href="https://velkavapaus.fi/blog" />
			</Helmet>

			<main className="container max-w-5xl mx-auto py-6 md:py-8 px-4 md:px-6">
				<div className="mb-8">
					<h1 className="text-3xl md:text-4xl font-bold mb-4">
						Blogi
					</h1>
					<p className="text-muted-foreground text-lg">Talousvinkkejä ja neuvoja velanhoitoon</p>
				</div>

				<AdminLink />

			<div className="mb-8">
				<CategoryTabs
					categories={categories}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
				/>
			</div>

				{loading ? (
					<Card className="w-full p-8">
						<CardContent className="flex flex-col items-center justify-center pt-6">
							<Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
							<p className="mt-4 text-center text-muted-foreground">
								Ladataan blogiartikkeleita...
							</p>
						</CardContent>
					</Card>
				) : (
					<>
						{filteredPosts.length > 0 ? (
							<BlogPostList posts={filteredPosts} formatDate={formatDate} />
						) : (
							<Card className="w-full p-8">
								<CardContent className="pt-6 text-center">
									<p className="text-muted-foreground">
										Ei artikkeleita tässä kategoriassa.
									</p>
								</CardContent>
							</Card>
						)}
					</>
				)}

			<div className="mb-12">
				<NewsletterSignup />
			</div>
		</main>
		</>
	);
};

export default Blog;
