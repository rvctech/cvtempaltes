import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cvTemplates } from '../../data/templates';
import { Sparkles, ArrowRight } from 'lucide-react';

const categories = ['All', ...Array.from(new Set(cvTemplates.map((t) => t.category)))];

export const TemplateGallery = () => {
  const { selectedTemplateId, setSelectedTemplate, setViewMode, updateCustomization, updateThemeIndex } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? cvTemplates
    : cvTemplates.filter((t) => t.category === activeCategory);

  const applyTemplate = (template: typeof cvTemplates[number]) => {
    setSelectedTemplate(template.id);
    updateThemeIndex(0);
    updateCustomization({
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      headingFont: template.fonts.heading,
      bodyFont: template.fonts.body,
      layout: template.layout,
      accentStyle: template.accentStyle,
    });
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 16 } },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 pt-8 pb-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600 mb-3">
              <Sparkles className="w-3 h-3" />
              8 professional templates
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
              Choose your template
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto mb-4">
              Each comes with a matching cover letter. Pick, customize, export.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-1.5"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-400">No templates found in this category.</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                return (
                  <motion.div
                    key={template.id}
                    variants={item}
                    layout
                    className={`group relative rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-indigo-500 ring-1 ring-indigo-500/30 shadow-sm'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      applyTemplate(template);
                      setViewMode('editor');
                    }}
                  >
                    <div className="relative h-40 flex items-center justify-center overflow-hidden bg-gray-50">
                      <div className="absolute inset-0" style={{ backgroundColor: template.colors.background }} />
                      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundColor: template.colors.primary }} />
                      <div className="relative z-10 text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: template.colors.primary }}>
                          <span className="text-white text-base font-bold" style={{ fontFamily: template.fonts.heading }}>
                            {template.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-xs mb-0.5" style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}>
                          {template.name.replace(' CV', '')}
                        </h3>
                        <p className="text-[10px] opacity-50" style={{ color: template.colors.primary }}>
                          {template.fonts.heading} &middot; {template.fonts.body}
                        </p>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3 gap-1.5">
                        <button
                          className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/90 text-gray-800 hover:bg-white transition-all shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyTemplate(template);
                            setViewMode('editor');
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-indigo-600/90 text-white hover:bg-indigo-600 transition-all shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyTemplate(template);
                            setViewMode('preview');
                          }}
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          <div className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: template.colors.primary }} />
                          <div className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: template.colors.secondary }} />
                          <div className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: template.colors.accent }} />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-500">
                            {template.layout}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-indigo-50 text-indigo-600">
                            {template.category}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-indigo-600">
                          <span>Selected</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
