import { useStore } from '../../store/useStore';
import { Undo, Redo } from 'lucide-react';
import { ATSScoreChecker } from './ATSScoreChecker';
import { DocumentVersionManager } from './DocumentVersionManager';

export const Navbar = () => {
  const { setViewMode, undo, redo } = useStore();

  return (
    <header className="h-11 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <h1
          className="text-sm font-bold text-indigo-600 cursor-pointer select-none tracking-tight"
          onClick={() => setViewMode('gallery')}
        >
          cvbuilder
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <ATSScoreChecker />
        <DocumentVersionManager />
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button
          onClick={undo}
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
