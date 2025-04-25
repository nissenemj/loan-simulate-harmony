import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface BreadcrumbNavProps {
	className?: string;
}

export default function BreadcrumbNav({ className }: BreadcrumbNavProps) {
	const location = useLocation();
	const { t } = useLanguage();

	const pathSegments = location.pathname.split("/").filter(Boolean);
	if (pathSegments.length === 0) return null;

	const translatePathSegment = (segment: string) => {
		// Map kebab-case route segments to their translation keys
		const routeToTranslationMap: Record<string, string> = {
			"debt-summary": "navigation.debtSummary",
			"debt-strategies": "navigation.debtStrategies",
			"loans": "navigation.loans",
			"credit-cards": "navigation.creditCards",
			"dashboard": "navigation.dashboard",
			"about": "navigation.about",
			"settings": "navigation.settings",
			"profile": "navigation.profile"
		};

		// If we have a direct mapping, use it
		if (routeToTranslationMap[segment]) {
			return t(routeToTranslationMap[segment]);
		}

		// Otherwise, convert kebab-case segments to camelCase for translation lookup
		const normalizedSegment = segment.replace(/-./g, x => x[1].toUpperCase());
		const key = `navigation.${normalizedSegment}`;
		return t(key);
	};

	return (
		<Breadcrumb className={cn("mb-4", className)}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">{t("navigation.home")}</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.map((segment, index) => (
					<BreadcrumbItem key={segment}>
						<BreadcrumbSeparator>
							<ChevronRight className="h-4 w-4" />
						</BreadcrumbSeparator>
						{index === pathSegments.length - 1 ? (
							<BreadcrumbPage>{translatePathSegment(segment)}</BreadcrumbPage>
						) : (
							<BreadcrumbLink
								href={`/${pathSegments.slice(0, index + 1).join("/")}`}
							>
								{translatePathSegment(segment)}
							</BreadcrumbLink>
						)}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
