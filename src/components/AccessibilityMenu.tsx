import { useState, useRef, useEffect } from 'react';
import { useAccessibility, FontSizeScale, ContrastTheme } from '../context/AccessibilityContext';
import { 
  Eye, 
  RotateCcw, 
  Check, 
  Sun, 
  Moon, 
  Palette, 
  ZoomIn, 
  ZoomOut,
  X
} from 'lucide-react';

interface AccessibilityMenuProps {
  variant?: 'topbar' | 'mobile' | 'header-nav';
  className?: string;
  onCloseMobileDrawer?: () => void;
}

export default function AccessibilityMenu({ 
  variant = 'topbar', 
  className = '',
  onCloseMobileDrawer
}: AccessibilityMenuProps) {
  const {
    fontSize,
    contrastTheme,
    setFontSize,
    setContrastTheme,
    increaseFontSize,
    decreaseFontSize,
    resetAccessibility,
    isHighContrast
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const isCustomized = fontSize !== 'normal' || contrastTheme !== 'normal';

  const fontOptions: { id: FontSizeScale; label: string; subLabel: string; scaleText: string }[] = [
    { id: 'normal', label: 'އާދައިގެ', subLabel: '100%', scaleText: 'A' },
    { id: 'large', label: 'ބޮޑު', subLabel: '115%', scaleText: 'A+' },
    { id: 'xlarge', label: 'ވަރަށް ބޮޑު', subLabel: '130%', scaleText: 'A++' }
  ];

  const contrastOptions: { id: ContrastTheme; label: string; subLabel: string; icon: React.ReactNode }[] = [
    { 
      id: 'normal', 
      label: 'އާދައިގެ ކުލަތައް', 
      subLabel: 'Standard Theme',
      icon: <Palette className="w-4 h-4 text-[#1B6B52]" />
    },
    { 
      id: 'high-contrast-light', 
      label: 'ހައި ކޮންޓްރާސްޓް (އަލި)', 
      subLabel: 'High Contrast Light',
      icon: <Sun className="w-4 h-4 text-amber-600" />
    },
    { 
      id: 'high-contrast-dark', 
      label: 'ހައި ކޮންޓްރާސްޓް (އަނދިރި)', 
      subLabel: 'High Contrast Dark',
      icon: <Moon className="w-4 h-4 text-emerald-400" />
    }
  ];

  // If rendering inside mobile drawer as inline panel
  if (variant === 'mobile') {
    return (
      <div className={`p-3 bg-[#FAFCFB] rounded-2xl border border-[#E5ECE8] space-y-3 font-thaana ${className}`}>
        <div className="flex items-center justify-between pb-2 border-b border-[#E5ECE8]">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C2622]">
            <Eye className="w-4 h-4 text-[#1B6B52]" />
            <span>ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility)</span>
          </div>
          {isCustomized && (
            <button
              type="button"
              onClick={resetAccessibility}
              className="text-xs text-[#B83244] hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>އާދައިގެ ގޮތަށް</span>
            </button>
          )}
        </div>

        {/* Font Size controls */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#556660]">
            <span className="font-semibold">އަކުރުގެ ސައިޒު (Font Size):</span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#E5ECE8]">
              {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {fontOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFontSize(opt.id)}
                className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  fontSize === opt.id
                    ? 'bg-[#1B6B52] text-white border-[#1B6B52] font-bold shadow-xs'
                    : 'bg-white text-[#1C2622] border-[#E5ECE8] hover:bg-[#EBF5F0]'
                }`}
              >
                <span className="font-bold font-mono text-sm leading-none">{opt.scaleText}</span>
                <span className="text-[11px] leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contrast Theme controls */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-[#556660] block">ކުލަތަކުގެ ކޮންޓްރާސްޓް (Contrast Theme):</span>
          <div className="space-y-1">
            {contrastOptions.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setContrastTheme(theme.id);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`w-full p-2 rounded-xl text-right flex items-center justify-between transition-all border ${
                  contrastTheme === theme.id
                    ? 'bg-[#EBF5F0] text-[#1B6B52] border-[#1B6B52] font-bold'
                    : 'bg-white text-[#1C2622] border-[#E5ECE8] hover:bg-[#FAFCFB]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {theme.icon}
                  <div>
                    <div className="text-xs font-semibold leading-tight">{theme.label}</div>
                    <div className="text-[10px] text-[#556660] font-latin">{theme.subLabel}</div>
                  </div>
                </div>
                {contrastTheme === theme.id && (
                  <Check className="w-4 h-4 text-[#1B6B52] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Topbar or Header Nav popover button
  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        id="accessibility-settings-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-thaana transition-all duration-200 ${
          variant === 'topbar'
            ? isOpen
              ? 'bg-white text-[#1B6B52] shadow-xs'
              : 'bg-white/10 hover:bg-white/20 text-[#EBF5F0]'
            : isOpen
            ? 'bg-[#EBF5F0] text-[#1B6B52] shadow-xs'
            : 'text-[#556660] hover:text-[#1B6B52] hover:bg-[#EBF5F0]/60'
        }`}
        title="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
      >
        <Eye className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'scale-110' : 'group-hover:scale-105'} ${
          variant === 'topbar' ? 'text-[#A7F3D0]' : 'text-[#1B6B52]'
        }`} />
        <span className="hidden sm:inline">ފެނުމުގެ ފަސޭހަ</span>
        <span className="sm:hidden">A±</span>

        {/* Small Active Indicator Dot if customized */}
        {isCustomized && (
          <span 
            className="w-2 h-2 rounded-full bg-amber-400 border border-white shrink-0 animate-pulse" 
            title="ބަދަލުތަކެއް ގެނެވިފައި"
          />
        )}
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility Settings"
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-[#E5ECE8] p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-right font-thaana"
          style={{ direction: 'rtl' }}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE8]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1C2622] leading-tight">
                  ފެނުމާއި ކިޔުމުގެ ފަސޭހަ
                </h4>
                <p className="text-[11px] text-[#556660] font-latin">
                  Accessibility & Readability Settings
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1C2622] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Font Size Controls */}
          <div className="py-3 border-b border-[#E5ECE8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C2622]">އަކުރުގެ ސައިޒު (Font Size):</span>
              <div className="flex items-center gap-1 font-mono text-xs text-[#1B6B52] font-bold bg-[#EBF5F0] px-2 py-0.5 rounded">
                <span>{fontSize === 'normal' ? '100% (Default)' : fontSize === 'large' ? '115% (Large)' : '130% (X-Large)'}</span>
              </div>
            </div>

            {/* Step buttons and Presets */}
            <div className="grid grid-cols-3 gap-2">
              {fontOptions.map((opt) => {
                const isSelected = fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontSize(opt.id)}
                    className={`py-2 px-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#1B6B52] text-white border-[#1B6B52] font-bold shadow-xs scale-[1.02]'
                        : 'bg-white text-[#1C2622] border-[#E5ECE8] hover:bg-[#EBF5F0] hover:border-[#C8E0D5]'
                    }`}
                  >
                    <span className="font-bold font-mono text-sm leading-none">{opt.scaleText}</span>
                    <span className="text-xs">{opt.label}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-[#556660]'}`}>
                      {opt.subLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stepper buttons: Decrement / Increment */}
            <div className="flex items-center justify-between pt-1 text-xs text-[#556660]">
              <button
                type="button"
                onClick={decreaseFontSize}
                disabled={fontSize === 'normal'}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5ECE8] bg-[#FAFCFB] hover:bg-[#EBF5F0] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="އަކުރު ކުޑަކުރޭ"
              >
                <ZoomOut className="w-3.5 h-3.5 text-[#1B6B52]" />
                <span>ކުޑަކުރޭ (A-)</span>
              </button>

              <button
                type="button"
                onClick={increaseFontSize}
                disabled={fontSize === 'xlarge'}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5ECE8] bg-[#FAFCFB] hover:bg-[#EBF5F0] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="އަކުރު ބޮޑުކުރޭ"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#1B6B52]" />
                <span>ބޮޑުކުރޭ (A+)</span>
              </button>
            </div>

            {/* Live Sample Text Preview */}
            <div className="mt-2 p-2 bg-[#FAFCFB] rounded-xl border border-[#E5ECE8] text-center">
              <span className="text-[11px] text-[#556660] block mb-0.5">ލައިވް ސާމްޕަލް:</span>
              <p className="text-sm font-semibold text-[#1B6B52] leading-relaxed">
                ބިސްމިﷲ - ކިޔުމަށް ފަސޭހަ ސައިޒެއް
              </p>
            </div>
          </div>

          {/* Section 2: Contrast Theme Options */}
          <div className="py-3 border-b border-[#E5ECE8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C2622]">ކުލަތަކުގެ ކޮންޓްރާސްޓް (Contrast Theme):</span>
              {isHighContrast && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  ހައި ކޮންޓްރާސްޓް އެކްޓިވް
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {contrastOptions.map((theme) => {
                const isSelected = contrastTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setContrastTheme(theme.id)}
                    className={`w-full p-2 rounded-xl text-right flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-[#EBF5F0] text-[#1B6B52] border-[#1B6B52] font-bold shadow-2xs'
                        : 'bg-white text-[#1C2622] border-[#E5ECE8] hover:bg-[#FAFCFB] hover:border-[#C8E0D5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        theme.id === 'high-contrast-dark' 
                          ? 'bg-neutral-900 border border-neutral-700' 
                          : theme.id === 'high-contrast-light'
                          ? 'bg-white border-2 border-black'
                          : 'bg-[#EBF5F0]'
                      }`}>
                        {theme.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold leading-tight">{theme.label}</div>
                        <div className="text-[10px] text-[#556660] font-latin">{theme.subLabel}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#1B6B52] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Reset button */}
          <div className="pt-3 flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#556660]">
              ސެޓިންގްސް އޮޓޯއިން ސޭވްވާނެ
            </span>

            <button
              type="button"
              onClick={resetAccessibility}
              disabled={!isCustomized}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#B83244] hover:bg-[#FDF1F2] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>އާދައިގެ ގޮތަށް (Reset)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
