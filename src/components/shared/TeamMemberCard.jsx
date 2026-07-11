import { Linkedin } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function TeamMemberCard({ member, index = 0 }) {
  return (
    <ScrollReveal delay={index * 0.06}>
      <div className="rounded-2xl p-6 text-center bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-accent/30 transition-all duration-300">
        <img
          src={member.photo}
          alt={`${member.name}, ${member.role}`}
          loading="lazy"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-2 ring-slate-200"
        />
        <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
        <p className="text-sm text-indigo-accent mb-3">{member.role}</p>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{member.bio}</p>
        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} LinkedIn`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-accent transition-colors border border-slate-200"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
      </div>
    </ScrollReveal>
  );
}