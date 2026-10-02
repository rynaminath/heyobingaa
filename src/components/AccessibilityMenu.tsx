import { useState, useRef, useEffect } from 'react';
import { useAccessibility, FontSizeScale, ContrastTheme, FONT_SIZE_SCALES } from '../context/AccessibilityContext';
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
  variant?: 'floating' | 'footer' | 'topbar' | 'mobile' | 'header-nav';
  className?: string;
  onCloseMobileDrawer?: () => void;
}

export default function AccessibilityMenu({ 
  variant = 'floating', 
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
  const [position, setPosition] = useState<{ top?: number; bottom?: number; right?: number }>({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = Math.min(360, window.innerWidth - 24);
    const menuHeight = 440;

    // Vertical position: immediately below the menu button
    let top: number | undefined = rect.bottom + 8;
    let bottom: number | undefined = undefined;

    // If opening near bottom of viewport (e.g. footer button), place above button
    if (top + menuHeight > window.innerHeight && rect.top > menuHeight) {
      top = undefined;
      bottom = window.innerHeight - rect.top + 8;
    }

    // Horizontal position: align with button right edge in RTL layout
    let right: number | undefined = window.innerWidth - rect.right;

    // Viewport containment: ensure at least 12px margin on left and right
    if (right < 12) right = 12;
    if (right + menuWidth > window.innerWidth - 12) {
      right = Math.max(12, window.innerWidth - menuWidth - 12);
    }

    setPosition({ top, bottom, right });
  };

  const toggleMenu = () => {
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

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
    { id: 'small', label: 'ކުޑަ', subLabel: '80%', scaleText: 'A-' },
    { id: 'normal', label: 'އާދައިގެ', subLabel: '88%', scaleText: 'A' },
    { id: 'large', label: 'ބޮޑު', subLabel: '100%', scaleText: 'A+' },
    { id: 'xlarge', label: 'ވަރަށް ބޮޑު', subLabel: '115%', scaleText: 'A++' }
  ];

  const contrastOptions: { id: ContrastTheme; label: string; subLabel: string; icon: React.ReactNode }[] = [
    { 
      id: 'normal', 
      label: 'އާދައިގެ (ފެހި)', 
      subLabel: 'Standard Emerald Theme',
      icon: <Palette className="w-4 h-4 text-[#1B6B52]" />
    },
    { 
      id: 'dark', 
      label: 'ޑާކް މޯޑް (Dark Mode)', 
      subLabel: 'Sleek Midnight Theme',
      icon: <Moon className="w-4 h-4 text-amber-400" />
    },
    { 
      id: 'blue', 
      label: 'ނޫ ތީމް (Blue Theme)', 
      subLabel: 'Oceanic & Royal Blue',
      icon: <span className="w-3.5 h-3.5 rounded-full bg-[#1E5B94] border border-sky-300 inline-block" />
    },
    { 
      id: 'red', 
      label: 'ރަތް ތީމް (Red Theme)', 
      subLabel: 'Rich Ruby & Crimson Red',
      icon: <span className="w-3.5 h-3.5 rounded-full bg-[#991B2D] border border-rose-300 inline-block" />
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
              {FONT_SIZE_SCALES[fontSize]} ({fontOptions.find((opt) => opt.id === fontSize)?.label})
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
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
                <span className="font-bold font-mono text-xs sm:text-sm leading-none">{opt.scaleText}</span>
                <span className="text-[11px] leading-tight truncate w-full px-0.5">{opt.label}</span>
                <span className={`text-[10px] font-mono ${fontSize === opt.id ? 'text-white/80' : 'text-[#556660]'}`}>{opt.subLabel}</span>
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

  // Floating, Footer, Topbar or Header Nav popover button
  const isUpward = variant === 'floating' || variant === 'footer';

  return (
    <div className={`${variant === 'floating' ? 'fixed bottom-6 left-6 z-40' : 'relative inline-block'} ${className}`}>
      {variant === 'floating' ? (
        <button
          ref={buttonRef}
          id="accessibility-settings-trigger"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg border transition-all duration-200 active:scale-95 font-thaana ${
            isCustomized
              ? 'bg-[#1B6B52] text-white border-[#14533F] ring-2 ring-emerald-400/40'
              : 'bg-white text-[#1C2622] hover:text-[#1B6B52] border-[#E5ECE8] hover:border-[#1B6B52]'
          }`}
          title="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
        >
          <div className="relative flex items-center justify-center">
            <Eye className="w-4 h-4 shrink-0" />
            {isCustomized && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white" />
            )}
          </div>
          <span className="text-xs font-bold hidden sm:inline">ފެނުމުގެ ފަސޭހަ</span>
        </button>
      ) : variant === 'footer' ? (
        <button
          ref={buttonRef}
          id="accessibility-settings-trigger-footer"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
          className="hover:text-white flex items-center gap-1.5 transition-colors text-xs text-[#D1E0D9] font-thaana cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#A7F3D0]" />
          <span>ފެނުމުގެ ފަސޭހަ</span>
          {isCustomized && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
          )}
        </button>
      ) : variant === 'header-nav' ? (
        <button
          ref={buttonRef}
          id="accessibility-settings-trigger-nav"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold font-thaana transition-all duration-200 border cursor-pointer ${
            isCustomized
              ? 'bg-[#1B6B52] text-white border-[#1B6B52] shadow-xs'
              : 'bg-[#FAFCFB] hover:bg-[#EBF5F0] text-[#1C2622] hover:text-[#1B6B52] border-[#E2E9E5]'
          }`}
          title="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
        >
          <Eye className={`w-4 h-4 shrink-0 ${isCustomized ? 'text-[#A7F3D0]' : 'text-[#1B6B52]'}`} />
          <span>ފެނުމުގެ ފަސޭހަ</span>
          {isCustomized && (
            <span className="w-2 h-2 rounded-full bg-amber-400 border border-white shrink-0 animate-pulse" />
          )}
        </button>
      ) : (
        <button
          ref={buttonRef}
          id="accessibility-settings-trigger"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="ފެނުމާއި ކިޔުމުގެ ފަސޭހަ (Accessibility Settings)"
          className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-thaana transition-all duration-200 cursor-pointer ${
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
      )}

      {/* Topmost Popover positioned directly below the menu button */}
      {isOpen && (
        <>
          {/* Subtle click-outside dismiss backdrop */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 99998 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Topmost Popover dropdown positioned right below the menu button */}
          <div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility Settings"
            style={{
              position: 'fixed',
              top: position.top !== undefined ? `${position.top}px` : undefined,
              bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
              right: position.right !== undefined ? `${position.right}px` : undefined,
              zIndex: 99999,
              direction: 'rtl'
            }}
            className="w-[calc(100vw-24px)] sm:w-88 max-w-[360px] bg-white text-[#1C2622] rounded-2xl shadow-2xl border-2 border-[#1B6B52]/25 p-4 sm:p-5 text-right font-thaana animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C2622] leading-tight">
                    ފެނުމާއި ކިޔުމުގެ ފަސޭހަ
                  </h4>
                  <p className="text-[11px] text-[#556660]">
                    Accessibility & Readability Settings
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1C2622] transition-colors cursor-pointer"
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
                <span>{FONT_SIZE_SCALES[fontSize]} ({fontOptions.find((opt) => opt.id === fontSize)?.label})</span>
              </div>
            </div>

            {/* Step buttons and Presets */}
            <div className="grid grid-cols-4 gap-1.5">
              {fontOptions.map((opt) => {
                const isSelected = fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontSize(opt.id)}
                    className={`py-2 px-1 rounded-xl text-center transition-all border flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#1B6B52] text-white border-[#1B6B52] font-bold shadow-xs scale-[1.02]'
                        : 'bg-white text-[#1C2622] border-[#E5ECE8] hover:bg-[#EBF5F0] hover:border-[#C8E0D5]'
                    }`}
                  >
                    <span className="font-bold font-mono text-xs sm:text-sm leading-none">{opt.scaleText}</span>
                    <span className="text-[11px] leading-tight truncate w-full px-0.5">{opt.label}</span>
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
                disabled={fontSize === 'small'}
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
          </div>

          {/* Section 2: Theme Options */}
          <div className="py-3 border-b border-[#E5ECE8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1C2622]">ތީމް (Theme Mode):</span>
              {isHighContrast && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  ތީމް އެކްޓިވް
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
                        theme.id === 'dark' 
                          ? 'bg-neutral-900 border border-neutral-700' 
                          : theme.id === 'blue'
                          ? 'bg-blue-50 border border-blue-200'
                          : theme.id === 'red'
                          ? 'bg-red-50 border border-red-200'
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
      </>
      )}
    </div>
  );
}
