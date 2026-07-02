import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, ChevronDown, ChevronUp, User, FileText, Briefcase, GraduationCap, Wrench, Languages, FolderOpen, Award, BookOpen } from 'lucide-react';
import { cvTemplateMap } from './previewRenderers';

export const Editor = () => {
  return (
    <div className="flex h-full">
      <div className="w-96 bg-white dark:bg-[#0b1120] border-r border-gray-200 dark:border-gray-800/60 flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-800/60">
          <h2 className="font-semibold text-xs text-gray-900 dark:text-gray-100">Edit Document</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <CVEditor />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-gray-50/50 dark:bg-gray-900/30">
        <DocumentPreview />
      </div>
    </div>
  );
};

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700/60 overflow-hidden">
      <button
        className="w-full px-3.5 py-2.5 text-left font-medium text-xs flex items-center gap-2 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <span className="flex-1 text-gray-700 dark:text-gray-300">{title}</span>
        {isOpen ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
      </button>
      {isOpen && <div className="p-3.5 space-y-2.5">{children}</div>}
    </div>
  );
};

const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    placeholder={placeholder}
  />
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
    rows={rows}
    placeholder={placeholder}
  />
);

const CVEditor = () => {
  const { cvData, updatePersonalInfo, updateSummary } = useStore();
  const pi = cvData.personalInfo;

  return (
    <>
      <CollapsibleSection title="Personal Information" icon={User} defaultOpen>
        <Input value={pi.firstName} onChange={(v) => updatePersonalInfo({ firstName: v })} placeholder="First Name" />
        <Input value={pi.lastName} onChange={(v) => updatePersonalInfo({ lastName: v })} placeholder="Last Name" />
        <Input value={pi.title} onChange={(v) => updatePersonalInfo({ title: v })} placeholder="Job Title" />
        <Input value={pi.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="Email" type="email" />
        <Input value={pi.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="Phone" type="tel" />
        <Input value={pi.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="Location" />
        <Input value={pi.website || ''} onChange={(v) => updatePersonalInfo({ website: v })} placeholder="Website" />
        <Input value={pi.linkedin || ''} onChange={(v) => updatePersonalInfo({ linkedin: v })} placeholder="LinkedIn" />
      </CollapsibleSection>

      <CollapsibleSection title="Professional Summary" icon={FileText}>
        <TextArea
          value={cvData.summary}
          onChange={(v) => updateSummary(v)}
          placeholder="Write a brief professional summary..."
          rows={4}
        />
      </CollapsibleSection>

      <ExperienceEditor />
      <EducationEditor />
      <SkillsEditor />
      <CertificationsEditor />
      <LanguagesEditor />
      <ProjectsEditor />
      <CustomSectionsEditor />
    </>
  );
};

const ExperienceEditor = () => {
  const { cvData, addExperience, updateExperience, removeExperience } = useStore();
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');

  const handleAdd = () => {
    if (!newRole.trim()) return;
    addExperience({
      id: `exp-${Date.now()}`,
      company: newCompany,
      role: newRole,
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setNewRole('');
    setNewCompany('');
  };

  return (
    <CollapsibleSection title="Work Experience" icon={Briefcase}>
      <div className="space-y-2.5">
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 truncate">{exp.role || 'New Position'}</span>
              <button onClick={() => removeExperience(exp.id)} className="text-gray-400 hover:text-red-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Input value={exp.role} onChange={(v) => updateExperience(exp.id, { role: v })} placeholder="Role" />
            <Input value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="Company" />
            <div className="flex gap-2">
              <Input value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="Start" />
              <Input value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} placeholder="End" />
            </div>
            <TextArea
              value={exp.description}
              onChange={(v) => updateExperience(exp.id, { description: v })}
              placeholder="Describe responsibilities and achievements..."
              rows={3}
            />
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newRole} onChange={setNewRole} placeholder="Role" />
          <Input value={newCompany} onChange={setNewCompany} placeholder="Company" />
          <button
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const EducationEditor = () => {
  const { cvData, addEducation, updateEducation, removeEducation } = useStore();
  const [newInstitution, setNewInstitution] = useState('');
  const [newDegree, setNewDegree] = useState('');

  const handleAdd = () => {
    if (!newInstitution.trim() || !newDegree.trim()) return;
    addEducation({
      id: `edu-${Date.now()}`,
      institution: newInstitution,
      degree: newDegree,
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    });
    setNewInstitution('');
    setNewDegree('');
  };

  return (
    <CollapsibleSection title="Education" icon={GraduationCap}>
      <div className="space-y-2.5">
        {cvData.education.map((edu) => (
          <div key={edu.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-green-600 dark:text-green-400 truncate">{edu.degree || 'New Education'}</span>
              <button onClick={() => removeEducation(edu.id)} className="text-gray-400 hover:text-red-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Input value={edu.institution} onChange={(v) => updateEducation(edu.id, { institution: v })} placeholder="Institution" />
            <Input value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} placeholder="Degree" />
            <Input value={edu.field} onChange={(v) => updateEducation(edu.id, { field: v })} placeholder="Field of Study" />
            <div className="flex gap-2">
              <Input value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} placeholder="Start" />
              <Input value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} placeholder="End" />
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newInstitution} onChange={setNewInstitution} placeholder="Institution" />
          <Input value={newDegree} onChange={setNewDegree} placeholder="Degree" />
          <button
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const SkillsEditor = () => {
  const { cvData, addSkill, updateSkill, removeSkill } = useStore();
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    addSkill({ id: `skill-${Date.now()}`, name: newSkill, proficiency: 'Intermediate' });
    setNewSkill('');
  };

  return (
    <CollapsibleSection title="Skills" icon={Wrench}>
      <div className="space-y-2">
        {cvData.skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2">
            <Input value={skill.name} onChange={(v) => updateSkill(skill.id, { name: v })} placeholder="Skill" />
            <select
              value={skill.proficiency}
              onChange={(e) => updateSkill(skill.id, { proficiency: e.target.value as any })}
              className="px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-md text-gray-900 dark:text-gray-100 w-28"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button onClick={() => removeSkill(skill.id)} className="text-gray-400 hover:text-red-500 p-1 shrink-0">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newSkill} onChange={setNewSkill} placeholder="New skill" />
          <button onClick={handleAdd} className="px-2.5 py-1.5 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const CertificationsEditor = () => {
  const { cvData, addCertification, updateCertification, removeCertification } = useStore();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCertification({ id: `cert-${Date.now()}`, name: newName, issuer: '', date: '' });
    setNewName('');
  };

  return (
    <CollapsibleSection title="Certifications" icon={Award}>
      <div className="space-y-2">
        {cvData.certifications.map((cert) => (
          <div key={cert.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-yellow-600 dark:text-yellow-400 truncate">{cert.name || 'New Certification'}</span>
              <button onClick={() => removeCertification(cert.id)} className="text-gray-400 hover:text-red-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Input value={cert.name} onChange={(v) => updateCertification(cert.id, { name: v })} placeholder="Certification name" />
            <Input value={cert.issuer} onChange={(v) => updateCertification(cert.id, { issuer: v })} placeholder="Issuer" />
            <Input value={cert.date} onChange={(v) => updateCertification(cert.id, { date: v })} placeholder="Date" />
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newName} onChange={setNewName} placeholder="New certification" />
          <button onClick={handleAdd} className="px-2.5 py-1.5 bg-yellow-600 text-white rounded-md text-xs hover:bg-yellow-700 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const LanguagesEditor = () => {
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useStore();
  const [newLang, setNewLang] = useState('');

  const handleAdd = () => {
    if (!newLang.trim()) return;
    addLanguage({ id: `lang-${Date.now()}`, name: newLang, proficiency: 'Conversational' });
    setNewLang('');
  };

  return (
    <CollapsibleSection title="Languages" icon={Languages}>
      <div className="space-y-2">
        {cvData.languages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-2">
            <Input value={lang.name} onChange={(v) => updateLanguage(lang.id, { name: v })} placeholder="Language" />
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as any })}
              className="px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-md text-gray-900 dark:text-gray-100 w-28"
            >
              <option value="Basic">Basic</option>
              <option value="Conversational">Conversational</option>
              <option value="Fluent">Fluent</option>
              <option value="Native">Native</option>
            </select>
            <button onClick={() => removeLanguage(lang.id)} className="text-gray-400 hover:text-red-500 p-1 shrink-0">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newLang} onChange={setNewLang} placeholder="New language" />
          <button onClick={handleAdd} className="px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const ProjectsEditor = () => {
  const { cvData, addProject, updateProject, removeProject } = useStore();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addProject({ id: `proj-${Date.now()}`, name: newName, description: '', technologies: [], link: '' });
    setNewName('');
  };

  return (
    <CollapsibleSection title="Projects" icon={FolderOpen}>
      <div className="space-y-2.5">
        {cvData.projects.map((proj) => (
          <div key={proj.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 truncate">{proj.name || 'New Project'}</span>
              <button onClick={() => removeProject(proj.id)} className="text-gray-400 hover:text-red-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Input value={proj.name} onChange={(v) => updateProject(proj.id, { name: v })} placeholder="Project name" />
            <TextArea value={proj.description} onChange={(v) => updateProject(proj.id, { description: v })} placeholder="Describe the project..." rows={2} />
            <Input value={proj.link || ''} onChange={(v) => updateProject(proj.id, { link: v })} placeholder="Project link (optional)" />
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newName} onChange={setNewName} placeholder="New project name" />
          <button onClick={handleAdd} className="px-2.5 py-1.5 bg-cyan-600 text-white rounded-md text-xs hover:bg-cyan-700 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const CustomSectionsEditor = () => {
  const { cvData, addCustomSection, updateCustomSection, removeCustomSection } = useStore();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addCustomSection({ id: `custom-${Date.now()}`, title: newTitle, content: '', order: cvData.customSections.length });
    setNewTitle('');
  };

  return (
    <CollapsibleSection title="Custom Sections" icon={BookOpen}>
      <div className="space-y-2.5">
        {cvData.customSections.map((section) => (
          <div key={section.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
            <div className="flex items-center gap-2">
              <Input value={section.title} onChange={(v) => updateCustomSection(section.id, { title: v })} placeholder="Section title" />
              <button onClick={() => removeCustomSection(section.id)} className="text-gray-400 hover:text-red-500 p-0.5 shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <TextArea value={section.content} onChange={(v) => updateCustomSection(section.id, { content: v })} placeholder="Section content..." rows={3} />
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newTitle} onChange={setNewTitle} placeholder="Section title" />
          <button onClick={handleAdd} className="px-2.5 py-1.5 bg-gray-600 text-white rounded-md text-xs hover:bg-gray-700 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

const DocumentPreview = () => {
  const { cvData, customization, selectedTemplateId } = useStore();
  const { primaryColor, secondaryColor, accentColor, headingFont, bodyFont, theme } = customization;

  const isDark = theme === 'dark';
  const text = isDark ? '#f1f5f9' : '#1a1a1a';
  const mutedText = isDark ? '#94a3b8' : '#6b7280';

  const shared = { data: cvData, pc: primaryColor, sc: secondaryColor, ac: accentColor, hf: headingFont, bf: bodyFont, text, mutedText, isDark, pd: customization.proficiencyDisplay, layout: customization.layout };

  const Renderer = cvTemplateMap[selectedTemplateId] || cvTemplateMap['modern-minimal-cv'];
  return <Renderer {...shared} />;
};
