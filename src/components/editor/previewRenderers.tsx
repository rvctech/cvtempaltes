import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export const ExpBlock = ({ exp, primaryColor, secondaryColor, mutedText }: any) => (
  <div>
    <div className="flex justify-between items-baseline mb-0.5">
      <h3 className="font-bold text-sm" style={{ color: primaryColor }}>{exp.role}</h3>
      <span className="text-xs shrink-0 ml-2" style={{ color: mutedText }}>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</span>
    </div>
    <p className="text-sm font-medium mb-0.5" style={{ color: secondaryColor }}>{exp.company}</p>
    {exp.description && <MarkdownRenderer content={exp.description} className="text-sm leading-relaxed" style={{ color: mutedText }} />}
  </div>
);

export const EduBlock = ({ edu, primaryColor, secondaryColor, mutedText }: any) => (
  <div>
    <h3 className="font-bold text-sm" style={{ color: primaryColor }}>{edu.degree}</h3>
    <p className="text-sm" style={{ color: secondaryColor }}>{edu.institution}</p>
    {edu.field && <p className="text-xs" style={{ color: mutedText }}>{edu.field}</p>}
    {(edu.startDate || edu.endDate) && (
      <p className="text-xs" style={{ color: mutedText }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</p>
    )}
  </div>
);

const levelMap: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 4, Expert: 5 };

const SkillIndicator = ({ skill, pd, color, mutedColor }: any) => {
  if (!skill.proficiency) return null;
  if (pd === 'text' || !pd) return <span className="text-xs ml-1" style={{ color: mutedColor }}>({skill.proficiency})</span>;
  const level = levelMap[skill.proficiency] || 1;
  if (pd === 'bars') return (
    <span className="ml-1.5" style={{ fontSize: 9, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ marginRight: 1, color: i <= level ? color : `${mutedColor}30` }}>&#x258C;</span>
      ))}
    </span>
  );
  if (pd === 'circles') return (
    <span className="ml-1.5" style={{ fontSize: 8, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ marginRight: 1, color: i <= level ? color : `${mutedColor}30` }}>{i <= level ? '\u25CF' : '\u25CB'}</span>
      ))}
    </span>
  );
  return (
    <span className="inline-flex gap-0 ml-1.5 align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-xs leading-none" style={{ color: i <= level ? color : `${mutedColor}30` }}>{i <= level ? '★' : '☆'}</span>
      ))}
    </span>
  );
};

const bg = (isDark: boolean) => isDark ? '#0f172a' : '#ffffff';
const hdr = (isDark: boolean) => isDark ? '#1e293b' : '#f8fafc';

const accentDivider = (as: string, ac: string) => {
  switch (as) {
    case 'dots': return `1px dotted ${ac}40`;
    case 'borders': return `2px solid ${ac}50`;
    case 'geometric': return `1px dashed ${ac}50`;
    default: return `1px solid ${ac}30`;
  }
};

const accentBulletChar = (as: string) => {
  switch (as) {
    case 'dots': return '\u2022 ';
    case 'shapes': return '\u25C6 ';
    case 'circles': return '\u25CF ';
    case 'geometric': return '\u25B8 ';
    default: return '';
  }
};

/* ─── Reusable section blocks ─── */

const ProjectBlock = ({ project, pc, sc, mutedText, as }: any) => {
  const bc = accentBulletChar(as);
  return (
    <div className="mb-3">
      <h3 className="font-bold text-sm" style={{ color: pc }}>{project.name}</h3>
      {project.technologies && project.technologies.length > 0 && (
        <p className="text-xs mt-0.5" style={{ color: sc }}>
          {bc}Technologies: {project.technologies.join(' • ')}
        </p>
      )}
      {project.description && (
        <MarkdownRenderer content={project.description} className="text-sm leading-relaxed mt-1" style={{ color: mutedText }} />
      )}
      {project.link && (
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          className="text-xs mt-0.5 inline-block hover:underline"
          style={{ color: sc }}
        >
          {project.link}
        </a>
      )}
    </div>
  );
};

