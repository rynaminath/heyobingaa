import logoImg from '../images/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'colored';
  showSubtitle?: boolean;
}

export default function Logo({ size = 'md', variant = 'colored' }: LogoProps) {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16'
  };

  const titleSizes = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  const englishSizes = {
    sm: 'text-[11px]',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base'
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none text-right">
      {/* Official Uploaded Logo */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <img
          src={logoImg}
          alt="ހެޔޮބިންގާ ލޯގޯ"
          className="w-full h-full object-contain rounded-xl drop-shadow-xs transition-transform hover:scale-105"
        />
      </div>

      {/* Brand Typography: Dhivehi on top, English below */}
      <div className="flex flex-col justify-center leading-tight text-right items-start">
        <span className={`font-bold tracking-tight font-thaana text-right ${titleSizes[size]} ${variant === 'dark' ? 'text-white' : 'text-[#1E2623]'}`}>
          ހެޔޮބިންގާ
        </span>
        <span 
          dir="ltr" 
          className={`font-semibold font-latin tracking-wide text-right ${englishSizes[size]} ${variant === 'dark' ? 'text-white/80' : 'text-[#1B6B52]'}`}
        >
          Heyo Bingaa
        </span>
      </div>
    </div>
  );
}

