import { useStore } from '../../store/useStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Printer, File } from 'lucide-react';
import { useState } from 'react';
import { cvTemplateMap, clTemplateMap } from '../editor/previewRenderers';
import { getMatchingCoverLetter } from '../../data/templates';

export const Preview = () => {
  const [activeTab, setActiveTab] = useState<'cv' | 'cover-letter'>('cv');
  const [exporting, setExporting] = useState(false);
  const { cvData, coverLetterData, customization, selectedTemplateId } = useStore();
  const { primaryColor, secondaryColor, accentColor, headingFont, bodyFont, theme, proficiencyDisplay, layout } = customization;

  const handleExportPDF = async (elementId: string, filename: string) => {
    setExporting(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const pagePixelHeight = (canvas.width * pdfHeight) / pdfWidth;

      let heightLeft = canvas.height;
      let pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
      heightLeft -= pagePixelHeight;
      pos -= pagePixelHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, pos, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
        heightLeft -= pagePixelHeight;
        pos -= pagePixelHeight;
      }

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const addPagesToPDF = (pdf: jsPDF, canvas: HTMLCanvasElement) => {
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/png');
    const pagePixelHeight = (canvas.width * pdfHeight) / pdfWidth;

    let heightLeft = canvas.height;
    let pos = 0;
    pdf.addImage(imgData, 'PNG', 0, pos, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
    heightLeft -= pagePixelHeight;
    pos -= pagePixelHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, pos, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
      heightLeft -= pagePixelHeight;
      pos -= pagePixelHeight;
    }
  };

  const handleExportBoth = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');

      const cvElement = document.getElementById('cv-preview-export');
      if (cvElement) {
        const cvCanvas = await html2canvas(cvElement, { scale: 2, useCORS: true });
        addPagesToPDF(pdf, cvCanvas);
        pdf.addPage();
      }

      const clElement = document.getElementById('cl-preview-export');
      if (clElement) {
        const clCanvas = await html2canvas(clElement, { scale: 2, useCORS: true });
        addPagesToPDF(pdf, clCanvas);
      }

      pdf.save('cv-and-cover-letter.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isDark = theme === 'dark';
  const text = isDark ? '#f1f5f9' : '#1a1a1a';
  const mutedText = isDark ? '#94a3b8' : '#6b7280';

  const cvShared = { data: cvData, pc: primaryColor, sc: secondaryColor, ac: accentColor, hf: headingFont, bf: bodyFont, text, mutedText, isDark, pd: proficiencyDisplay, layout };
  const clTemplateId = getMatchingCoverLetter(selectedTemplateId) || 'modern-minimal-cl';
  const clShared = { data: coverLetterData, pc: primaryColor, sc: secondaryColor, ac: accentColor, hf: headingFont, bf: bodyFont, text, mutedText, isDark, pd: proficiencyDisplay, layout };

  const CVRenderer = cvTemplateMap[selectedTemplateId] || cvTemplateMap['modern-minimal-cv'];
  const CLRenderer = clTemplateMap[clTemplateId] || clTemplateMap['modern-minimal-cl'];

  return (
    <div className="h-full flex flex-col p-5 gap-4">
      <div className="shrink-0 bg-white dark:bg-[#0b1120] border border-gray-200 dark:border-gray-700/60 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Export</h2>
          <div className="flex bg-gray-100 dark:bg-gray-800/50 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                activeTab === 'cv'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              CV
            </button>
            <button
              onClick={() => setActiveTab('cover-letter')}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                activeTab === 'cover-letter'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Cover Letter
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
          >
            <Printer className="w-3 h-3" />
            Print
          </button>
          <button
            onClick={() =>
              handleExportPDF(
                activeTab === 'cv' ? 'cv-preview-export' : 'cl-preview-export',
                activeTab === 'cv' ? 'cv-document' : 'cover-letter'
              )
            }
            disabled={exporting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            {exporting ? 'Exporting...' : `${activeTab === 'cv' ? 'CV' : 'CL'}`}
          </button>
          <button
            onClick={handleExportBoth}
            disabled={exporting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <File className="w-3 h-3" />
            Both
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-[#0b1120] border border-gray-200 dark:border-gray-700/60 rounded-xl p-6 flex justify-center">
        {activeTab === 'cv' ? (
          <div id="cv-preview-export" className="h-fit">
            <CVRenderer {...cvShared} />
          </div>
        ) : (
          <div id="cl-preview-export" className="h-fit">
            <CLRenderer {...clShared} />
          </div>
        )}
      </div>
    </div>
  );
};
