import {
  Search, TrendingUp, Share2, Palette, Code2, PenTool, ShieldCheck, Target, Sparkles,
  Building2, Stethoscope, GraduationCap, Home, ShoppingCart, Hotel, Factory, Landmark,
  Store, Briefcase, BarChart3, Megaphone, Mail, Youtube, ClipboardCheck, Users
} from "lucide-react";

const iconMap = {
  Search, TrendingUp, Share2, Palette, Code2, PenTool, ShieldCheck, Target, Sparkles,
  Building2, Stethoscope, GraduationCap, Home, ShoppingCart, Hotel, Factory, Landmark,
  Store, Briefcase, BarChart3, Megaphone, Mail, Youtube, ClipboardCheck, Users
};

export function getIcon(name) {
  return iconMap[name] || TrendingUp;
}