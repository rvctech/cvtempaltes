import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Save, Trash2, Clock, FileText, Download, Upload } from 'lucide-react';

interface DocumentVersion {
  id: string;
  name: string;
  createdAt: string;
  data: {
    cvData: any;
    coverLetterData: any;
    selectedTemplateId: string;
    customization: any;
  };
}

const VERSIONS_KEY = 'cv-builder-versions';

export const DocumentVersionManager = () => {
  const { cvData, coverLetterData, selectedTemplateId, customization, setCVData, setCoverLetterData, setSelectedTemplate, updateCustomization } = useStore();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [newName, setNewName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(VERSIONS_KEY);
    if (saved) setVersions(JSON.parse(saved));
  }, []);

  const saveVersion = () => {
    if (!newName.trim()) return;
    const version: DocumentVersion = {
      id: `ver-${Date.now()}`,
      name: newName,
      createdAt: new Date().toISOString(),
      data: { cvData, coverLetterData, selectedTemplateId, customization },
    };
    const updated = [...versions, version];
    setVersions(updated);
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
    setNewName('');
  };

  const loadVersion = (version: DocumentVersion) => {
    setCVData(version.data.cvData);
    setCoverLetterData(version.data.coverLetterData);
    setSelectedTemplate(version.data.selectedTemplateId);
    updateCustomization(version.data.customization);
  };

  const deleteVersion = (id: string) => {
    const updated = versions.filter((v) => v.id !== id);
    setVersions(updated);
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
  };

  const exportVersion = (version: DocumentVersion) => {
    const data = JSON.stringify(version, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${version.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as DocumentVersion;
        const version: DocumentVersion = {
          ...data,
          id: `ver-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const updated = [...versions, version];
        setVersions(updated);
        localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Save className="w-3 h-3" />
        {versions.length}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-80 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Versions</h3>
            </div>

            <div className="p-4 space-y-3 border-b border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name..."
                  className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && saveVersion()}
                />
                <button
                  onClick={saveVersion}
                  disabled={!newName.trim()}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
              <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-dashed border-gray-300 rounded-md hover:border-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors">
                <Upload className="w-3 h-3" />
                Import JSON
                <input type="file" accept=".json" onChange={importVersion} className="hidden" />
              </label>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {versions.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">No saved versions</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {versions.map((version) => (
                    <div key={version.id} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{version.name}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(version.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button onClick={() => loadVersion(version)} className="px-2 py-1 text-[10px] font-medium text-indigo-600 rounded hover:bg-indigo-50 transition-colors">Load</button>
                          <button onClick={() => exportVersion(version)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors"><Download className="w-3 h-3" /></button>
                          <button onClick={() => deleteVersion(version.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
