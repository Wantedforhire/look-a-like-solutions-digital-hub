import { Linkedin } from "lucide-react";
import ScrollReveal from "@/components/ui-custom/ScrollReveal";

export default function TeamMemberCard({ member, index = 0 }) {
  return (
    <ScrollReveal delay={index * 0.06}>
      <div className="glass-cell rounded-2xl p-6 text-center hover:border-indigo-accent/50 transition-colors duration-300">
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-2 ring-white/10"
        />
        <h3 className="text-base font-bold text-pearl">{member.name}</h3>
        <p className="text-sm text-indigo-accent mb-3">{member.role}</p>
        <p className="text-xs text-slate-sub leading-relaxed mb-4">{member.bio}</p>
        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} LinkedIn`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-indigo-accent/20 text-slate-sub hover:text-indigo-accent transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
      </div>
    </ScrollReveal>
  );
}