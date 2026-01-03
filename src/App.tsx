
import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import { HelmetProvider } from "react-helmet-async";
import NavigationHeader from "./components/NavigationHeader";
import Footer from "./components/Footer";
import HelpWidget from "./components/HelpWidget";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import { Suspense, lazy } from "react";

// Lazy-loaded components
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const CourseAdmin = lazy(() => import("./pages/CourseAdmin"));
const FileStoragePage = lazy(() => import("./pages/FileStoragePage"));
const Blog = lazy(() => import("./pages/Blog"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const DebtStrategies = lazy(() => import("./pages/DebtStrategies"));
const DebtSummaryPage = lazy(() => import("./pages/DebtSummaryPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const Settings = lazy(() => import("./pages/Settings"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

// Oppaat (Guides)
const OppaatIndex = lazy(() => import("./pages/oppaat/index"));
const VelkajarjestelyOpas = lazy(() => import("./pages/oppaat/velkajarjestely"));

// Vinkit (Tips)
const VinkitIndex = lazy(() => import("./pages/vinkit/index"));
const BudjetointiVinkit = lazy(() => import("./pages/vinkit/budjetointi"));
const SaastaminenVinkit = lazy(() => import("./pages/vinkit/saastaminen"));
const VelkojenMaksuVinkit = lazy(() => import("./pages/vinkit/velkojen-maksu"));

// Tarinat (Stories)
const TarinatIndex = lazy(() => import("./pages/tarinat/index"));
const MariaTarina = lazy(() => import("./pages/tarinat/maria"));

// Apua (Help)
const ApuaIndex = lazy(() => import("./pages/apua/index"));
const VelkaneuvontaSivu = lazy(() => import("./pages/apua/velkaneuvonta"));
const KriisiapuSivu = lazy(() => import("./pages/apua/kriisiapu"));

function App() {
	return (
		<HelmetProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<Router>
					<AuthProvider>
						<ErrorProvider>
							<div className="flex flex-col min-h-screen">
								<NavigationHeader />
								<main className="flex-grow">
									<Suspense
										fallback={
											<div className="flex items-center justify-center min-h-screen">
												<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
											</div>
										}
									>
										<Routes>
											<Route path="/" element={<LandingPage />} />
											<Route path="/about" element={<AboutPage />} />
											<Route path="/calculator" element={<Index />} />
											<Route path="/blog" element={<Blog />} />
											<Route path="/blog/:postId" element={<BlogPost />} />
											<Route
												path="/blog-admin"
												element={
													<ProtectedRoute>
														<BlogAdmin />
													</ProtectedRoute>
												}
											/>
											<Route
												path="/admin/blog"
												element={<Navigate to="/blog-admin" replace />}
											/>
											<Route path="/courses" element={<CoursePage />} />
											<Route
												path="/courses/admin"
												element={
													<ProtectedRoute>
														<CourseAdmin />
													</ProtectedRoute>
												}
											/>
											<Route
												path="/files"
												element={
													<ProtectedRoute>
														<FileStoragePage />
													</ProtectedRoute>
												}
											/>
											<Route
												path="/dashboard"
												element={
													<ProtectedRoute>
														<Dashboard />
													</ProtectedRoute>
												}
											/>
											<Route path="/auth" element={<Auth />} />
											<Route
												path="/app"
												element={<Navigate to="/dashboard" replace />}
											/>
											<Route
												path="/debt-strategies"
												element={<DebtStrategies />}
											/>
											<Route
												path="/debt-summary"
												element={<DebtSummaryPage />}
											/>
											<Route path="/contact" element={<ContactPage />} />
											<Route path="/faq" element={<FAQPage />} />
											<Route
												path="/settings"
												element={
													<ProtectedRoute>
														<Settings />
													</ProtectedRoute>
												}
											/>
											<Route path="/privacy-policy" element={<PrivacyPolicy />} />
											<Route path="/terms-of-service" element={<TermsOfService />} />
											<Route path="/cookie-policy" element={<CookiePolicy />} />
											{/* Oppaat (Guides) */}
											<Route path="/oppaat" element={<OppaatIndex />} />
											<Route path="/oppaat/velkajarjestely" element={<VelkajarjestelyOpas />} />
											{/* Vinkit (Tips) */}
											<Route path="/vinkit" element={<VinkitIndex />} />
											<Route path="/vinkit/budjetointi" element={<BudjetointiVinkit />} />
											<Route path="/vinkit/saastaminen" element={<SaastaminenVinkit />} />
											<Route path="/vinkit/velkojen-maksu" element={<VelkojenMaksuVinkit />} />
											{/* Tarinat (Stories) */}
											<Route path="/tarinat" element={<TarinatIndex />} />
											<Route path="/tarinat/maria" element={<MariaTarina />} />
											{/* Apua (Help) */}
											<Route path="/apua" element={<ApuaIndex />} />
											<Route path="/apua/velkaneuvonta" element={<VelkaneuvontaSivu />} />
											<Route path="/apua/kriisiapu" element={<KriisiapuSivu />} />
										</Routes>
									</Suspense>
								</main>
								<Footer />
								<HelpWidget />
								<Toaster />
							</div>
						</ErrorProvider>
					</AuthProvider>
				</Router>
			</ThemeProvider>
		</HelmetProvider>
	);
}

export default App;
