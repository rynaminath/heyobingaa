import logoImg from '../images/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'colored';
  showSubtitle?: boolean;
}

export default function Logo({ size = 'md', variant = 'colored', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl'
  };

  const subtitleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-3 select-none text-right">
      {/* Official Uploaded Logo */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <img
          src={logoImg}
          alt="ހެޔޮބިންގާ ލޯގޯ"
          className="w-full h-full object-contain rounded-xl drop-shadow-xs transition-transform hover:scale-105"
        />
      </div>

      {/* Brand Typography in Faruma Thaana */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-baseline gap-2">
          <span className={`font-bold tracking-tight font-thaana ${titleSizes[size]} ${variant === 'dark' ? 'text-white' : 'text-[#1E2623]'}`}>
            ހެޔޮބިންގާ
          </span>
          <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF5F0] text-[#1B6B52] border border-[#1B6B52]/20 font-latin">
            NGO
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-medium font-thaana ${subtitleSizes[size]} ${variant === 'dark' ? 'text-white/80' : 'text-[#1B6B52]'} mt-0.5`}>
            އުޚުތުންގެ ޖަމްޢިއްޔާ • 13+ އަހަރުގެ ޚިދުމަތް
          </span>
        )}
      </div>
    </div>
  );
}

