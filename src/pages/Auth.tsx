import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get('redirect') || '/dashboard';

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			navigate(redirect);
		} catch (error: any) {
			toast({
				title: "Kirjautuminen epäonnistui",
				description: error.message === "Invalid login credentials"
					? "Virheellinen sähköposti tai salasana"
					: error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { error, data } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						// Add default profile data here if needed
					}
				}
			});

			if (error) throw error;

			if (data.session) {
				navigate(redirect);
			} else {
				toast({
					title: "Tarkista sähköpostisi",
					description: "Lähetimme sinulle vahvistuslinkin.",
				});
			}

		} catch (error: any) {
			toast({
				title: "Rekisteröinti epäonnistui",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
			<Helmet>
				<title>Kirjaudu | Velkavapaus</title>
			</Helmet>

			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle>Tervetuloa takaisin</CardTitle>
					<CardDescription>
						Kirjaudu sisään tallentaaksesi laskelmasi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="login" className="w-full">
						<TabsList className="grid w-full grid-cols-2 mb-4">
							<TabsTrigger value="login">Kirjaudu</TabsTrigger>
							<TabsTrigger value="register">Rekisteröidy</TabsTrigger>
						</TabsList>

						<TabsContent value="login">
							<form onSubmit={handleLogin} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email-login">Sähköposti</Label>
									<Input
										id="email-login"
										type="email"
										placeholder="matti@esimerkki.fi"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password-login">Salasana</Label>
									<Input
										id="password-login"
										type="password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
									Kirjaudu sisään
								</Button>
							</form>
						</TabsContent>

						<TabsContent value="register">
							<form onSubmit={handleRegister} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email-register">Sähköposti</Label>
									<Input
										id="email-register"
										type="email"
										placeholder="matti@esimerkki.fi"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password-register">Salasana</Label>
									<Input
										id="password-register"
										type="password"
										required
										minLength={6}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
									Luo tili
								</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default Auth;
