import { useStore } from '../../store/useStore';
import { Undo, Redo, Moon, Sun } from 'lucide-react';
import { ATSScoreChecker } from './ATSScoreChecker';
import { DocumentVersionManager } from './DocumentVersionManager';

export const Navbar = () => {
  const { customization, updateCustomization, setViewMode, undo, redo } = useStore();

  return (
    <header className="h-11 shrink-0 bg-white dark:bg-[#0b1120] border-b border-gray-200 dark:border-gray-800/60 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1
          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer select-none tracking-tight"
          onClick={() => setViewMode('gallery')}
        >
          cvbuilder
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <ATSScoreChecker />
        <DocumentVersionManager />
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700/50 mx-1" />
        <button
          onClick={undo}
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700/50 mx-1" />
        <button
          onClick={() =>
            updateCustomization({
              theme: customization.theme === 'light' ? 'dark' : 'light',
            })
          }
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          title="Toggle theme"
        >
          {customization.theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
