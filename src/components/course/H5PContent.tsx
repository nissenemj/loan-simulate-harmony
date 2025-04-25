import React, { useEffect } from "react";
import Iframe from "react-iframe";

interface H5PContentProps {
	contentId?: string | number;
	embedUrl?: string;
	height?: string;
	title?: string;
	className?: string;
}

const H5PContent: React.FC<H5PContentProps> = ({
	contentId,
	embedUrl,
	height = "400px",
	title = "H5P Content",
	className = "",
}) => {
	// Use the provided embedUrl or construct one from contentId
	const h5pUrl =
		embedUrl || (contentId ? `https://h5p.org/h5p/embed/${contentId}` : "");

	// Load the H5P Resizer script, which dynamically adjusts iframe height
	useEffect(() => {
		const script = document.createElement("script");
		script.src =
			"https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js";

		// If embedUrl is provided from velkavapausfi.h5p.com, use that domain's resizer
		if (embedUrl && embedUrl.includes("velkavapausfi.h5p.com")) {
			script.src = "https://velkavapausfi.h5p.com/js/h5p-resizer.js";
		}

		script.async = true;

		document.body.appendChild(script);

		return () => {
			// Clean up script when component unmounts
			if (document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, [embedUrl]);

	if (!h5pUrl) {
		return <div>Missing H5P content URL</div>;
	}

	return (
		<div
			className={`h5p-container w-full rounded-lg overflow-hidden shadow-md my-6 p-2 sm:p-4 md:p-6 ${className}`}
		>
			<div className="relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
				<Iframe
					url={h5pUrl}
					width="100%"
					height="100%"
					id={`h5p-iframe-${contentId || "embed"}`}
					className="h5p-iframe rounded-md border border-gray-200 absolute top-0 left-0 w-full h-full"
					display="block"
					position="relative"
					allowFullScreen
					title={title}
				/>
			</div>
		</div>
	);
};

export default H5PContent;
