
import React from "react";
import BlogPostCard from "./BlogPostCard";

interface BlogPost {
	id: string;
	title: string;
	content: string;
	created_at: string;
	author: string;
	category: string;
	image_url?: string;
}

interface BlogPostListProps {
	posts: BlogPost[];
	formatDate: (dateString: string) => string;
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts, formatDate }) => {
	console.log("BlogPostList rendered with", posts.length, "posts");

	if (posts.length === 0) {
		return (
			<p className="text-left py-8 text-muted-foreground">
				Ei blogiartikkeleita.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
			{posts.map((post) => (
				<BlogPostCard key={post.id} post={post} formatDate={formatDate} />
			))}
		</div>
	);
};

export default BlogPostList;
