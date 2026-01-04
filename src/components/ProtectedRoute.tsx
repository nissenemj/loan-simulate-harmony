import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { user, loading: isLoading } = useAuth();
	const location = useLocation();

	useEffect(() => {
		// Store the current path if user is not authenticated
		if (!user && !isLoading) {
			sessionStorage.setItem("intendedPath", location.pathname);
		}
	}, [user, isLoading, location]);

	if (isLoading) {
		return (
			<div className="container mx-auto py-8 flex justify-center">
				Loading...
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/auth" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
