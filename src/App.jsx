import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import GtmInjector from './components/GtmInjector';
import SiteLayout from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import CaseStudies from '@/pages/CaseStudies';
import CaseStudyDetail from '@/pages/CaseStudyDetail';
import Industries from '@/pages/Industries';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import Contact from '@/pages/Contact';
import GrowthAudit from '@/pages/GrowthAudit';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import WorkWithUs from '@/pages/WorkWithUs';
import Resources from '@/pages/Resources';
import Insights from '@/pages/Insights';
import InsightDetail from '@/pages/InsightDetail';
import StrategyCall from '@/pages/StrategyCall';
import Gallery from '@/pages/Gallery';
import Methodology from '@/pages/Methodology';
import Careers from '@/pages/Careers';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import PagesManagement from '@/pages/admin/PagesManagement';
import BlogManagement from '@/pages/admin/BlogManagement';
import BlogEditor from '@/pages/admin/BlogEditor';
import CaseStudyManagement from '@/pages/admin/CaseStudyManagement';
import CaseStudyEditor from '@/pages/admin/CaseStudyEditor';
import ServiceManagement from '@/pages/admin/ServiceManagement';
import ServiceEditor from '@/pages/admin/ServiceEditor';
import IndustryManagement from '@/pages/admin/IndustryManagement';
import LeadManagement from '@/pages/admin/LeadManagement';
import TalentManagement from '@/pages/admin/TalentManagement';
import TestimonialManagement from '@/pages/admin/TestimonialManagement';
import TeamManagement from '@/pages/admin/TeamManagement';
import MediaLibrary from '@/pages/admin/MediaLibrary';
import SeoSettings from '@/pages/admin/SeoSettings';
import NavigationSettings from '@/pages/admin/NavigationSettings';
import AdminSettings from '@/pages/admin/AdminSettings';
import ResourceManagement from '@/pages/admin/ResourceManagement';
import InsightManagement from '@/pages/admin/InsightManagement';
import InsightEditor from '@/pages/admin/InsightEditor';
import StrategyCallManagement from '@/pages/admin/StrategyCallManagement';
import GalleryManagement from '@/pages/admin/GalleryManagement';
import CareerManagement from '@/pages/admin/CareerManagement';
import NewsletterManagement from '@/pages/admin/NewsletterManagement';
import RolesManagement from '@/pages/admin/RolesManagement';
import MethodologyManagement from '@/pages/admin/MethodologyManagement';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/growth-audit" element={<GrowthAudit />} />
        <Route path="/strategy-call" element={<StrategyCall />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<InsightDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/work-with-us" element={<WorkWithUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes — separate from public SiteLayout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/pages" element={<PagesManagement />} />
          <Route path="/admin/blog" element={<BlogManagement />} />
          <Route path="/admin/insights" element={<InsightManagement />} />
          <Route path="/admin/insights/new" element={<InsightEditor />} />
          <Route path="/admin/insights/edit/:id" element={<InsightEditor />} />
          <Route path="/admin/resources" element={<ResourceManagement />} />
          <Route path="/admin/gallery" element={<GalleryManagement />} />
          <Route path="/admin/blog/new" element={<BlogEditor />} />
          <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
          <Route path="/admin/case-studies" element={<CaseStudyManagement />} />
          <Route path="/admin/case-studies/new" element={<CaseStudyEditor />} />
          <Route path="/admin/case-studies/edit/:id" element={<CaseStudyEditor />} />
          <Route path="/admin/services" element={<ServiceManagement />} />
          <Route path="/admin/services/new" element={<ServiceEditor />} />
          <Route path="/admin/services/edit/:id" element={<ServiceEditor />} />
          <Route path="/admin/industries" element={<IndustryManagement />} />
          <Route path="/admin/leads" element={<LeadManagement />} />
          <Route path="/admin/strategy-calls" element={<StrategyCallManagement />} />
          <Route path="/admin/newsletter" element={<NewsletterManagement />} />
          <Route path="/admin/talent" element={<TalentManagement />} />
          <Route path="/admin/careers" element={<CareerManagement />} />
          <Route path="/admin/testimonials" element={<TestimonialManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/methodology" element={<MethodologyManagement />} />
          <Route path="/admin/media" element={<MediaLibrary />} />
          <Route path="/admin/seo" element={<SeoSettings />} />
          <Route path="/admin/navigation" element={<NavigationSettings />} />
          <Route path="/admin/roles" element={<RolesManagement />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <GtmInjector />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App