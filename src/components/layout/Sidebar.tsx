import { useStore } from '../../store/useStore';
import { LayoutGrid, Eye, FileText, Download } from 'lucide-react';

const navItems = [
  { id: 'gallery' as const, label: 'Templates', icon: LayoutGrid },
  { id: 'editor' as const, label: 'CV Editor', icon: Eye },
  { id: 'cover-letter-editor' as const, label: 'Cover Letter', icon: FileText },
  { id: 'preview' as const, label: 'Export', icon: Download },
];

export const Sidebar = () => {
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col py-5">
      <div className="px-5 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Menu</p>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-[7px] text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-600 rounded-full" />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 mt-4">
        <p className="text-[10px] text-gray-300">v1.0</p>
      </div>
    </aside>
  );
};
