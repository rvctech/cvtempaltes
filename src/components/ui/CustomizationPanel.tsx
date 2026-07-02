import { useStore } from '../../store/useStore';
import { cvTemplates } from '../../data/templates';
import type { LayoutType, AccentStyle } from '../../types';
import { Palette, Type, Layout, Sliders, Moon, Sun, Paintbrush, Sparkles } from 'lucide-react';

const FONTS = [
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Lato', category: 'Sans-serif' },
  { name: 'Inter', category: 'Sans-serif' },
  { name: 'Open Sans', category: 'Sans-serif' },
  { name: 'Poppins', category: 'Sans-serif' },
  { name: 'Raleway', category: 'Sans-serif' },
  { name: 'Roboto', category: 'Sans-serif' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Montserrat', category: 'Sans-serif' },
  { name: 'Source Sans Pro', category: 'Sans-serif' },
  { name: 'JetBrains Mono', category: 'Monospace' },
  { name: 'Fira Sans', category: 'Sans-serif' },
  { name: 'Cormorant Garamond', category: 'Serif' },
  { name: 'Nunito', category: 'Sans-serif' },
  { name: 'Bebas Neue', category: 'Display' },
  { name: 'Roboto Condensed', category: 'Sans-serif' },
];

const PRESET_COLORS = [
  { name: 'Executive Blue', primary: '#1B2A4A', secondary: '#C9A84C', accent: '#C9A84C' },
  { name: 'Modern Teal', primary: '#2C2C2C', secondary: '#3BA6A6', accent: '#3BA6A6' },
  { name: 'Creative Purple', primary: '#6C3B8C', secondary: '#FF6B6B', accent: '#FF6B6B' },
  { name: 'Corporate Blue', primary: '#2563EB', secondary: '#6B7280', accent: '#2563EB' },
  { name: 'Minimalist Rose', primary: '#1A1A1A', secondary: '#E8A87C', accent: '#E8A87C' },
  { name: 'Tech Cyan', primary: '#0D1117', secondary: '#58A6FF', accent: '#3FB950' },
  { name: 'Elegant Burgundy', primary: '#6B1D3B', secondary: '#F5E6D3', accent: '#F5E6D3' },
  { name: 'Bold Gold', primary: '#000000', secondary: '#FFD700', accent: '#FFD700' },
  { name: 'Forest Green', primary: '#1B4332', secondary: '#52B788', accent: '#52B788' },
  { name: 'Ocean Navy', primary: '#023047', secondary: '#219EBC', accent: '#8ECAE6' },
  { name: 'Sunset Orange', primary: '#3D2B1F', secondary: '#FF6B35', accent: '#FF6B35' },
  { name: 'Lavender', primary: '#2D2A4A', secondary: '#9D8EC7', accent: '#C4B5E0' },
];

export const CustomizationPanel = () => {
  const { customization, updateCustomization, updateThemeIndex, selectedTemplateId } = useStore();
  const currentTemplate = cvTemplates.find((t) => t.id === selectedTemplateId);
  const templateThemes = currentTemplate?.themes ?? [];

  return (
    <div className="space-y-6 p-4 glass-card rounded-xl">
      <h3 className="font-bold text-gray-900 dark:text-white">Customize Template</h3>

      {/* Template Themes */}
      {templateThemes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4" />
            {currentTemplate?.name ?? 'Template'} Themes
          </div>
          <div className="grid grid-cols-2 gap-2">
            {templateThemes.map((theme, i) => (
              <button
                key={theme.name}
                onClick={() => {
                  updateThemeIndex(i);
                  updateCustomization({
                    primaryColor: theme.colors.primary,
                    secondaryColor: theme.colors.secondary,
                    accentColor: theme.colors.accent,
                    headingFont: theme.fonts.heading,
                    bodyFont: theme.fonts.body,
                  });
                }}
                className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                  customization.selectedThemeIndex === i
                    ? 'border-indigo-500 ring-1 ring-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/10'
                    : 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/30'
                }`}
              >
                <div className="flex gap-1.5 mb-1.5">
                  <div className="w-4 h-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: theme.colors.primary }} />
                  <div className="w-4 h-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: theme.colors.secondary }} />
                  <div className="w-4 h-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: theme.colors.accent }} />
                </div>
                <span className={`text-xs font-medium ${
                  customization.selectedThemeIndex === i
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {theme.name}
                </span>
                <span className="block text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  {theme.fonts.heading} / {theme.fonts.body}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Theme */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Palette className="w-4 h-4" />
          Color Presets
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateCustomization({
                  primaryColor: preset.primary,
                  secondaryColor: preset.secondary,
                  accentColor: preset.accent,
                });
                updateThemeIndex(-1);
              }}
              className={`p-2 rounded-lg border-2 text-left transition-all ${
                customization.primaryColor === preset.primary
                  ? 'border-indigo-500 glass'
                  : 'border-white/30 dark:border-white/10 glass hover:border-white/50 dark:hover:border-white/20'
              }`}
            >
              <div className="flex gap-1 mb-1">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Paintbrush className="w-4 h-4" />
          Custom Colors
        </div>
        <div className="space-y-2">
          <ColorPicker
            label="Primary"
            value={customization.primaryColor}
            onChange={(v) => { updateCustomization({ primaryColor: v }); updateThemeIndex(-1); }}
          />
          <ColorPicker
            label="Secondary"
            value={customization.secondaryColor}
            onChange={(v) => { updateCustomization({ secondaryColor: v }); updateThemeIndex(-1); }}
          />
          <ColorPicker
            label="Accent"
            value={customization.accentColor}
            onChange={(v) => { updateCustomization({ accentColor: v }); updateThemeIndex(-1); }}
          />
        </div>
      </div>

      {/* Fonts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Type className="w-4 h-4" />
          Fonts
        </div>
        <div className="space-y-2">
          <select
            value={customization.headingFont}
            onChange={(e) => updateCustomization({ headingFont: e.target.value })}
            className="w-full px-3 py-2 glass-input rounded-md text-sm text-gray-900 dark:text-white"
          >
            {FONTS.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
          <select
            value={customization.bodyFont}
            onChange={(e) => updateCustomization({ bodyFont: e.target.value })}
            className="w-full px-3 py-2 glass-input rounded-md text-sm text-gray-900 dark:text-white"
          >
            {FONTS.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Sliders className="w-4 h-4" />
          Font Size
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Body: {customization.fontSize}px</label>
            <input
              type="range"
              min="10"
              max="18"
              value={customization.fontSize}
              onChange={(e) => updateCustomization({ fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Line Height: {customization.lineHeight}</label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={customization.lineHeight}
              onChange={(e) => updateCustomization({ lineHeight: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Paragraph Spacing: {customization.paragraphSpacing}px</label>
            <input
              type="range"
              min="4"
              max="32"
              value={customization.paragraphSpacing}
              onChange={(e) => updateCustomization({ paragraphSpacing: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Layout className="w-4 h-4" />
          Layout
        </div>
        <div className="flex gap-2">
          {(['single', 'two-column'] as LayoutType[]).map((layout) => (
            <button
              key={layout}
              onClick={() => updateCustomization({ layout })}
              className={`flex-1 py-2 text-sm rounded-md border-2 transition-all ${
                customization.layout === layout
                  ? 'border-indigo-500 glass text-indigo-700 dark:text-indigo-400'
                  : 'border-white/30 dark:border-white/10 glass text-gray-600 dark:text-gray-400 hover:border-white/50 dark:hover:border-white/20'
              }`}
            >
              {layout === 'single' ? 'Single Column' : 'Two Column'}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Style */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Accent Style
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['lines', 'dots', 'shapes', 'borders', 'circles', 'geometric'] as AccentStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => updateCustomization({ accentStyle: style })}
              className={`py-2 text-xs rounded-md border-2 transition-all capitalize ${
                customization.accentStyle === style
                  ? 'border-indigo-500 glass text-indigo-700 dark:text-indigo-400'
                  : 'border-white/30 dark:border-white/10 glass text-gray-600 dark:text-gray-400 hover:border-white/50 dark:hover:border-white/20'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Proficiency Display */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Type className="w-4 h-4" />
          Skills Display
        </div>
        <div className="flex gap-2">
          {(['text', 'bars', 'stars', 'circles'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateCustomization({ proficiencyDisplay: mode })}
              className={`flex-1 py-2 text-sm rounded-md border-2 capitalize transition-all ${
                customization.proficiencyDisplay === mode
                  ? 'border-indigo-500 glass text-indigo-700 dark:text-indigo-400'
                  : 'border-white/30 dark:border-white/10 glass text-gray-600 dark:text-gray-400 hover:border-white/50 dark:hover:border-white/20'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {customization.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          Theme
        </div>
        <button
          onClick={() =>
            updateCustomization({ theme: customization.theme === 'light' ? 'dark' : 'light' })
          }
          className={`w-full py-2 text-sm rounded-md border-2 transition-all ${
            customization.theme === 'dark'
              ? 'border-indigo-500 glass text-indigo-400'
              : 'border-white/30 glass text-gray-600 hover:border-white/50'
          }`}
        >
          {customization.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      </div>
    </div>
  );
};

const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3">
    <label className="text-sm text-gray-600 dark:text-gray-400 w-20">{label}</label>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 rounded-md border border-white/30 dark:border-white/10 cursor-pointer"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-3 py-2 glass-input rounded-md text-sm font-mono text-gray-900 dark:text-white"
    />
  </div>
);