import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const navigate = useNavigate();
	const { t } = useLanguage();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		console.log("Attempting login with email:", email);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			toast({
				title: t("auth.loginSuccess"),
				description: t("auth.welcomeBack"),
			});

			// Check if there's an intended path stored
			const intendedPath = sessionStorage.getItem("intendedPath");
			if (intendedPath) {
				sessionStorage.removeItem("intendedPath");
				navigate(intendedPath);
			} else {
				navigate("/");
			}
		} catch (error: any) {
			console.error("Login error:", error);
			toast({
				title: t("auth.loginError"),
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;

			toast({
				title: t("auth.signupSuccess"),
				description: t("auth.checkEmail"),
			});
		} catch (error: any) {
			toast({
				title: t("auth.signupError"),
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto flex items-center justify-center min-h-[80vh]">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">{t("auth.welcome")}</CardTitle>
					<CardDescription>{t("auth.description")}</CardDescription>
				</CardHeader>

				<Tabs defaultValue="login" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
						<TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
					</TabsList>

					<TabsContent value="login">
						<form onSubmit={handleLogin}>
							<CardContent className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="email" className="flex items-center">
										<Mail className="h-4 w-4 mr-2" />
										{t("auth.email")}
									</Label>
									<Input
										id="email"
										type="email"
										placeholder={t("auth.emailPlaceholder")}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="border rounded-md"
										aria-label={t("auth.email")}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" className="flex items-center">
										<Lock className="h-4 w-4 mr-2" />
										{t("auth.password")}
									</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="border rounded-md"
										aria-label={t("auth.password")}
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? t("auth.loggingIn") : t("auth.login")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</form>
					</TabsContent>

					<TabsContent value="signup">
						<form onSubmit={handleSignup}>
							<CardContent className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="signup-email" className="flex items-center">
										<Mail className="h-4 w-4 mr-2" />
										{t("auth.email")}
									</Label>
									<Input
										id="signup-email"
										type="email"
										placeholder={t("auth.emailPlaceholder")}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="border rounded-md"
										aria-label={t("auth.email")}
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="signup-password"
										className="flex items-center"
									>
										<Lock className="h-4 w-4 mr-2" />
										{t("auth.password")}
									</Label>
									<Input
										id="signup-password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="border rounded-md"
										aria-label={t("auth.password")}
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? t("auth.signingUp") : t("auth.signUp")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</form>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
};

export default Auth;
