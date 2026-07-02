import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, ChevronDown, ChevronUp, User, FileText, Pen } from 'lucide-react';
import { clTemplateMap } from './previewRenderers';
import { getMatchingCoverLetter } from '../../data/templates';

export const CoverLetterEditor = () => {
  return (
    <div className="flex h-full">
      <div className="w-96 bg-white dark:bg-[#0b1120] border-r border-gray-200 dark:border-gray-800/60 flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-800/60">
          <h2 className="font-semibold text-xs text-gray-900 dark:text-gray-100">Edit Cover Letter</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <CoverLetterForm />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-gray-50/50 dark:bg-gray-900/30">
        <CoverLetterPreview />
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
  rows = 4,
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

const CoverLetterForm = () => {
  const { coverLetterData, updateCoverLetterRecipient, addParagraph, updateParagraph, removeParagraph } = useStore();
  const cl = coverLetterData;

  const handleAddParagraph = () => {
    addParagraph({ id: `p-${Date.now()}`, content: '', order: cl.paragraphs.length });
  };

  return (
    <>
      <CollapsibleSection title="Recipient Information" icon={User} defaultOpen>
        <Input value={cl.recipientName} onChange={(v) => updateCoverLetterRecipient({ recipientName: v })} placeholder="Recipient name" />
        <Input value={cl.recipientTitle} onChange={(v) => updateCoverLetterRecipient({ recipientTitle: v })} placeholder="Recipient title" />
        <Input value={cl.company} onChange={(v) => updateCoverLetterRecipient({ company: v })} placeholder="Company name" />
        <Input value={cl.address} onChange={(v) => updateCoverLetterRecipient({ address: v })} placeholder="Company address" />
        <Input value={cl.date} onChange={(v) => updateCoverLetterRecipient({ date: v })} placeholder="Date" type="date" />
      </CollapsibleSection>

      <CollapsibleSection title="Salutation" icon={Pen}>
        <Input value={cl.salutation} onChange={(v) => updateCoverLetterRecipient({ salutation: v })} placeholder="Dear Hiring Manager," />
      </CollapsibleSection>

      <CollapsibleSection title="Body Paragraphs" icon={FileText} defaultOpen>
        <div className="space-y-2.5">
          {cl.paragraphs.map((para) => (
            <div key={para.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">Paragraph {para.order + 1}</span>
                <button onClick={() => removeParagraph(para.id)} className="text-gray-400 hover:text-red-500 p-0.5">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <TextArea value={para.content} onChange={(v) => updateParagraph(para.id, v)} placeholder="Write your paragraph..." rows={4} />
            </div>
          ))}
          <button
            onClick={handleAddParagraph}
            className="w-full py-2 text-xs text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Paragraph
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Closing" icon={FileText}>
        <Input value={cl.closing} onChange={(v) => updateCoverLetterRecipient({ closing: v })} placeholder="Sincerely," />
        <Input value={cl.signature} onChange={(v) => updateCoverLetterRecipient({ signature: v })} placeholder="Your name" />
      </CollapsibleSection>
    </>
  );
};

const CoverLetterPreview = () => {
  const { coverLetterData, customization, selectedTemplateId } = useStore();
  const { primaryColor, secondaryColor, accentColor, headingFont, bodyFont, theme } = customization;

  const isDark = theme === 'dark';
  const text = isDark ? '#f1f5f9' : '#1a1a1a';
  const mutedText = isDark ? '#94a3b8' : '#6b7280';

  const shared = { data: coverLetterData, pc: primaryColor, sc: secondaryColor, ac: accentColor, hf: headingFont, bf: bodyFont, text, mutedText, isDark };
  const clTemplateId = getMatchingCoverLetter(selectedTemplateId) || 'modern-minimal-cl';
  const Renderer = clTemplateMap[clTemplateId] || clTemplateMap['modern-minimal-cl'];

  return <Renderer {...shared} />;
};
