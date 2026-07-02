import { create } from 'zustand';
import type {
  CVData,
  CoverLetterData,
  CustomizationState,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Certification,
  Language,
  Project,
  Reference,
  CustomSection,
  CoverLetterParagraph,
  ViewMode,
} from '../types';

interface State {
  cvData: CVData;
  coverLetterData: CoverLetterData;
  selectedTemplateId: string;
  customization: CustomizationState;
  viewMode: ViewMode;

  setCVData: (data: Partial<CVData>) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;

  addExperience: (entry: WorkExperience) => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (entry: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addReference: (ref: Reference) => void;
  updateReference: (id: string, data: Partial<Reference>) => void;
  removeReference: (id: string) => void;

  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  setCoverLetterData: (data: Partial<CoverLetterData>) => void;
  updateCoverLetterRecipient: (data: Partial<CoverLetterData>) => void;
  addParagraph: (paragraph: CoverLetterParagraph) => void;
  updateParagraph: (id: string, content: string) => void;
  removeParagraph: (id: string) => void;

  setSelectedTemplate: (id: string) => void;
  updateThemeIndex: (index: number) => void;
  updateCustomization: (data: Partial<CustomizationState>) => void;
  setViewMode: (mode: ViewMode) => void;
  undo: () => void;
  redo: () => void;
}

const defaultPersonalInfo: PersonalInfo = {
  firstName: 'John',
  lastName: 'Doe',
  title: 'Software Engineer',
  email: 'john.doe@example.com',
  phone: '+1 234 567 890',
  location: 'New York, NY',
  website: 'https://johndoe.com',
  linkedin: 'https://linkedin.com/in/johndoe',
};

const defaultCVData: CVData = {
  personalInfo: defaultPersonalInfo,
  summary: 'Experienced software engineer with a passion for building scalable web applications. Skilled in React, TypeScript, and Node.js.',
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Corp',
      role: 'Senior Developer',
      startDate: '2020-01',
      endDate: '2023-12',
      current: false,
      description: 'Led a team of developers in building a SaaS platform. Implemented CI/CD pipelines and improved performance by 40%.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-06',
      current: false,
    },
  ],
  skills: [
    { id: 'skill-1', name: 'React', proficiency: 'Expert' },
    { id: 'skill-2', name: 'TypeScript', proficiency: 'Advanced' },
    { id: 'skill-3', name: 'Node.js', proficiency: 'Advanced' },
  ],
  certifications: [],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' },
  ],
  projects: [],
  references: [],
  customSections: [],
};

const defaultCoverLetterData: CoverLetterData = {
  personalInfo: defaultPersonalInfo,
  date: new Date().toISOString().split('T')[0],
  recipientName: 'Hiring Manager',
  recipientTitle: 'HR Director',
  company: 'Company Name',
  address: '123 Business St, City, Country',
  salutation: 'Dear Hiring Manager,',
  paragraphs: [
    { id: 'p-1', content: 'I am writing to express my interest in the Software Engineer position at your company. With my background in full-stack development, I am confident in my ability to contribute to your team.', order: 0 },
    { id: 'p-2', content: 'In my previous role, I successfully led the development of a customer-facing dashboard that increased user engagement by 30%. I am particularly skilled in React, TypeScript, and modern web technologies.', order: 1 },
    { id: 'p-3', content: 'I would welcome the opportunity to discuss how my skills and experiences align with your needs. Thank you for your time and consideration.', order: 2 },
  ],
  closing: 'Sincerely,',
  signature: 'John Doe',
};

const defaultCustomization: CustomizationState = {
  primaryColor: '#1B2A4A',
  secondaryColor: '#C9A84C',
  accentColor: '#C9A84C',
  headingFont: 'Playfair Display',
  bodyFont: 'Lato',
  fontSize: 14,
  lineHeight: 1.5,
  paragraphSpacing: 16,
  layout: 'single',
  theme: 'dark',
  accentStyle: 'lines',
  selectedThemeIndex: 0,
  proficiencyDisplay: 'text',
};

