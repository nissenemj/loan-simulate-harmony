
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
				title: "Kirjautuminen onnistui",
				description: "Tervetuloa takaisin!",
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
				title: "Kirjautumisvirhe",
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
				title: "Rekisteröityminen onnistui",
				description: "Tarkista sähköpostisi vahvistaaksesi tilisi.",
			});
		} catch (error: any) {
			toast({
				title: "Rekisteröitymisvirhe",
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
					<CardTitle className="text-2xl">Tervetuloa</CardTitle>
					<CardDescription>Kirjaudu sisään tai luo uusi tili</CardDescription>
				</CardHeader>

				<Tabs defaultValue="login" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">Kirjaudu</TabsTrigger>
						<TabsTrigger value="signup">Rekisteröidy</TabsTrigger>
					</TabsList>

					<TabsContent value="login">
						<form onSubmit={handleLogin}>
							<CardContent className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="email" className="flex items-center">
										<Mail className="h-4 w-4 mr-2" />
										Sähköposti
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="nimi@esimerkki.fi"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="border rounded-md"
										aria-label="Sähköposti"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" className="flex items-center">
										<Lock className="h-4 w-4 mr-2" />
										Salasana
									</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="border rounded-md"
										aria-label="Salasana"
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Kirjaudutaan..." : "Kirjaudu"}
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
										Sähköposti
									</Label>
									<Input
										id="signup-email"
										type="email"
										placeholder="nimi@esimerkki.fi"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="border rounded-md"
										aria-label="Sähköposti"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="signup-password"
										className="flex items-center"
									>
										<Lock className="h-4 w-4 mr-2" />
										Salasana
									</Label>
									<Input
										id="signup-password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="border rounded-md"
										aria-label="Salasana"
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Rekisteröidään..." : "Rekisteröidy"}
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
