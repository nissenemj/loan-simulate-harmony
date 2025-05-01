import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shield, Trash2 } from "lucide-react";

const Settings = () => {
	const { t } = useLanguage();
	const { user, signOut } = useAuth();
	const navigate = useNavigate();

	// Password change state
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [updatingPassword, setUpdatingPassword] = useState(false);

	// Account deletion state
	const [deletePassword, setDeletePassword] = useState("");
	const [deletingAccount, setDeletingAccount] = useState(false);

	// Handle password change
	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate passwords
		if (newPassword !== confirmNewPassword) {
			toast.error(t("settings.passwordMismatch"));
			return;
		}

		setUpdatingPassword(true);

		try {
			// First verify the current password by attempting to sign in
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: user?.email || "",
				password: currentPassword,
			});

			if (signInError) {
				throw new Error("Current password is incorrect");
			}

			// Update the password
			const { error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) throw error;

			// Clear form and show success message
			setCurrentPassword("");
			setNewPassword("");
			setConfirmNewPassword("");
			toast.success(t("settings.passwordUpdated"));
		} catch (error: any) {
			console.error("Error updating password:", error);
			toast.error(error.message || t("settings.passwordUpdateFailed"));
		} finally {
			setUpdatingPassword(false);
		}
	};

	// Handle account deletion
	const handleDeleteAccount = async () => {
		setDeletingAccount(true);

		try {
			// First verify the password by attempting to sign in
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: user?.email || "",
				password: deletePassword,
			});

			if (signInError) {
				throw new Error("Password is incorrect");
			}

			// Delete the user (using signOut and then deleting the account)
			const { error } = await supabase.rpc("delete_user");

			if (error) throw error;

			// Sign out and redirect to home page
			await signOut();
			toast.success(t("settings.accountDeleted"));
			navigate("/");
		} catch (error: any) {
			console.error("Error deleting account:", error);
			toast.error(error.message || t("settings.accountDeleteFailed"));
		} finally {
			setDeletingAccount(false);
			setDeletePassword("");
		}
	};

	return (
		<div className="container max-w-4xl mx-auto py-8 px-4">
			<Helmet>
				<title>{t("settings.title")} | Velkavapaus.fi</title>
			</Helmet>

			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{t("settings.title")}
					</h1>
					<p className="text-muted-foreground">{t("settings.description")}</p>
				</div>

				<Separator />

				<div className="space-y-8">
					{/* Account Section */}
					<div>
						<h2 className="text-xl font-semibold mb-2">
							{t("settings.accountSection")}
						</h2>
						<p className="text-muted-foreground mb-4">
							{t("settings.accountDescription")}
						</p>

						{/* Change Password Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Shield className="mr-2 h-5 w-5 text-primary" />
									{t("settings.changePassword")}
								</CardTitle>
								<CardDescription>
									{t("settings.changePasswordDescription")}
								</CardDescription>
							</CardHeader>
							<form onSubmit={handlePasswordChange}>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="current-password">
											{t("settings.currentPassword")}
										</Label>
										<Input
											id="current-password"
											type="password"
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="new-password">
											{t("settings.newPassword")}
										</Label>
										<Input
											id="new-password"
											type="password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="confirm-password">
											{t("settings.confirmNewPassword")}
										</Label>
										<Input
											id="confirm-password"
											type="password"
											value={confirmNewPassword}
											onChange={(e) => setConfirmNewPassword(e.target.value)}
											required
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button type="submit" disabled={updatingPassword}>
										{updatingPassword
											? t("settings.updating")
											: t("settings.updatePassword")}
									</Button>
								</CardFooter>
							</form>
						</Card>

						{/* Delete Account Card */}
						<Card className="mt-6 border-destructive/20">
							<CardHeader>
								<CardTitle className="flex items-center text-destructive">
									<Trash2 className="mr-2 h-5 w-5" />
									{t("settings.deleteAccount")}
								</CardTitle>
								<CardDescription>
									{t("settings.deleteAccountDescription")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-4">
									{t("settings.deleteAccountWarning")}
								</p>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive">
											{t("settings.deleteAccountButton")}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												{t("settings.confirmDeleteTitle")}
											</AlertDialogTitle>
											<AlertDialogDescription>
												{t("settings.confirmDeleteDescription")}
											</AlertDialogDescription>
										</AlertDialogHeader>
										<div className="space-y-2 py-4">
											<Label htmlFor="delete-password">
												{t("settings.enterPasswordToDelete")}
											</Label>
											<Input
												id="delete-password"
												type="password"
												value={deletePassword}
												onChange={(e) => setDeletePassword(e.target.value)}
												required
											/>
										</div>
										<AlertDialogFooter>
											<AlertDialogCancel>
												{t("settings.cancelDelete")}
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleDeleteAccount}
												disabled={deletingAccount || !deletePassword}
												className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											>
												{deletingAccount
													? t("settings.deleting")
													: t("settings.confirmDelete")}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
