import { useLocation } from "react-router-dom";
import MetaTags from "@/components/seo/MetaTags";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function NotFound() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <MetaTags title="Page Not Found" description="The page you're looking for could not be found." path={location.pathname} />
      <div className="text-center max-w-md">
        <p className="text-7xl font-extrabold text-indigo-accent/40 mb-4">404</p>
        <h1 className="text-2xl font-bold text-pearl mb-3">Page Not Found</h1>
        <p className="text-slate-sub mb-8">The page you're looking for doesn't exist or may have moved. Let's get you back on track.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton to="/" variant="primary">Back to Home</CTAButton>
          <CTAButton to="/services" variant="secondary">View Services</CTAButton>
        </div>
      </div>
    </div>
  );
}