import { useRef, useCallback } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}

const toolbarBtn = 'px-2 py-1 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

const MarkdownEditor = ({ value, onChange, placeholder, rows = 3 }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insert = useCallback((before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      if (selected) {
        ta.setSelectionRange(start + before.length, start + before.length + selected.length);
      } else {
        ta.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  }, [value, onChange]);

  const insertLinePrefix = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }, [value, onChange]);

  const buttons = [
    { label: 'B', title: 'Bold', action: () => insert('**', '**') },
    { label: 'I', title: 'Italic', action: () => insert('*', '*') },
    { label: '•', title: 'Bullet list', action: () => insertLinePrefix('- ') },
    { label: '1.', title: 'Numbered list', action: () => insertLinePrefix('1. ') },
    { label: 'H', title: 'Heading', action: () => insertLinePrefix('## ') },
    { label: '🔗', title: 'Link', action: () => insert('[', '](url)') },
  ];

  return (
    <div className="space-y-1">
      <div className="flex gap-1 flex-wrap">
        {buttons.map((btn) => (
          <button key={btn.label} type="button" title={btn.title} className={toolbarBtn} onClick={btn.action}>
            {btn.label}
          </button>
        ))}
        <span className="text-[10px] text-gray-400 dark:text-gray-500 self-center ml-auto">Markdown supported</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MarkdownEditor;