const RefBlock = ({ ref, mutedText }: any) => (
  <div className="mb-2">
    <p className="text-sm font-medium" style={{ color: mutedText }}>{ref.name}</p>
    {ref.role && <p className="text-xs" style={{ color: mutedText }}>{ref.role}{ref.company ? ` — ${ref.company}` : ''}</p>}
    {ref.email && <p className="text-xs" style={{ color: mutedText }}>{ref.email}</p>}
    {ref.phone && <p className="text-xs" style={{ color: mutedText }}>{ref.phone}</p>}
  </div>
);

const GroupedSkills = ({ skills, pd, color, mutedColor, text, bc }: any) => {
  const groups: Record<string, any[]> = {};
  const uncategorized: any[] = [];
  skills.forEach((s: any) => {
    if (s.category) {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    } else {
      uncategorized.push(s);
    }
  });

  return (
    <div className="space-y-2">
      {Object.entries(groups).map(([category, catSkills]) => (
        <div key={category}>
          <p className="text-xs font-semibold mb-0.5" style={{ color }}>{bc}{category}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {catSkills.map((s: any) => (
              <span key={s.id} style={{ color: text }}>{s.name}</span>
            ))}
          </div>
        </div>
      ))}
      {uncategorized.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {uncategorized.map((s: any) => (
            <span key={s.id} style={{ color: text }}>
              {s.name}<SkillIndicator skill={s} pd={pd} color={color} mutedColor={mutedColor} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── 8 ATS-Friendly Professional CV Templates ─── */

/* 1. Executive Classic — Traditional serif, centered header, ruled sections */
const ExecutiveClassicCV = ({ data, pc, sc, ac, hf, bf, text, mutedText, isDark, pd, layout, as }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  const bc = accentBulletChar(as);
  const rule = accentDivider(as, ac);
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm mb-4" style={{ color: sc }}>{personalInfo.title}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      <div className="mx-10 h-px" style={{ backgroundColor: ac }} />
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6 pt-4">
          <div className="flex-1 space-y-1">
            {summary && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-1" style={{ borderLeft: rule, paddingLeft: '2rem' }}>
            {education.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={ac} mutedColor={mutedText} text={text} bc={bc} /></div>}
            {languages.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
            {projects.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
            {references.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id} className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 space-y-1 pt-4">
          {summary && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={ac} mutedColor={mutedText} text={text} bc={bc} /></div>}
          {languages.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
          {projects.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
          {references.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id} className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 2. Modern Minimal — Clean sans-serif, left-aligned, accent underline */
const ModernMinimalCV = ({ data, pc, sc, ac, hf, bf, text, mutedText, isDark, pd, layout, as }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  const bc = accentBulletChar(as);
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <div className="w-12 h-1 mb-3" style={{ backgroundColor: ac }} />
        <p className="text-sm mb-3" style={{ color: sc }}>{personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6">
          <div className="flex-1 space-y-5">
            {summary && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ac }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-5" style={{ borderLeft: accentDivider(as, ac), paddingLeft: '2rem' }}>
            {education.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ac }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={pc} text={text} bc={bc} /></div>}
            {languages.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
            {projects.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
            {references.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 space-y-5">
          {summary && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ac }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: ac }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={pc} text={text} bc={bc} /></div>}
          {languages.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
          {projects.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
          {references.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ac }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 3. Clean Professional — Warm accent, rounded skill tags, professional */
const CreativeProfessionalCV = ({ data, pc, sc, hf, bf, text, mutedText, isDark, pd, layout, as }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  const bc = accentBulletChar(as);
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6" style={{ backgroundColor: hdr(isDark) }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm mb-3" style={{ color: sc }}>{personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6 pt-4">
          <div className="flex-1 space-y-5">
            {summary && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-5" style={{ borderLeft: accentDivider(as, pc), paddingLeft: '2rem' }}>
            {education.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={pc} text={text} bc={bc} /></div>}
            {languages.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
            {projects.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
            {references.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 pt-4 space-y-5">
          {summary && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={pc} text={text} bc={bc} /></div>}
          {languages.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
          {projects.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
          {references.length > 0 && <div><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 4. Corporate Blue — Blue accent, horizontal dividers, professional */
const CorporateBlueCV = ({ data, pc, sc, hf, bf, text, mutedText, isDark, pd, layout, as }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  const bc = accentBulletChar(as);
  const rule = accentDivider(as, pc);
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="h-1" style={{ backgroundColor: pc }} />
      <div className="px-10 pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm mb-3" style={{ color: sc }}>{personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6">
          <div className="flex-1 space-y-1">
            {summary && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-1" style={{ borderLeft: rule, paddingLeft: '2rem' }}>
            {education.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={pc} text={text} bc={bc} /></div>}
            {languages.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
            {projects.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
            {references.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id} className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 space-y-1">
          {summary && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pc }}>{bc}Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={pc} text={text} bc={bc} /></div>}
          {languages.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}</div></div>}
          {projects.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} as={as} />)}</div></div>}
          {references.length > 0 && <div className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id} className="py-3" style={{ borderBottom: rule }}><h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: pc }}>{bc}{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 5. Minimalist White — Ultra-clean, minimal headers, narrow content */
const MinimalistWhiteCV = ({ data, pc, sc, ac, hf, bf, text, mutedText, isDark, pd, layout }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-12 pt-12 pb-6 text-center">
        <h1 className="text-2xl font-light mb-1 tracking-wide" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-xs mb-4 uppercase tracking-wider" style={{ color: sc }}>{personalInfo.title}</p>
        <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: ac }} />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-12 pb-8">
          <div className="flex-1 space-y-4">
            {summary && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-3" style={{ color: ac }}>Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-4" style={{ borderLeft: `1px solid ${ac}30`, paddingLeft: '2rem' }}>
            {education.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-3" style={{ color: ac }}>Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>Skills</h2><GroupedSkills skills={skills} pd={pd} color={ac} mutedColor={mutedText} text={text} bc={''} /></div>}
            {languages.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
            {projects.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} />)}</div></div>}
            {references.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id}><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: ac }}>{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-12 pb-8 max-w-[580px] mx-auto space-y-4">
          {summary && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed text-center" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-3 text-center" style={{ color: ac }}>Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-3 text-center" style={{ color: ac }}>Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>Skills</h2><GroupedSkills skills={skills} pd={pd} color={ac} mutedColor={mutedText} text={text} bc={''} /></div>}
          {languages.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>Languages</h2><div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>Certifications</h2><div className="space-y-1 text-center">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
          {projects.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>Projects</h2><div className="space-y-1 text-center">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} />)}</div></div>}
          {references.length > 0 && <div><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id}><h2 className="text-[10px] font-medium uppercase tracking-widest mb-2 text-center" style={{ color: ac }}>{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm text-center" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 6. Tech Focus — Monospace headings, clean structure, technical */
const TechInnovatorCV = ({ data, pc, sc, hf, bf, text, mutedText, isDark, pd, layout }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  const hBg = isDark ? '#0D1117' : '#f1f5f9';
  const hText = isDark ? '#ffffff' : '#0f172a';
  const hAccent = isDark ? '#58A6FF' : '#2563eb';
  const hMuted = isDark ? '#8B949E' : '#64748b';
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6" style={{ backgroundColor: hBg }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: hText, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm mb-3" style={{ color: hAccent }}>{personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: hMuted }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6 pt-4">
          <div className="flex-1 space-y-5">
            {summary && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div><h2 className="text-xs font-bold mb-3 font-mono" style={{ color: hAccent }}>// Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-5" style={{ borderLeft: `1px solid ${hAccent}30`, paddingLeft: '2rem' }}>
            {education.length > 0 && <div><h2 className="text-xs font-bold mb-3 font-mono" style={{ color: hAccent }}>// Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Skills</h2><GroupedSkills skills={skills} pd={pd} color={hAccent} mutedColor={hAccent} text={text} bc={''} /></div>}
            {languages.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
            {projects.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} />)}</div></div>}
            {references.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// {s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 pt-4 space-y-5">
          {summary && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div><h2 className="text-xs font-bold mb-3 font-mono" style={{ color: hAccent }}>// Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div><h2 className="text-xs font-bold mb-3 font-mono" style={{ color: hAccent }}>// Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Skills</h2><GroupedSkills skills={skills} pd={pd} color={hAccent} mutedColor={hAccent} text={text} bc={''} /></div>}
          {languages.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
          {projects.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} />)}</div></div>}
          {references.length > 0 && <div><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-bold mb-2 font-mono" style={{ color: hAccent }}>// {s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 7. Elegant Serif — Warm cream bg, serif throughout, refined */
const ElegantSerifCV = ({ data, pc, hf, bf, text, mutedText, isDark, pd, layout }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: isDark ? '#0f172a' : '#FDF8F4', color: text }}>
      <div className="px-10 pt-10 pb-6 text-center" style={{ borderBottom: `2px solid ${pc}` }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm italic mb-3" style={{ color: mutedText }}>{personalInfo.title}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6 pt-4">
          <div className="flex-1 space-y-5">
            {summary && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div><h2 className="text-sm font-bold italic mb-3 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={mutedText} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-5" style={{ borderLeft: `1px solid ${pc}20`, paddingLeft: '2rem' }}>
            {education.length > 0 && <div><h2 className="text-sm font-bold italic mb-3 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={mutedText} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={mutedText} text={text} bc={''} /></div>}
            {languages.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
            {projects.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={mutedText} mutedText={mutedText} />)}</div></div>}
            {references.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id}><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 pt-4 space-y-5">
          {summary && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Professional Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div><h2 className="text-sm font-bold italic mb-3 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={mutedText} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div><h2 className="text-sm font-bold italic mb-3 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={mutedText} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Skills</h2><GroupedSkills skills={skills} pd={pd} color={pc} mutedColor={mutedText} text={text} bc={''} /></div>}
          {languages.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
          {projects.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={mutedText} mutedText={mutedText} />)}</div></div>}
          {references.length > 0 && <div><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id}><h2 className="text-sm font-bold italic mb-2 pb-1" style={{ color: pc, fontFamily: hf, borderBottom: `1px solid ${pc}20` }}>{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

/* 8. Bold Statement — Strong contrasts, clean, confident */
const BoldStatementCV = ({ data, pc, sc, ac, hf, bf, text, mutedText, isDark, pd, layout }: any) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, references, customSections } = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6">
        <h1 className="text-4xl font-black mb-1 uppercase tracking-tight" style={{ color: pc, fontFamily: hf }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: sc }}>{personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-wider" style={{ color: mutedText }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      <div className="w-full h-1" style={{ backgroundColor: ac }} />
      {layout === 'two-column' ? (
        <div className="flex gap-8 px-10 pb-6 pt-4">
          <div className="flex-1 space-y-5">
            {summary && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed font-medium" style={{ color: mutedText }} /></div>}
            {experience.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-3 uppercase" style={{ color: ac }}>Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          </div>
          <div className="w-64 shrink-0 space-y-5" style={{ borderLeft: `1px solid ${ac}30`, paddingLeft: '2rem' }}>
            {education.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-3 uppercase" style={{ color: ac }}>Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
            {skills.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Skills</h2><GroupedSkills skills={skills} pd={pd} color={text} mutedColor={mutedText} text={text} bc={ac} /></div>}
            {languages.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1 font-normal" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
            {certifications.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm font-medium" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
            {projects.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} />)}</div></div>}
            {references.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
            {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm font-medium" style={{ color: mutedText }} /></div>)}
          </div>
        </div>
      ) : (
        <div className="px-10 pb-6 pt-4 space-y-5">
          {summary && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Summary</h2><MarkdownRenderer content={summary} className="text-sm leading-relaxed font-medium" style={{ color: mutedText }} /></div>}
          {experience.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-3 uppercase" style={{ color: ac }}>Experience</h2><div className="space-y-4">{experience.map((e: any) => <ExpBlock key={e.id} exp={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {education.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-3 uppercase" style={{ color: ac }}>Education</h2><div className="space-y-3">{education.map((e: any) => <EduBlock key={e.id} edu={e} primaryColor={pc} secondaryColor={sc} mutedText={mutedText} />)}</div></div>}
          {skills.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Skills</h2><GroupedSkills skills={skills} pd={pd} color={text} mutedColor={mutedText} text={text} bc={ac} /></div>}
          {languages.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Languages</h2><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">{languages.map((l: any) => <span key={l.id} style={{ color: text }}>{l.name}<span className="text-xs ml-1 font-normal" style={{ color: mutedText }}>({l.proficiency})</span></span>)}</div></div>}
          {certifications.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Certifications</h2><div className="space-y-1">{certifications.map((c: any) => <p key={c.id} className="text-sm font-medium" style={{ color: mutedText }}>{c.name}</p>)}</div></div>}
          {projects.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>Projects</h2><div className="space-y-1">{projects.map((p: any) => <ProjectBlock key={p.id} project={p} pc={pc} sc={sc} mutedText={mutedText} />)}</div></div>}
          {references.length > 0 && <div><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>References</h2><div className="space-y-2">{references.map((r: any) => <RefBlock key={r.id} ref={r} mutedText={mutedText} />)}</div></div>}
          {customSections.map((s: any) => <div key={s.id}><h2 className="text-xs font-black tracking-widest mb-2 uppercase" style={{ color: ac }}>{s.title}</h2><MarkdownRenderer content={s.content} className="text-sm font-medium" style={{ color: mutedText }} /></div>)}
        </div>
      )}
    </div>
  );
};

export const cvTemplateMap: Record<string, React.FC<any>> = {
  'executive-classic-cv': ExecutiveClassicCV,
  'modern-minimal-cv': ModernMinimalCV,
  'creative-professional-cv': CreativeProfessionalCV,
  'corporate-blue-cv': CorporateBlueCV,
  'minimalist-white-cv': MinimalistWhiteCV,
  'tech-innovator-cv': TechInnovatorCV,
  'elegant-serif-cv': ElegantSerifCV,
  'bold-statement-cv': BoldStatementCV,
};

/* ─── Cover Letter Template renderers ─── */

const ExecutiveClassicCL = ({ data, pc, ac, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <p className="text-sm mb-4" style={{ color: ac }}>{cl.personalInfo.title}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="mx-10 h-px" style={{ backgroundColor: ac }} />
      <div className="px-10 py-8">
        <div className="mb-4 text-sm" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-6 font-medium text-sm" style={{ color: text }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${ac}30` }}>
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold" style={{ color: pc }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const ModernMinimalCL = ({ data, pc, ac, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <div className="w-12 h-1 mb-3" style={{ backgroundColor: ac }} />
        <p className="text-sm mb-3" style={{ color: ac }}>{cl.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="px-10 py-8">
        <div className="mb-4 text-sm" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-5 font-medium" style={{ color: ac }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div>
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold" style={{ color: pc }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const CreativeProfessionalCL = ({ data, pc, ac, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6" style={{ backgroundColor: hdr(isDark) }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <p className="text-sm mb-3" style={{ color: ac }}>{cl.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="px-10 py-8">
        <div className="mb-4 text-sm" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-5 font-medium" style={{ color: pc }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${ac}30` }}>
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold" style={{ color: ac }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const CorporateBlueCL = ({ data, pc, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="h-1" style={{ backgroundColor: pc }} />
      <div className="px-10 pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <p className="text-sm mb-3" style={{ color: mutedText }}>{cl.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="px-10 py-8">
        <div className="mb-4 text-sm" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-5 font-medium text-sm" style={{ color: pc }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div>
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold" style={{ color: pc }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const MinimalistWhiteCL = ({ data, pc, sc, ac, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-12 pt-12 pb-6 text-center">
        <h1 className="text-2xl font-light mb-1 tracking-wide" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <p className="text-xs mb-4 uppercase tracking-wider" style={{ color: sc }}>{cl.personalInfo.title}</p>
        <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: ac }} />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: mutedText }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="px-12 pb-8 max-w-[580px] mx-auto">
        <div className="mb-4 text-sm" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-5 text-sm" style={{ color: sc }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div className="text-center pt-6">
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold" style={{ color: pc }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const TechInnovatorCL = ({ data, ac, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  const hBg = isDark ? '#0D1117' : '#f1f5f9';
  const hText = isDark ? '#ffffff' : '#0f172a';
  const hAccent = isDark ? '#58A6FF' : '#2563eb';
  const hMuted = isDark ? '#8B949E' : '#64748b';
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6" style={{ backgroundColor: hBg }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: hText, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <p className="text-sm mb-3" style={{ color: hAccent }}>{cl.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: hMuted }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="px-10 py-8">
        <div className="mb-4 text-sm" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-5 font-mono text-sm" style={{ color: ac }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div className="pt-6" style={{ borderTop: `1px solid ${ac}30` }}>
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold font-mono" style={{ color: ac }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const ElegantSerifCL = ({ data, pc, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: isDark ? '#0f172a' : '#FDF8F4', color: text }}>
      <div className="px-10 pt-10 pb-6 text-center" style={{ borderBottom: `2px solid ${pc}` }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName} {cl.personalInfo.lastName}</h1>
        <p className="text-sm italic mb-3" style={{ color: mutedText }}>{cl.personalInfo.title}</p>
      </div>
      <div className="px-10 py-8">
        <div className="mb-4 text-sm italic" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-6 font-medium italic" style={{ color: pc }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed" style={{ color: mutedText }} />
          ))}
        </div>
        <div>
          <p className="mb-4 text-sm italic" style={{ color: text }}>{cl.closing}</p>
          <p className="font-bold" style={{ color: pc }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

const BoldStatementCL = ({ data, pc, sc, ac, hf, bf, text, mutedText, isDark }: any) => {
  const cl = data;
  return (
    <div className="shadow-2xl rounded-lg overflow-hidden w-full max-w-[800px]" style={{ fontFamily: bf, backgroundColor: bg(isDark), color: text }}>
      <div className="px-10 pt-10 pb-6">
        <h1 className="text-4xl font-black mb-1 uppercase tracking-tight" style={{ color: pc, fontFamily: hf }}>{cl.personalInfo.firstName}<br />{cl.personalInfo.lastName}</h1>
        <p className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: sc }}>{cl.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-wider" style={{ color: mutedText }}>
          {cl.personalInfo.email && <span>{cl.personalInfo.email}</span>}
          {cl.personalInfo.phone && <span>{cl.personalInfo.phone}</span>}
          {cl.personalInfo.location && <span>{cl.personalInfo.location}</span>}
        </div>
      </div>
      <div className="w-full h-1" style={{ backgroundColor: ac }} />
      <div className="px-10 py-8">
        <div className="mb-4 text-sm font-medium" style={{ color: mutedText }}><p>{cl.date}</p></div>
        <div className="mb-4 text-sm" style={{ color: text }}>
          <p>{cl.recipientName}</p>
          {cl.recipientTitle && <p>{cl.recipientTitle}</p>}
          {cl.company && <p>{cl.company}</p>}
          {cl.address && <p>{cl.address}</p>}
        </div>
        <p className="mb-5 font-bold uppercase tracking-wider text-sm" style={{ color: sc }}>{cl.salutation}</p>
        <div className="space-y-4 mb-8">
          {cl.paragraphs.map((para: any) => (
            <MarkdownRenderer key={para.id} content={para.content} className="text-sm leading-relaxed font-medium" style={{ color: mutedText }} />
          ))}
        </div>
        <div className="pt-6" style={{ borderTop: `2px solid ${ac}` }}>
          <p className="mb-4 text-sm" style={{ color: text }}>{cl.closing}</p>
          <p className="font-black uppercase tracking-wider" style={{ color: pc }}>{cl.signature}</p>
        </div>
      </div>
    </div>
  );
};

export const clTemplateMap: Record<string, React.FC<any>> = {
  'executive-classic-cl': ExecutiveClassicCL,
  'modern-minimal-cl': ModernMinimalCL,
  'creative-professional-cl': CreativeProfessionalCL,
  'corporate-blue-cl': CorporateBlueCL,
  'minimalist-white-cl': MinimalistWhiteCL,
  'tech-innovator-cl': TechInnovatorCL,
  'elegant-serif-cl': ElegantSerifCL,
  'bold-statement-cl': BoldStatementCL,
};
