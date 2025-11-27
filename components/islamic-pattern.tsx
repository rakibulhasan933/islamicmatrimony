export function IslamicPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-geo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0L20 10L10 20L0 10Z" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#islamic-geo)" />
    </svg>
  )
}

export function MosqueDome({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main Dome */}
      <path
        d="M40 150 L40 80 Q100 20 160 80 L160 150"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Crescent */}
      <circle cx="100" cy="35" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="103" cy="35" r="6" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.1" />
      {/* Minarets */}
      <rect x="25" y="60" width="10" height="90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <rect x="165" y="60" width="10" height="90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Minaret tops */}
      <path d="M25 60 L30 45 L35 60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M165 60 L170 45 L175 60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  )
}

export function CrescentMoon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M25 5C15 5 7 15 7 25C7 35 15 45 25 45C18 42 13 34 13 25C13 16 18 8 25 5Z"
        fill="currentColor"
        opacity="0.6"
      />
      <circle cx="35" cy="12" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hook */}
      <path d="M25 0 Q30 5 30 10 L30 15" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Top cap */}
      <path
        d="M15 15 L45 15 L42 25 L18 25 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Body */}
      <path
        d="M18 25 Q10 50 18 75 L42 75 Q50 50 42 25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Bottom cap */}
      <path d="M18 75 L15 85 L45 85 L42 75" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2" />
      {/* Decorative lines */}
      <line x1="22" y1="35" x2="22" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="30" y1="30" x2="30" y2="70" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="38" y1="35" x2="38" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

export function Ring({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="35" rx="18" ry="20" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
      <ellipse cx="30" cy="35" rx="14" ry="16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Diamond */}
      <path d="M30 8 L35 15 L30 22 L25 15 Z" fill="currentColor" opacity="0.6" />
      <path d="M27 12 L33 12" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}
