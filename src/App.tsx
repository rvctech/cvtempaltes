import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { TemplateGallery } from './components/gallery/TemplateGallery';
import { Editor } from './components/editor/Editor';
import { CoverLetterEditor } from './components/editor/CoverLetterEditor';
import { Preview } from './components/preview/Preview';
import { Navbar } from './components/ui/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CustomizationPanel } from './components/ui/CustomizationPanel';
import { ToastProvider } from './components/ui/Toast';
import { useAutoSave } from './hooks/useAutoSave';

const editorViews = new Set(['editor', 'cover-letter-editor', 'preview']);

function AppContent() {
  const viewMode = useStore((state) => state.viewMode);
  const theme = useStore((state) => state.customization.theme);

  useAutoSave();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const hasSidebar = editorViews.has(viewMode);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#080e1a] transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {hasSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto">
          {viewMode === 'gallery' && <TemplateGallery />}
          {viewMode === 'editor' && <Editor />}
          {viewMode === 'cover-letter-editor' && <CoverLetterEditor />}
          {viewMode === 'preview' && <Preview />}
        </main>
        {hasSidebar && (
          <aside className="w-80 xl:w-96 overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0b1120]/50 backdrop-blur-sm">
            <CustomizationPanel />
          </aside>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
