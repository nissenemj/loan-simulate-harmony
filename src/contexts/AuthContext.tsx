import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	logout: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		// Set up auth state listener first
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);

			// Only redirect on initial sign in, not on session refresh
			if (event === "SIGNED_IN" && !user) {
				// Check if the user was trying to access a specific page
				const intendedPath = sessionStorage.getItem("intendedPath");
				if (intendedPath) {
					sessionStorage.removeItem("intendedPath");
					navigate(intendedPath);
				} else {
					navigate("/dashboard");
				}
			}
		});

		// Then check for existing session
		const getInitialSession = async () => {
			try {
				const { data } = await supabase.auth.getSession();
				setSession(data.session);
				setUser(data.session?.user ?? null);
			} catch (error) {
				console.error("Error getting session:", error);
			} finally {
				setIsLoading(false);
			}
		};

		getInitialSession();

		return () => {
			subscription.unsubscribe();
		};
	}, [navigate]);

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			navigate("/");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	// Adding the logout method as an alias to signOut for compatibility
	const logout = signOut;

	return (
		<AuthContext.Provider value={{ user, session, isLoading, signOut, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
