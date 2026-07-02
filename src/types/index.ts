// Types for the CV & Cover Letter Template Builder

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FontPair {
  heading: string;
  body: string;
}

export type LayoutType = 'single' | 'two-column';
export type AccentStyle = 'lines' | 'dots' | 'shapes' | 'borders' | 'circles' | 'triangles' | 'geometric';

export interface ThemeVariant {
  name: string;
  colors: ColorScheme;
  fonts: FontPair;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  colors: ColorScheme;
  themes: ThemeVariant[];
  fonts: FontPair;
  layout: LayoutType;
  accentStyle: AccentStyle;
  category: string;
  thumbnail?: string;
}

export interface TemplatePair {
  cvId: string;
  coverLetterId: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  references: Reference[];
  customSections: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface CoverLetterData {
  personalInfo: PersonalInfo;
  date: string;
  recipientName: string;
  recipientTitle: string;
  company: string;
  address: string;
  salutation: string;
  paragraphs: CoverLetterParagraph[];
  closing: string;
  signature: string;
}

export interface CoverLetterParagraph {
  id: string;
  content: string;
  order: number;
}

export interface CustomizationState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  layout: LayoutType;
  theme: 'light' | 'dark';
  accentStyle: AccentStyle;
  selectedThemeIndex: number;
}

export interface DocumentState {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  cvData: CVData;
  coverLetterData: CoverLetterData;
  templateId: string;
  customization: CustomizationState;
}

export type ViewMode = 'gallery' | 'editor' | 'cover-letter-editor' | 'preview' | 'match';

export interface EditorState {
  viewMode: ViewMode;
  editingMode: 'cv' | 'cover-letter';
  selectedSection: string | null;
  history: {
    past: any[];
    future: any[];
  };
  selectedDocumentId: string | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  onboardingComplete: boolean;
  recentTemplateIds: string[];
  favoriteTemplateIds: string[];
}