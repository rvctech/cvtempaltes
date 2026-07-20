import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ATSCheckResult {
  category: string;
  score: number;
  maxScore: number;
  tips: string[];
}

export const ATSScoreChecker = () => {
  const { cvData } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const checkATS = (): ATSCheckResult[] => {
    const results: ATSCheckResult[] = [];

    const contactScore = [
      cvData.personalInfo.email ? 1 : 0,
      cvData.personalInfo.phone ? 1 : 0,
      cvData.personalInfo.location ? 1 : 0,
      cvData.personalInfo.linkedin ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    results.push({
      category: 'Contact',
      score: contactScore,
      maxScore: 4,
      tips: [
        !cvData.personalInfo.email && 'Add your email',
        !cvData.personalInfo.phone && 'Add your phone number',
        !cvData.personalInfo.location && 'Add your location',
        !cvData.personalInfo.linkedin && 'Add your LinkedIn',
      ].filter(Boolean) as string[],
    });

    const summaryLength = cvData.summary.length;
    const summaryScore = summaryLength > 50 ? (summaryLength > 300 ? 1 : 2) : summaryLength > 0 ? 1 : 0;
    results.push({
      category: 'Summary',
      score: summaryScore,
      maxScore: 2,
      tips: [
        summaryLength === 0 && 'Add a professional summary',
        summaryLength > 0 && summaryLength < 50 && 'Make it 50-300 characters',
        summaryLength > 300 && 'Consider keeping it concise',
      ].filter(Boolean) as string[],
    });

    const expScore = Math.min(cvData.experience.length * 2, 6);
    results.push({
      category: 'Experience',
      score: expScore,
      maxScore: 6,
      tips: [
        cvData.experience.length === 0 && 'Add work experience',
        cvData.experience.some((e: any) => !e.description) && 'Add descriptions',
        cvData.experience.some((e: any) => e.description && e.description.length < 30) && 'More detail needed',
      ].filter(Boolean) as string[],
    });

    const eduScore = cvData.education.length > 0 ? 2 : 0;
    results.push({
      category: 'Education',
      score: eduScore,
      maxScore: 2,
      tips: [cvData.education.length === 0 && 'Add your education'].filter(Boolean) as string[],
    });

    const skillScore = Math.min(cvData.skills.length, 4);
    results.push({
      category: 'Skills',
      score: skillScore,
      maxScore: 4,
      tips: [
        cvData.skills.length === 0 && 'Add relevant skills',
        cvData.skills.length > 0 && cvData.skills.length < 3 && 'Add more (aim for 5-10)',
      ].filter(Boolean) as string[],
    });

    return results;
  };

  const results = checkATS();
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const maxTotal = results.reduce((acc, r) => acc + r.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotal) * 100);

  const getGrade = () => {
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const gradeInfo = getGrade();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
      >
        ATS {percentage}%
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-80 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">ATS Score</h3>
                <span className={`text-lg font-bold px-2 py-0.5 rounded-md ${gradeInfo.color} ${gradeInfo.bg}`}>
                  {gradeInfo.grade}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{totalScore}/{maxTotal} pts</p>
            </div>
            <div className="p-4 max-h-72 overflow-y-auto space-y-3">
              {results.map((result) => (
                <div key={result.category} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{result.category}</span>
                    <span className="text-[11px] text-gray-400">{result.score}/{result.maxScore}</span>
                  </div>
                  {result.tips.length > 0 ? (
                    <div className="space-y-0.5">
                      {result.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                          <AlertCircle className="w-2.5 h-2.5 mt-0.5 text-amber-500 shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-green-600">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Good
                    </div>
                  )}
                </div>
              ))}
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
