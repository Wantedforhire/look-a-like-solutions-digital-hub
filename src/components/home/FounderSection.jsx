import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";
import EyebrowLabel from "@/components/ui-custom/EyebrowLabel";
import CTAButton from "@/components/ui-custom/CTAButton";

export default function FounderSection() {
  const { data: team = [] } = useQuery({
    queryKey: ["team", "founder"],
    queryFn: () => base44.entities.TeamMember.list("order")
  });
  const ramkumar = team.find((m) => m.name && m.name.toLowerCase().includes("ramkumar"));
  const founderPhoto = ramkumar?.photo || "https://media.base44.com/images/public/6a45332a796cb5a887717912/b5f87c02a_WhatsAppImage2025-10-30at112027_e9d09851.jpg";
  const tags = ramkumar?.specialisms?.length ?
  ramkumar.specialisms :
  ["Google Ads", "Meta Ads", "SEO", "Performance Marketing", "Analytics & Tracking", "AI-Powered Marketing", "Training & Consulting", "Business Growth Strategy"];

  return null;











































}