export const useStore = create<State>((set) => ({
  cvData: defaultCVData,
  coverLetterData: defaultCoverLetterData,
  selectedTemplateId: 'executive-classic-cv',
  customization: defaultCustomization,
  viewMode: 'gallery',

  setCVData: (data) => set((state) => ({ cvData: { ...state.cvData, ...data } })),

  updatePersonalInfo: (info) =>
    set((state) => ({
      cvData: { ...state.cvData, personalInfo: { ...state.cvData.personalInfo, ...info } },
      coverLetterData: { ...state.coverLetterData, personalInfo: { ...state.coverLetterData.personalInfo, ...info } },
    })),

  updateSummary: (summary) => set((state) => ({ cvData: { ...state.cvData, summary } })),

  addExperience: (entry) =>
    set((state) => ({ cvData: { ...state.cvData, experience: [...state.cvData.experience, entry] } })),

  updateExperience: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experience: state.cvData.experience.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, experience: state.cvData.experience.filter((exp) => exp.id !== id) },
    })),

  addEducation: (entry) =>
    set((state) => ({ cvData: { ...state.cvData, education: [...state.cvData.education, entry] } })),

  updateEducation: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        education: state.cvData.education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, education: state.cvData.education.filter((edu) => edu.id !== id) },
    })),

  addSkill: (skill) =>
    set((state) => ({ cvData: { ...state.cvData, skills: [...state.cvData.skills, skill] } })),

  updateSkill: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        skills: state.cvData.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
      },
    })),

  removeSkill: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, skills: state.cvData.skills.filter((s) => s.id !== id) },
    })),

  addCertification: (cert) =>
    set((state) => ({ cvData: { ...state.cvData, certifications: [...state.cvData.certifications, cert] } })),

  updateCertification: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: state.cvData.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
      },
    })),

  removeCertification: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, certifications: state.cvData.certifications.filter((c) => c.id !== id) },
    })),

  addLanguage: (lang) =>
    set((state) => ({ cvData: { ...state.cvData, languages: [...state.cvData.languages, lang] } })),

  updateLanguage: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.map((l) => (l.id === id ? { ...l, ...data } : l)),
      },
    })),

  removeLanguage: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, languages: state.cvData.languages.filter((l) => l.id !== id) },
    })),

  addProject: (project) =>
    set((state) => ({ cvData: { ...state.cvData, projects: [...state.cvData.projects, project] } })),

  updateProject: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        projects: state.cvData.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, projects: state.cvData.projects.filter((p) => p.id !== id) },
    })),

  addReference: (ref) =>
    set((state) => ({ cvData: { ...state.cvData, references: [...state.cvData.references, ref] } })),

  updateReference: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        references: state.cvData.references.map((r) => (r.id === id ? { ...r, ...data } : r)),
      },
    })),

  removeReference: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, references: state.cvData.references.filter((r) => r.id !== id) },
    })),

  addCustomSection: (section) =>
    set((state) => ({
      cvData: { ...state.cvData, customSections: [...state.cvData.customSections, section] },
    })),

  updateCustomSection: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        customSections: state.cvData.customSections.map((s) => (s.id === id ? { ...s, ...data } : s)),
      },
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      cvData: { ...state.cvData, customSections: state.cvData.customSections.filter((s) => s.id !== id) },
    })),

  setCoverLetterData: (data) =>
    set((state) => ({ coverLetterData: { ...state.coverLetterData, ...data } })),

  updateCoverLetterRecipient: (data) =>
    set((state) => ({ coverLetterData: { ...state.coverLetterData, ...data } })),

  addParagraph: (paragraph) =>
    set((state) => ({
      coverLetterData: {
        ...state.coverLetterData,
        paragraphs: [...state.coverLetterData.paragraphs, paragraph],
      },
    })),

  updateParagraph: (id, content) =>
    set((state) => ({
      coverLetterData: {
        ...state.coverLetterData,
        paragraphs: state.coverLetterData.paragraphs.map((p) => (p.id === id ? { ...p, content } : p)),
      },
    })),

  removeParagraph: (id) =>
    set((state) => ({
      coverLetterData: {
        ...state.coverLetterData,
        paragraphs: state.coverLetterData.paragraphs.filter((p) => p.id !== id),
      },
    })),

  setSelectedTemplate: (id) => set({ selectedTemplateId: id }),

  updateThemeIndex: (index) => set((state) => ({ customization: { ...state.customization, selectedThemeIndex: index } })),

  updateCustomization: (data) =>
    set((state) => ({ customization: { ...state.customization, ...data } })),

  setViewMode: (mode) => set({ viewMode: mode }),

  undo: () => {
    console.log('Undo not yet implemented');
  },

  redo: () => {
    console.log('Redo not yet implemented');
  },
}));